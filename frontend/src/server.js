// <getDependencies>
// Express.js app server
import express from 'express';
import { refreshTokenInMiddleware, isTokenExpired } from './refreshToken.js';
//import { access } from 'fs';
import { HTTPResponseError } from './error.js';
import "isomorphic-fetch";
import jwt_decode from 'jwt-decode';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { sortJson } from './sortJson.js';
import { getRemoteProfile } from './remoteProfile.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
// </getDependencies>

// <RefreshToken>
// Optional middleware to refresh the token if it is about to expire
// There are otherways to refresh, this was the easiest for this sample project
const refreshToken = async function (req, _, next) {

  // Set default middleware values
  req.tokenMiddleware = {
    "token": "",
    "decoded": ""
  };

  // Get token from injected headers
  req.tokenMiddleware.token = req.headers['x-ms-token-aad-access-token'];
  console.log(`refreshToken::req.headers['x-ms-token-aad-access-token']= ${req.headers['x-ms-token-aad-access-token']}`);
  
  if (!req.tokenMiddleware.token) {
    return next();
  }

  // Decode token
  req.tokenMiddleware.decoded = jwt_decode(req.tokenMiddleware.token);
  console.log(`refreshToken::req.tokenMiddleware.decoded= ${JSON.stringify(req.tokenMiddleware.decoded)}`);

  // Check if token is expired
  req.tokenMiddleware.isExpired = isTokenExpired(req.tokenMiddleware.decoded.exp);
  console.log(`refreshToken::req.tokenMiddleware.isExpired= ${JSON.stringify(req.tokenMiddleware.isExpired)})`);

  // If token is expired, refresh it
  if (req.tokenMiddleware.isExpired.expired) {

    console.log(`access-token-middleware - ${JSON.stringify(req.tokenMiddleware.isExpired.expired)})`);

    const refreshUrl = `https://${req.headers.host}/.auth/refresh`;
    req.tokenMiddleware.refreshedTokenResult = await refreshTokenInMiddleware(refreshUrl, req.tokenMiddleware.token);
    console.log(`access-token-middleware - ${JSON.stringify(req.tokenMiddleware.refreshedTokenResult)})`);
  }
  return next();
}
// </RefreshToken>

// <create>
export const create = async () => {

  // Create express app
  const app = express();

  // Refresh token middleware
  app.use(refreshToken)

  // set the view engine to ejs
  app.set('view engine', 'ejs');

  // Home page
  app.get('/', async (_, res) => {
    console.log("/");
    res.render(`${__dirname}/views/home`);
  });

  // Access token from injected header
  app.get('/debug', async (req, res) => {

    try {

      console.log("/debug");

      // Data for rendered view
      const dataForView = {
        error: undefined,
        accessToken: req.headers['x-ms-token-aad-access-token'],
        tokenMiddleware: sortJson(req.tokenMiddleware),
        headers: sortJson(req.headers),
        env: sortJson(process.env)
      };

      console.log(`access-token - dataForView: ${JSON.stringify(dataForView)}`);

      // Success - View
      res.render(`${__dirname}/views/debug`, dataForView)

    } catch (error) {

      // Failure - View
      res.render(`${__dirname}/views/debug`, { error })
    }
  });

  // Get remote profile
  // use access token as bearer token to API server
  app.get('/get-profile', async (req, res) => {

    try {

      // Get remote URL from environment variable
      // Should be in format of https://server/profile
      let remoteUrl = process.env.API_B_URL + "/get-profile";
      if (!remoteUrl) {
        console.log(`/get-profile:!remoteUrl= ${!remoteUrl}`);
        return res.render(`${__dirname}/views/profile`, { error: 'Client: No remote URL found' });
      } else {
        console.log(`remoteUrl = ${remoteUrl}`);
      }

      // Get access token from injected header
      let accessToken = req.headers['x-ms-token-aad-access-token'];
      console.log(`/get-profile:accessToken= ${accessToken}`);
      if (!accessToken) {
        return res.render(`${__dirname}/views/profile`, { error: 'Client: No access token found' });
      }

      // Get remote profile
      const response = await getRemoteProfile(remoteUrl, accessToken);
      console.log(response);

      const error = (response.error && Object.keys(response.error).length > 0 ) ? JSON.stringify(response.error) : "";

      // Data for rendered view
      const dataForView = {
        error,
        remoteUrl: remoteUrl,
        profile: sortJson(response.profile),
        headers: sortJson(response.headers),
        env: sortJson(response.env),
        bearerToken: response.bearerToken,
        raw: response
      };

      // Success - render view
      res.render(`${__dirname}/views/profile`, dataForView);


    } catch (error) {

      // Route-level Failure - render view
      console.log(` Route-level Failure - render view ${error.message}`);
      res.render(`${__dirname}/views/profile`, error.message );
    }
  });

  // instead of 404 - just return home page
  app.get('*', (_, res) => {
    res.redirect('/');
  });

  return app;
};
// </create>

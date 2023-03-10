// <getDependencies>
// Express.js app server
import express from 'express';
import { refreshTokenInMiddleware, isTokenExpired } from './refreshToken.js';
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
  
  if (!req.tokenMiddleware.token) {
    return next();
  }

  // Decode token
  req.tokenMiddleware.decoded = jwt_decode(req.tokenMiddleware.token);

  // Check if token is expired
  req.tokenMiddleware.isExpired = isTokenExpired(req.tokenMiddleware.decoded.exp);

  // If token is expired, refresh it
  if (req.tokenMiddleware.isExpired.expired) {

    const refreshUrl = `https://${req.headers.host}/.auth/refresh`;
    req.tokenMiddleware.refreshedTokenResult = await refreshTokenInMiddleware(refreshUrl, req.tokenMiddleware.token);
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
    res.render(`${__dirname}/views/home`);
  });

  // Access token from injected header
  app.get('/debug', async (req, res) => {

    try {

      // Data for rendered view
      const dataForView = {
        error: undefined,
        accessToken: req.headers['x-ms-token-aad-access-token'],
        scope: req.tokenMiddleware?.decoded?.scp, 
        user: req.tokenMiddleware?.decoded?.name,
        tokenMiddleware: sortJson(req.tokenMiddleware),
        headers: sortJson(req.headers),
        env: sortJson(process.env)
      };

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
      let remoteUrl = process.env.BACKEND_URL + "/get-profile";
      if (!remoteUrl) {
        return res.render(`${__dirname}/views/profile`, { error: 'Client: No remote URL found' });
      }

      // Get access token from injected header
      const accessToken = req.headers['x-ms-token-aad-access-token'];
      console.log(`accessToken: ${accessToken}`)
      
      const authEnabled = process.env.APPSETTING_WEBSITE_AUTH_ENABLED==='true' ? true : false;
      if (authEnabled && !accessToken) {
        return res.render(`${__dirname}/views/profile`, { error: 'Client: No access token found' });
      } 

      // Get remote profile
      const response = await getRemoteProfile(remoteUrl, accessToken, authEnabled);
      const error = (response.error && Object.keys(response.error).length > 0 ) ? JSON.stringify(response.error) : "";

      // Data for rendered view
      const dataForView = {
        error,
        remoteUrl,
        profile: sortJson(response.profile),
        headers: sortJson(response.headers),
        env: sortJson(response.env),
        authEnabled,
        bearerToken: response.bearerToken,
        raw: response
      };

      // Success - render view
      res.render(`${__dirname}/views/profile`, dataForView);

    } catch (error) {
      // Route-level Failure - render view
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

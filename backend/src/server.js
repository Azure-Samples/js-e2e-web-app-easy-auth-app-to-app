// <getDependencies>
// Express.js app server
import express from 'express';
import 'isomorphic-fetch';
import { sortJson, prettyJson } from './sortJson.js';
// </getDependencies>

// <create>
export const create = async () => {
  // Create express app
  const app = express();
  console.log('create app');

  // Get root
  app.get('/debug', async (req, res) => {
    console.log('/debug requested');

    res.send(
      prettyJson(
        sortJson({
          route: 'debug',
          headers: sortJson(req.headers),
          env: sortJson(process.env),
        })
      )
    );
  });

  // Get Profile and return to client
  app.get('/get-profile', async (req, res) => {
    console.log('/get-profile requested');

    try {
      const bearerToken =
        req.headers['Authorization'] || req.headers['authorization'];
      console.log(`bearerToken: ${bearerToken}`);

      const accessToken = bearerToken.split(' ')[1];
      console.log(`accessToken: ${accessToken}`);

      function validAccessToken(accessToken) {
        // access token validation removed for brevity

        return true;
      }

      // headers, bearerToken, and env returned for debugging only
      if (accessToken && validAccessToken(accessToken)) {
        return res.status(200).json({
          route: '/profile success',
          profile: {
            displayName: 'John Doe',
          },
          headers: req.headers, //
          bearerToken,
          env: process.env,
          error: null,
        });
      } else {
        return res.status(200).json({
          route: '/profile failure - empty or invalid accessToken',
          profile: null,
          headers: req.headers, //
          bearerToken,
          env: process.env,
          error: 'empty or invalid accessToken',
        });
      }
    } catch (err) {
      console.log(`/get-profile err: ${JSON.stringify(err)}`);
      return res.status(200).json({
        error: {
          route: '/profile error',
          profile: 'error',
          server_response: err,
          message: err.message,
        },
      });
    }
  });

  // instead of 404 - just return home page
  app.get('*', (req, res) => {
    res.json({ status: 'unknown url request' });
  });

  return app;
};
// </create>

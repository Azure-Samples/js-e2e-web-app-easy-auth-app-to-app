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
  console.log("create app");

  // Get root
  app.get('/debug', async (req, res) => {
    
    console.log("/debug requested");
    
    res.send(prettyJson(sortJson({
      headers: sortJson(req.headers),
      env: sortJson(process.env)
    })));
  })

  // Get Profile and return to client
  app.get('/get-profile', async (req, res) => {

    console.log("/get-profile requested");

    try {

      const fakeProfile = {
        "displayName": "John Doe",

        // return true if we have an access token
        "withAuthentication": false
      }

      const bearerToken = req.headers['Authorization'] || req.headers['authorization'];
      console.log(`bearerToken: ${bearerToken}`);

      if(!bearerToken) {
        const accessToken = bearerToken.split(' ')[1];
        console.log(`accessToken: ${accessToken}`);

        fakeProfile.withAuthentication = true;

        // get profile from Graph API
        // provided in next article in this series

      }

      return res.status(200).json({
        profile: fakeProfile,
        headers: req.headers,
        bearerToken,
        env: process.env,
        error: null
      });

    } catch (err) {
      console.log(`/get-profile err: ${JSON.stringify(err)}`);
      return res.status(200).json({
        error: {
          "profile": "error",
          "server_response": err,
          "message": err.message
        }
      });
    }
  });

  // instead of 404 - just return home page
  app.get('*', (req, res) => {
    res.json({status: "unknown url request"});
  });

  return app;
};
// </create>

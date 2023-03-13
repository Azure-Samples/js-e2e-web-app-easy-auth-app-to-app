// <getDependencies>
// Express.js app server
import express from 'express';
import 'isomorphic-fetch';
import { sortJson, prettyJson } from './sortJson.js';


// Uncomment for the app->app->graph tutorial
import { getGraphProfile } from './with-graph/graph.js';

// </getDependencies>

// <create>
export const create = async () => {
  // Create express app
  const app = express();

  // Get root
  app.get('/debug', async (req, res) => {

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

      const profile = {
        "displayName": "John Doe",

        // return true if we have an access token
        "withAuthentication": false
      }
      let profileFromGraph=false;
      //let graphProfile={};

      const bearerToken = req.headers['Authorization'] || req.headers['authorization'];
      console.log(`backend server.js bearerToken ${!!bearerToken ? 'found' : 'not found'}`);

      if (bearerToken) {
        const accessToken = bearerToken.split(' ')[1];
        

        if (!accessToken || accessToken === 'undefined' || accessToken === 'null' || accessToken.length === 0){
          console.log(`backend server.js accessToken: 'not found'}`);
          return res.status(401).json({ error: 'No access token found' });
        } else {
          console.log(`backend server.js accessToken: 'found' ${accessToken}}`);
          profile.withAuthentication = true;
        }

        // TODO: get profile from Graph API
        // Uncomment for the app->app->graph tutorial

        // where did the profile come from
        //profileFromGraph=true;

        // get the profile from Microsoft Graph
        //graphProfile = await getGraphProfile(accessToken);

        // log the profile for debugging
        // console.log(`profile: ${JSON.stringify(graphProfile)}`);
      }

      const dataToReturn = {
        route: '/profile success',
        profile: (profileFromGraph) ? { authentication: true, ...graphProfile }: {...profile},
        headers: req.headers,
        bearerToken,
        env: process.env,
        error: null,
      }
      console.log(`backend server.js profile: ${JSON.stringify(profile)}`)

      return res.status(200).json(dataToReturn);

    } catch (err) {
      const dataToReturn = {
        error: {
          route: '/profile error',
          profile: 'error',
          server_response: err,
          message: err.message,
        },
      }
      console.log(`backend server.js err message: ${err.message}`)

      // Return 200 so error displays in browser for debugging
      // Don't do this in production
      return res.status(200).json(dataToReturn);
    }
  });

  // instead of 404 - just return home page
  app.get('*', (_, res) => {
    res.json({ status: 'unknown url request' });
  });

  return app;
};
// </create>

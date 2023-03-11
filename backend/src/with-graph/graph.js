// ./backend/src/graph.js
import graph from "@microsoft/microsoft-graph-client";
import { getGraphToken } from "./auth.js";

// Create client from token with Graph API scope
export function getAuthenticatedClient(accessToken) {
    const client = graph.Client.init({
        authProvider: (done) => {
            done(null, accessToken);
        }
    });

    return client;
}
export async function getGraphProfile(accessToken) {
    // exchange current backend token for token with 
    // graph api scope
    const graphToken = await getGraphToken(accessToken);

    // use graph token to get Graph client
    const graphClient = getAuthenticatedClient(graphToken);

    // get profile of user
    const profile = await graphClient
        .api('/me')
        .get();

    return profile;
}
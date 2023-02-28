import { HTTPResponseError } from './error.js';
import { sortJson } from './sortJson.js';
import "isomorphic-fetch";

export const getRemoteProfile = async (remoteUrl, accessToken, authEnabled) => {

    try {

        if (!remoteUrl ) {
            console.log(`getRemoteProfile: !remoteUrl`);
            return {
                error: 'Client: No remote URL'
            };
        }

        
        if (authEnabled && !accessToken) {
            console.log(`getRemoteProfile: (authEnabled &&!accessToken)`);
            return {
                error: 'Client: No access token found'
            };
        }

        // Get remote profile
        const response = await fetch(remoteUrl, {
            cache: "no-store", // no caching -- for demo purposes only
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        console.log(console.log(`getRemoteProfile response: ${JSON.stringify(response)}`));

        // Check response status
        if (response.ok) {

            console.log(console.log(`getRemoteProfile response: response.ok`));

            // Get api response including profile
            const apiResponse = await response.json();
            console.log(console.log(`getRemoteProfile response json: ${JSON.stringify(apiResponse)}`));

            // Data for rendered view
            return {
                error: {},
                profile: sortJson(apiResponse.profile),
                headers: sortJson(apiResponse.headers),
                env: sortJson(apiResponse.env),
                bearerToken: apiResponse.bearerToken,
            };
        } else {
            
            const textError = await response.text();
            console.log(`getRemoteProfile api Fetch error text = ${textError}`);
            
            return {
                error: {
                    error: new HTTPResponseError(response),
                    message: `api response not ok ${response.statusCode} ${textError}`, 
                    type: "getRemoteProfile - api response",

                }
            }
        }
    } catch (error) {
        console.log(`getRemoteProfile caught error = ${error.message}`);
        return {
            error: {
                error: new HTTPResponseError(error),
                message: error.message,
                type: "getRemoteProfile - catch",
            }
        }
    }
}

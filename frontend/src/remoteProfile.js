import { HTTPResponseError } from './error.js';
import { sortJson } from './sortJson.js';
import "isomorphic-fetch";

export const getRemoteProfile = async (remoteUrl, accessToken, authEnabled) => {

    try {

        if (!remoteUrl ) {
            return {
                error: 'Client: No remote URL'
            };
        }

        
        if (authEnabled && !accessToken) {
            return {
                error: 'Client: No access token found'
            };
        }

        const config = {
            cache: "no-store", // no caching -- for demo purposes only
            method: 'GET',
            headers: {}
        }

        // Add access token as bearer token only if present
        if(!!accessToken){
            config.headers.Authorization= `Bearer ${accessToken}`
        }

        // Get remote profile
        const response = await fetch(remoteUrl, config);

        // Check response status
        if (response.ok) {

            // Get api response including profile
            const apiResponse = await response.json();
            console.log(`frontend remoteProfile.js getRemoteProfile response json: ${JSON.stringify(apiResponse?.profile)}`);

            // Data for rendered view
            return {
                error: {},
                profile: sortJson(apiResponse?.profile),
                headers: sortJson(apiResponse?.headers),
                env: sortJson(apiResponse?.env),
                bearerToken: apiResponse?.bearerToken,
            };
        } else {
            
            const textError = await response.text();
            console.log(`frontend remoteProfile.js getRemoteProfile api Fetch error text: ${response?.statusCode} ${textError}`);
            
            return {
                error: {
                    error: new HTTPResponseError(response),
                    message: `api response not ok ${response?.statusCode} ${textError}`, 
                    type: "getRemoteProfile - api response",

                }
            }
        }
    } catch (error) {
        console.log(`frontend remoteProfile.js getRemoteProfile caught error = ${error?.message}`);
        return {
            error: {
                error: new HTTPResponseError(error),
                message: error.message,
                type: "getRemoteProfile - catch",
            }
        }
    }
}

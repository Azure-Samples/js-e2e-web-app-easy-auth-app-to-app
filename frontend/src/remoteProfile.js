import { HTTPResponseError } from './error.js';
import { sortJson } from './sortJson.js';
import "isomorphic-fetch";

export const getRemoteProfile = async (remoteUrl, accessToken, authEnabled) => {

    try {

        if (!remoteUrl ) {
            console.log(`frontend remoteProfile.js getRemoteProfile: !remoteUrl`);
            return {
                error: 'Client: No remote URL'
            };
        }

        
        if (authEnabled && !accessToken) {
            console.log(`frontend remoteProfile.js getRemoteProfile: (authEnabled &&!accessToken)`);
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
        console.log(`frontend remoteProfile.js getRemoteProfile request access token: ${accessToken}`);
        console.log(`frontend remoteProfile.js getRemoteProfile response: ${JSON.stringify(response.status)}`);

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
            console.log(`frontend remoteProfile.js getRemoteProfile api Fetch error text: ${textError?.message}`);
            
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

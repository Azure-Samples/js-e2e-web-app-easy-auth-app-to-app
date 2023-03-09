// ./backend/src/auth.js
import MSAL from '@azure/msal-node';
import 'isomorphic-fetch';

// Programmatically get tenant id from env var
// Env var was set by Easy Auth in App Service
// env value should look something like: https://sts.windows.net/YOUR-TENANT-ID-AS-GUID/v2.0
export function getTenantId() {

    const openIdIssuer = process.env.WEBSITE_AUTH_OPENID_ISSUER;
    const backendAppTenantId = openIdIssuer.replace(/https:\/\/sts\.windows\.net\/(.{1,36})\/v2\.0/gm, '$1');

    return backendAppTenantId;
}
// ./backend/src/auth.js
// Exchange current bearerToken for Graph API token
// Env vars were set by Easy Auth in App Service
export async function getGraphToken(backEndAccessToken) {

    const config = {
        // MSAL configuration
        auth: {
            // the backend's authentication CLIENT ID 
            clientId: process.env.WEBSITE_AUTH_CLIENT_ID,
            // the backend's authentication CLIENT SECRET 
            clientSecret: process.env.MICROSOFT_PROVIDER_AUTHENTICATION_SECRET,
            // OAuth 2.0 authorization endpoint (v2)
            // should be: https://login.microsoftonline.com/BACKEND-TENANT-ID
            authority: `https://login.microsoftonline.com/${getTenantId()}`
        },
        // used for debugging
        system: {
            loggerOptions: {
                loggerCallback(loglevel, message, containsPii) {
                    console.log(message);
                },
                piiLoggingEnabled: true,
                logLevel: MSAL.LogLevel.Verbose,
            }
        }
    };

    const clientCredentialAuthority = new MSAL.ConfidentialClientApplication(config);

    const oboRequest = {
        oboAssertion: backEndAccessToken,
        // this scope must already exist on the backend authentication app registration 
        // and visible in resources.azure.com backend app auth config
        scopes: ["https://graph.microsoft.com/.default"]
    }

    // This example has Easy auth validate token in App service runtime
    // from headers that can't be set externally

    // If you aren't using App service/Easy Auth, 
    // you must validate your access token yourself
    // before calling this code
    try {
        const { accessToken } = await clientCredentialAuthority.acquireTokenOnBehalfOf(oboRequest);
        return accessToken;
    } catch (error) {
        console.log(`getGraphToken:error.type = ${error.type}  ${error.message}`);
    }
}

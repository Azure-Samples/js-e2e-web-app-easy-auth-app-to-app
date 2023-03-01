import "isomorphic-fetch";
import { HTTPResponseError } from './error.js';

export const refreshTokenInMiddleware = async (url, accessToken) => {

    try {
        // Get refreshed token
        if (!url) {
            return {
                refreshed: false,
                status: `!url`
            }
        };

        // Get remote profile
        const response = await fetch(url, {
            cache: "no-store", // no caching -- for demo purposes only
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        // // Check response status
        if (response.ok) {
            return {
                refreshed: true,
                status: response.status
            }
        } else {
            return {
                refreshed: false,
                status: response.status,
                error: new HTTPResponseError(response)
            }
        }
    } catch (err) {
        console.log(`frontend refreshToken.js: ${JSON.stringify(err)}`);
    }

}
export const isTokenExpired = (expiration) => {

    // Get token expired time
    const expiredTime = expiration;
    const expirationDate = new Date(expiredTime * 1000);

    const currentTime = (+ new Date()); // current time in seconds
    const currentTimeDate = new Date(currentTime);

    if (currentTime > (expiredTime * 1000)) {

        return {
            expired: true,
            expiredTime,
            expirationDate,
            currentTime,
            currentTimeDate,
            minutes_remaining: 0,
            refreshed: false,
            cause: "token expired"
        };

    } else {
        const minutes_remaining = Math.round((((expirationDate - currentTimeDate) % 86400000) % 3600000) / 60000);

        return {
            expired: false,
            expiredTime,
            expirationDate,
            currentTime,
            currentTimeDate,
            minutes_remaining,
            refreshed: false,
            cause: "token NOT expired"
        };
    }
}
// Service/api.js

/**
 * pull M-Data to keep in Global State or Context
 * @returns
 */
export const getMetadata = async () => {
    const response = await fetch(API.M_VALUE_ENDPOINT);
    return await response.json();
};

// Service/api.js

/**
 * pull M-Data to keep in Global State or Context
 * @returns
 */
export const getMetadata = async () => {
    const response = await fetch("/api/m-data");
    return await response.json();
};

const NOROFF_API_URL = "https://v2.api.noroff.dev";
const accessToken = localStorage.getItem("accessToken");
/**
 *Requests and retrieves an API key for a user with the provided authentication token.
 * @param {string} token 
 * @returns {Promise<string>}
 */
async function getApiKey(token) {
    try {
        const response = await fetch(`${NOROFF_API_URL}/auth/create-api-key`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                name: "API KEY"
            })
        })

        const result = await response.json();
        return result.data.key;
    } catch (error) {
        console.log(error);
    }
}
/**
 *Makes an authenticated API call to a specified endpoint using the provided access token.
 * @param {string} endpoint 
 */
export async function apiCall(endpoint) {
    const apiKey = await getApiKey(accessToken);
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": apiKey
        }
    }    
    try {
        const response = await fetch(`${NOROFF_API_URL}${endpoint}`, options)
        const result = await response.json();
        return result;
    } catch (error) {
        
    }
}

/**
 * @description Sends a POST request to the specified endpoint with the provided data.
 * @param {string} endpoint
 * @param {Object} [data={}]
 * @returns {Promise<Object>}
 */
export async function postApiData(endpoint, data = {}) {
    const apiKey = await getApiKey(accessToken);
    const options = {
        method: "post",
        headers: {
            "Content-Type" : "application/json",
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": apiKey
        },
        body: JSON.stringify(data)
    }
    const response = await fetch (`${NOROFF_API_URL}${endpoint}`, options)
    return response.json();
}

/**
 * @description Sends a PUT request to the specified endpoint with the provided data.
 * @param {string} endpoint
 * @param {Object} [data={}]
 * @returns {Promise<Object>}
 */
export async function putApiData(endpoint, data = {}) {
    const apiKey = await getApiKey(accessToken);
    const options = {
        method: "put",
        headers: {
            "Content-Type" : "application/json",
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": apiKey
        },
        body: JSON.stringify(data)
    }
    const response = await fetch (`${NOROFF_API_URL}${endpoint}`, options)
    return response.json();

}

/**
 * @description Sends a DELETE request to the specified endpoint with the provided data.
 * @param {string} endpoint
 * @param {Object} [data={}]
 * @returns {Promise<void>}
 */
export async function deleteApiData(endpoint, data = {}) {
    const apiKey = await getApiKey(accessToken);
    const options = {
        method: "delete",
        headers: {
            "Content-Type" : "application/json",
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": apiKey
        },
        body: JSON.stringify(data)
    }
    const response = await fetch (`${NOROFF_API_URL}${endpoint}`, options)
}
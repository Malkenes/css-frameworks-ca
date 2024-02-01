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
        console.log(result);
    } catch (error) {
        
    }
}
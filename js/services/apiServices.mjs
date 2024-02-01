const NOROFF_API_URL = "https://v2.api.noroff.dev";

export async function getApiKey(token) {
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

export async function apiCall(options) {
    try {
        const response = await fetch(`${NOROFF_API_URL}/social/profiles`, options)
        const result = await response.json();
        console.log(result);
    } catch (error) {
        
    }
}
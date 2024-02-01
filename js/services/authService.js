const NOROFF_API_URL = "https://v2.api.noroff.dev";

export async function signIn(data) {
    try {
        const response = await fetch(`${NOROFF_API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
          },
        body: JSON.stringify(data) 
        });

        if (!response.ok) {
            const authError = document.querySelector("#auth-error");
            authError.style.display = "block";
            if (response.status === 401) {
                authError.textContent = "Incorrect Password";
            }
        } else {
            window.location.href = "/profile/index.html";
        }

        const result = await response.json();
        localStorage.setItem("accessToken", result.data.accessToken);

    } catch (error) {
        console.log(error);
    }
}
async function registerUser(data) {
    try {
        const response = await fetch(`${NOROFF_API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const authError = document.querySelector("#auth-error");
            authError.style.display = "block";
        } else {
            const signInData = (({email, password}) => ({email, password}))(data);
            signIn(signInData);
        }
    } catch (error) {
        console.log(error);
    }
}

export function loginFormValidation(form) {
    const dataObject = {}
    const inputInForms = form.querySelectorAll("input");

    Array.from(inputInForms).forEach(input => {
        if(inputValidation(input)) {
            const key = input.name;
            dataObject[key] = input.value;
        } else {
            input.classList.add("is-invalid");
        }
    })
    if ("email" in dataObject && "password" in dataObject) {
        if ("name" in dataObject) {
            registerUser(dataObject);
        } else {
            signIn(dataObject);
        }
    }
}

export function inputValidation(input) {
    if (input.type === "text") {
        return (userNameValidation(input.value));
    }

    if (input.type === "email") {
        return (emailValidation(input.value))
    }

    if (input.type === "password") {
        if (input.value.length >= 8) {
            if (input.id ==="registerPasswordRepeat") {
                const pass = document.querySelector("#registerPassword");
                return (pass.value === input.value); 
            } else {
                return true;
            }
        }
    } 
}

let emailValidation = (email) => {
    const regEx = /\S+@(?:stud\.)?noroff\.no$/;
    return regEx.test(email);
}
let userNameValidation = (username) => {
    const regEx = /^[a-zA-Z0-9_]+$/;
    return regEx.test(username);
}
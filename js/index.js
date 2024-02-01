import { loginFormValidation, inputValidation } from "./services/authService.js";
import { getApiKey, apiCall } from "./services/apiServices.mjs";

const accessToken = localStorage.getItem("accessToken");
const apiKey = await getApiKey(accessToken);
const options = {
    headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey
    }
}
apiCall(options);
const forms = document.querySelectorAll(".needs-validation");

Array.from(forms).forEach(form => {
    const inputInForms = form.querySelectorAll("input");
    Array.from(inputInForms).forEach(input => {
        input.addEventListener("focusout", () => {
            if (input.value.length > 0) {
                if(inputValidation(input)) {
                    input.classList.add("is-valid");
                } else {
                    input.classList.add("is-invalid");
                }
            };
        });
        input.addEventListener("focusin", () => {
            input.classList.remove("is-valid", "is-invalid");
        })
    })
    form.addEventListener("submit", event => {
        event.preventDefault();
        
        loginFormValidation(form);
    }, false)
})


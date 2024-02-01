import { initializeFormValidation } from "./services/authService.mjs";
import { apiCall } from "./services/apiServices.mjs";
if (localStorage["accessToken"]) {
    apiCall("/social/profiles");
}

const forms = document.querySelectorAll(".needs-validation");
initializeFormValidation(forms);



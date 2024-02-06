import { initializeFormValidation } from "./services/authService.mjs";
import { apiCall } from "./services/apiServices.mjs";
import { displayFeed } from "./pages/feed.mjs";
if (localStorage["accessToken"]) {
    const apiName = await apiCall("/social/profiles/" + localStorage["name"]);
    const user = document.querySelectorAll(".user-profile");
    Array.from(user).forEach(img => {
        img.src = apiName.data.avatar.url;
        img.alt = apiName.data.avatar.alt;
    })

    const feed = document.querySelector("#feed");
    if (feed) {
        let page = 1;
        fetchFeed(page);
        window.onscroll = function() {
            if (window.innerHeight + window.scrollY > document.body.scrollHeight - 1) {
                page += 1;
                fetchFeed(page);
            }
        };    
    }
}

async function fetchFeed(page) {
    const apiData = await apiCall("/social/posts?limit=10&_author=true&_reactions=true&_comments=true&page=" + page);
    console.log(apiData);
    displayFeed(apiData);
}
const forms = document.querySelectorAll(".needs-validation");
initializeFormValidation(forms);



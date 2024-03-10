import { initializeFormValidation } from "./services/authService.mjs"
import { apiCall} from "./services/apiServices.mjs";
import { getFeed } from "./pages/feed.mjs";
import { getProfile } from "./pages/profilePage.mjs";
import { initializeSearch} from "./components/search.mjs";
import { displaySinglePost } from "./pages/post.mjs";
import { displaySearchResults } from "./pages/search.mjs";
import { createNewPost, editPost, addMedia, addTag, editTag, handlePostInteraction } from "./components/postHandler.mjs";


if (localStorage["accessToken"]) {
    updateLoggedInUserUI();
    const queryString = document.location.search;
    const params = new URLSearchParams(queryString);
    const userParam = params.get("user");
    const postParam = params.get("id");
    const searchParam = params.get("search");
    if (searchParam) {
        displaySearchResults(searchParam);
    }
    if (postParam) {
        displaySinglePost(postParam);    
    }
    const feed = document.querySelector("#feed");
    if (feed) {
        if (userParam) {
            getProfile(userParam);
        } else {
            getFeed();
        }
    }
} else {
    const desiredPagePath = "/index.html";
    const desiredPageURL = window.location.origin + desiredPagePath;
    if (window.location.href !== desiredPageURL) {
        window.location.href = desiredPageURL;
    }
}

const forms = document.querySelectorAll(".needs-validation");
initializeFormValidation(forms);

const createPost = document.querySelector("#create-post");
const postForm = document.querySelector("#post-form");
const closePostForm = document.querySelector("#close-postform");
const editForm = document.querySelector("#edit-form");
if (editForm) {
    editForm.addEventListener("submit", editPost)
}

if (createPost) {
    createPost.addEventListener("click", () => {
        postForm.classList.remove("d-none");
        createPost.classList.add("d-none");
    })


    closePostForm.addEventListener("click" , () => {
        postForm.classList.add("d-none");
        createPost.classList.remove("d-none");

    })
}
if (postForm) {
    postForm.addEventListener("submit", createNewPost)
}



const editTags = document.querySelector("#edit-add-tag");
if (editTags) {
    editTags.addEventListener("click" , editTag);
}
const addTags = document.querySelector("#add-tag");
if (addTags) {
    addTags.addEventListener("click" , addTag);

    const mediaToggle = document.querySelector("#media-toggle");
    mediaToggle.addEventListener("click", addMedia);

    const mediaUrlTest = document.querySelector("#media-url-input");
    mediaUrlTest.addEventListener("focusout", () => {
        const image = document.querySelector("#placeholder-image");
        image.src = mediaUrlTest.value;
    })
}

const logoutBtn = document.querySelector("#logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "../index.html";
    })
}
initializeSearch();
/**
 * @description Updates the UI elements for the logged-in user based on their profile data.
 * @returns {Promise<void>}
 */
async function updateLoggedInUserUI() {
    try {
        const apiName = await apiCall("/social/profiles/" + localStorage["name"]);
        const user = document.querySelectorAll(".user-profile");
        Array.from(user).forEach(img => {
            img.src = apiName.data.avatar.url;
            img.alt = apiName.data.avatar.alt;
        })
        const userLink = document.querySelectorAll(".user-profile-link");
        Array.from(userLink).forEach(link => {
            link.href = "/profile/index.html?user=" + localStorage["name"];
        })    
    } catch (error) {
        console.log(error);
    }
}

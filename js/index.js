import { initializeFormValidation } from "./services/authService.mjs"
import { apiCall} from "./services/apiServices.mjs";
import { displayFeed, getFeed } from "./pages/feed.mjs";
import { displayProfile } from "./pages/profilePage.mjs";
import { displayLiveSearch, executeSearch} from "./components/search.mjs";
import { displaySinglePost } from "./pages/post.mjs";
import { displaySearchResults } from "./pages/search.mjs";
import { createNewPost, editPost, addMedia, addTag, editTag, handlePostInteraction } from "./components/postHandler.mjs";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";


if (localStorage["accessToken"]) {
    const apiName = await apiCall("/social/profiles/" + localStorage["name"]);
    const user = document.querySelectorAll(".user-profile");
    Array.from(user).forEach(img => {
        img.src = apiName.data.avatar.url;
        img.alt = apiName.data.avatar.alt;
    })
    const userLink = document.querySelectorAll(".user-profile-link");
    Array.from(userLink).forEach(link => {
        link.href = "../profile/index.html?user=" + localStorage["name"];
    })

    const queryString = document.location.search;
    const params = new URLSearchParams(queryString);
    const userParam = params.get("user");
    const postParam = params.get("id");
    const searchParam = params.get("search");
    if (userParam) {
        const userProfile = await apiCall("/social/profiles/" + userParam + "?_following=true&_followers=true");
        displayProfile(userProfile);
    }
    if (searchParam) {
        displaySearchResults(searchParam);
    }
    const feed = document.querySelector("#feed");
    if (feed) {
        if (userParam) {
            const apiData = await apiCall(`/social/profiles/${userParam}/posts` +"?_author=true&_reactions=true&_comments=true");
            displayFeed(apiData.data);
        } else if (postParam) {
            const postById = await apiCall("/social/posts/" + postParam + "?_author=true&_reactions=true&_comments=true");
            displaySinglePost(postById.data);    
        } else {
            getFeed();
        }
        feed.addEventListener("click", handlePostInteraction)        
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




const addTags = document.querySelector("#add-tag");
if (addTags) {
    addTags.addEventListener("click" , addTag);

    const editTags = document.querySelector("#edit-add-tag");
    editTags.addEventListener("click" , editTag);

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
const searchResultContainer = document.querySelector("#search-results");
if (searchResultContainer) {
    displayLiveSearch();
}

const searchForm = document.querySelector("#search-form");
if (searchForm) {
    searchForm.addEventListener("submit", executeSearch)
}


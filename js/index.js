import { initializeFormValidation } from "./services/authService.mjs";
import { apiCall, deleteApiData, postApiData, putApiData } from "./services/apiServices.mjs";
import { clearFeed, displayFeed, displayFeedTest } from "./pages/feed.mjs";
import { displayProfile } from "./pages/profilePage.mjs";
import { handleInputChange } from "./components/search.mjs";
import { displaySinglePost } from "./pages/post.mjs";
import { displaySearchResults } from "./pages/search.mjs";
import { updateReactions } from "./components/commentSection.mjs";

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
    if (userParam) {
        const userProfile = await apiCall("/social/profiles/" + userParam + "?_following=true&_followers=true");
        displayProfile(userProfile);
    }
    const postParam = params.get("id");
    if (postParam) {
        //const postById = await apiCall("/social/posts/" + postParam + "?_author=true&_reactions=true&_comments=true");
        //displaySinglePost(postById.data);
    }
    const searchParam = params.get("search");
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
            displayFeedTest();
        }
        feed.addEventListener("click", function(e) {
            const postContainer = e.target.closest("[data-id]");
            const postId = postContainer.dataset.id;
            if (e.target.classList.contains("react-btn")) {
                const emoji = e.target.childNodes[0].nodeValue.trim();
                async function reactToPost() {
                    const testEmo = await putApiData(`/social/posts/${postId}/react/${emoji}`);
                    updateReactions(postContainer, testEmo.data.reactions);
                }
                reactToPost();
            }
            if (e.target.classList.contains("toggle-comment-btn")) {
                const commentContainer = e.target.closest(".comment-container");
                const collapseElement = commentContainer.querySelector(".collapse");
                collapseElement.classList.toggle("show");
            }
            if (e.target.classList.contains("delete-btn")) {
                deleteApiData(`/social/posts/${postId}`);
            }
            if (e.target.classList.contains("edit-btn")) {
                editPost(postId);
            }
            if (e.target.classList.contains("comment-btn")) {
                e.preventDefault();
                const textarea = e.target.closest(".comment-form").querySelector("textarea");
                const body = textarea.value;
                postApiData(`/social/posts/${postId}/comment`,{body: body});
            }
            if (e.target.classList.contains("delete-comment-btn")) {
                const comment = e.target.closest("[data-comment-id]");
                const commentId = comment.dataset.commentId;
                deleteApiData(`/social/posts/${postId}/comment/${commentId}`);
            }
        })
        
    }
    /*
    feed.addEventListener("click", function(e) {
        const postContainer = e.target.closest("[data-id]");
        const postId = postContainer.dataset.id;
        if (e.target.classList.contains("react-btn")) {
            const emoji = e.target.childNodes[0].nodeValue.trim();
            putApiData(`/social/posts/${postId}/react/${emoji}`);
        }
        if (e.target.classList.contains("toggle-comment-btn")) {
            const commentContainer = e.target.closest(".comment-container");
            const collapseElement = commentContainer.querySelector(".collapse");
            collapseElement.classList.toggle("show");
        }
        if (e.target.classList.contains("delete-btn")) {
            deleteApiData(`/social/posts/${postId}`);
        }
        if (e.target.classList.contains("edit-btn")) {
            editPost(postId);
        }
        if (e.target.classList.contains("comment-btn")) {
            e.preventDefault();
            const textarea = e.target.closest(".comment-form").querySelector("textarea");
            const body = textarea.value;
            postApiData(`/social/posts/${postId}/comment`,{body: body});
        }
        if (e.target.classList.contains("delete-comment-btn")) {
            const comment = e.target.closest("[data-comment-id]");
            const commentId = comment.dataset.commentId;
            deleteApiData(`/social/posts/${postId}/comment/${commentId}`);
        }
    })
    */
}

const forms = document.querySelectorAll(".needs-validation");
initializeFormValidation(forms);

const createPost = document.querySelector("#create-post");
const postForm = document.querySelector("#post-form");
const closePostForm = document.querySelector("#close-postform");
const editForm = document.querySelector("#edit-form");
if (editForm) {
    editForm.addEventListener("submit", event => {
        event.preventDefault();
        const dataPackage = {}
    
        const postId = document.querySelector("#myModal").dataset.id;
        const title = document.querySelector("#edit-title-input").value;
        const body = document.querySelector("#edit-body-input").value;
        const mediaUrl = document.querySelector("#edit-media-url-input").value;
        const mediaAlt = document.querySelector("#edit-media-alt-input").value;
        const tags = document.querySelector("#edit-added-tags");
        const currentTags = tags.querySelectorAll("span");
        const tagsByName = Array.from(currentTags).map((currentTag) => {
            return currentTag.textContent;
        })
        if (title) {
            dataPackage.title = title;
        }
        if (body) {
            dataPackage.body = body;
        }
        if (mediaUrl) {
            dataPackage.media = {}
            dataPackage.media.url = mediaUrl;
            if (mediaAlt) {
                dataPackage.media.alt = mediaAlt;
            }    
        }
        if (tagsByName) {
            dataPackage.tags = tagsByName;
        }
        putApiData(`/social/posts/${postId}`, dataPackage);
        console.log(dataPackage);
        console.log(postId);
    })
    
}
/*
editForm.addEventListener("submit", event => {
    event.preventDefault();
    const dataPackage = {}

    const postId = document.querySelector("#myModal").dataset.id;
    const title = document.querySelector("#edit-title-input").value;
    const body = document.querySelector("#edit-body-input").value;
    const mediaUrl = document.querySelector("#edit-media-url-input").value;
    const mediaAlt = document.querySelector("#edit-media-alt-input").value;
    const tags = document.querySelector("#edit-added-tags");
    const currentTags = tags.querySelectorAll("span");
    const tagsByName = Array.from(currentTags).map((currentTag) => {
        return currentTag.textContent;
    })
    if (title) {
        dataPackage.title = title;
    }
    if (body) {
        dataPackage.body = body;
    }
    if (mediaUrl) {
        dataPackage.media = {}
        dataPackage.media.url = mediaUrl;
        if (mediaAlt) {
            dataPackage.media.alt = mediaAlt;
        }    
    }
    if (tagsByName) {
        dataPackage.tags = tagsByName;
    }
    putApiData(`/social/posts/${postId}`, dataPackage);
    console.log(dataPackage);
    console.log(postId);
})*/
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
    postForm.addEventListener("submit", event => {
        event.preventDefault();
        const dataPackage = {}
        const title = document.querySelector("#title-input").value;
        const body = document.querySelector("#body-input").value;
        const mediaUrl = document.querySelector("#media-url-input").value;
        const mediaAlt = document.querySelector("#media-alt-input").value;
        const tags = document.querySelector("#added-tags");
        const currentTags = tags.querySelectorAll("span");
        const tagsByName = Array.from(currentTags).map((currentTag) => {
            return currentTag.textContent;
        })
        if (title) {
            dataPackage.title = title;
        }
        if (body) {
            dataPackage.body = body;
        }
        if (mediaUrl) {
            dataPackage.media = {};
            dataPackage.media.url = mediaUrl;
            if (mediaAlt) {
                dataPackage.media.alt = mediaAlt;
            }    
        }
        if (tagsByName) {
            dataPackage.tags = tagsByName;
        }
        console.log(dataPackage);
        postApiData("/social/posts", dataPackage);
        //postForm.reset();
    })
    
}
/*
postForm.addEventListener("submit", event => {
    event.preventDefault();
    const dataPackage = {}
    const title = document.querySelector("#title-input").value;
    const body = document.querySelector("#body-input").value;
    const mediaUrl = document.querySelector("#media-url-input").value;
    const mediaAlt = document.querySelector("#media-alt-input").value;
    const tags = document.querySelector("#added-tags");
    const currentTags = tags.querySelectorAll("span");
    const tagsByName = Array.from(currentTags).map((currentTag) => {
        return currentTag.textContent;
    })
    if (title) {
        dataPackage.title = title;
    }
    if (body) {
        dataPackage.body = body;
    }
    if (mediaUrl) {
        dataPackage.media = {};
        dataPackage.media.url = mediaUrl;
        if (mediaAlt) {
            dataPackage.media.alt = mediaAlt;
        }    
    }
    if (tagsByName) {
        dataPackage.tags = tagsByName;
    }
    console.log(dataPackage);
    postApiData("/social/posts", dataPackage);
    //postForm.reset();
})*/

let addMedia = () => {
    const mediaInputs = document.querySelector(".add-media");
    const mediaIcon = document.querySelector("#media-image");
    const closeIcon = document.querySelector("#media-close");

    if (mediaInputs.classList.contains("d-none")) {
        mediaInputs.classList.remove("d-none");
        mediaIcon.classList.add("d-none");
        closeIcon.classList.remove("d-none");
    } else {
        mediaInputs.classList.add("d-none");
        mediaIcon.classList.remove("d-none");
        closeIcon.classList.add("d-none");
    }
}
function addTag() {
    const tagInput = document.querySelector("#tags-input");
    const tag = tagInput.value.trim().toLowerCase();
    const addedTags = document.querySelector("#added-tags");
    const currentTags = addedTags.querySelectorAll("span");
    const tagsByName = Array.from(currentTags).map((currentTag) => {
        return currentTag.textContent;
    })
    if (tag !== "" && !dublicateTag(tagsByName,tag)) {
        const tagElement = document.createElement("span");
        tagElement.classList.add("p-1", "bg-secondary-subtle", "tag")
        tagElement.textContent = tag;
        tagElement.onclick = function() {
            tagElement.remove();
        }
        addedTags.append(tagElement);
    }
    tagInput.value = "";
}

function editTag() {
    const tagInput = document.querySelector("#edit-tags-input");
    const tag = tagInput.value.trim().toLowerCase();
    const addedTags = document.querySelector("#edit-added-tags");
    const currentTags = addedTags.querySelectorAll("span");
    const tagsByName = Array.from(currentTags).map((currentTag) => {
        return currentTag.textContent;
    })
    if (tag !== "" && !dublicateTag(tagsByName,tag)) {
        const tagElement = document.createElement("span");
        tagElement.classList.add("p-1", "bg-secondary-subtle", "tag")
        tagElement.textContent = tag;
        tagElement.onclick = function() {
            tagElement.remove();
        }
        addedTags.append(tagElement);
    }
    tagInput.value = "";
}


let dublicateTag = (tags, tag) => {
    const foundTag = tags.find((currentTag) => {
        if (currentTag === tag) {
            return true;
        }
    })
    if (foundTag) {
        return true;
    }
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

async function editPost(id) {
    const myModal = new bootstrap.Modal(document.getElementById("myModal"))
    const response = await apiCall(`/social/posts/${id}`);
    const data = response.data;
    document.querySelector("#myModal").dataset.id = data.id;
    document.querySelector("#edit-title-input").value = data.title;
    document.querySelector("#edit-body-input").value = data.body;
    document.querySelector("#edit-media-url-input").value = data.media.url;
    document.querySelector("#edit-media-alt-input").value = data.media.alt;
    const addedTags = document.querySelector("#edit-added-tags");
    const currentTags = addedTags.querySelectorAll("span");
    const tagsByName = Array.from(currentTags).map((currentTag) => {
        return currentTag.textContent;
    })

    data.tags.forEach(tag => {
        if (!dublicateTag(tagsByName, tag)) {
            const tagElement = document.createElement("span");
            tagElement.classList.add("p-1", "bg-secondary-subtle", "tag")
            tagElement.textContent = tag;
            tagElement.onclick = function() {
                tagElement.remove();
            }    
            addedTags.append(tagElement);
        }
    })
    myModal.toggle();
}

const logoutBtn = document.querySelector("#logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "../index.html";
    })
}

const searchInput = document.querySelector("#search-input");
const searchResultContainer = document.querySelector("#search-results");
if (searchResultContainer) {
    const searchResults = new bootstrap.Collapse("#search-results", {toggle: false});
    searchInput.addEventListener("input", handleInputChange);
    searchInput.addEventListener("focusin", () => {
        searchResults.show();
    })
    searchInput.addEventListener("focusout", () => {
        setTimeout(function() {
            searchResults.hide();
        },1000);
    })
}

const searchForm = document.querySelector("#search-form");
if (searchForm) {
    searchForm.addEventListener("submit", event => {
        event.preventDefault();
        if (searchInput.value.length > 0) {
            window.location.href = "/search/index.html?search=" + searchInput.value;
        }
    })
}
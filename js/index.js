import { initializeFormValidation } from "./services/authService.mjs";
import { apiCall, deleteApiData, postApiData, putApiData } from "./services/apiServices.mjs";
import { clearFeed, displayFeed } from "./pages/feed.mjs";
import { displayProfile } from "./pages/profilePage.mjs";
import { handleInputChange } from "./components/search.mjs";

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
    const feed = document.querySelector("#feed");
    if (feed) {
        let page = 1;
        fetchFeed(page);
        window.onscroll = function() {
            if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
                page += 1;
                fetchFeed(page);
            }
        };    
    }
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
}

async function fetchFeed(page) {
    const queryString = document.location.search;
    const params = new URLSearchParams(queryString);
    const user = params.get("user");
    let endpoint = "/social/posts";
    if (user) {
        endpoint = `/social/profiles/${user}/posts`;
    }
    const apiData = await apiCall(endpoint +"?limit=10&_author=true&_reactions=true&_comments=true&page=" + page);
    console.log(apiData);
    displayFeed(apiData.data);
}
const forms = document.querySelectorAll(".needs-validation");
initializeFormValidation(forms);

const createPost = document.querySelector("#create-post");
const postForm = document.querySelector("#post-form");
const closePostForm = document.querySelector("#close-postform");
const editForm = document.querySelector("#edit-form");
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

const trending = document.querySelector("#trending");
if (trending) {
    trending.addEventListener("click", async () => {
        const allPosts = await getAllPosts();
        allPosts.sort((a,b) => calculatePopularityScore(b) - calculatePopularityScore(a));
        console.log(allPosts);
        getTagCount(allPosts);
        const filteredAllPosts = allPosts.filter((post) => {
            const date = Date.parse(post.created);
            const timeElapsed = Date.now() - date;
            if (timeElapsed <= 1000*60*60*24) {
                return true;
            } else {
                return false;
            }
        })
        console.log(filteredAllPosts);
        //clearFeed();
        //displayFeed(allPosts);
    });
}

async function getAllPosts() {
    const allDatatest = [];
    let datatest = await apiCall("/social/posts?_author=true&_reactions=true&_comments=true");
    allDatatest.push(...datatest.data);
    console.log(datatest.meta.isLastPage);
    while (!datatest.meta.isLastPage) {
        datatest = await apiCall(`/social/posts?_author=true&_reactions=true&_comments=true&page=${datatest.meta.currentPage + 1}`);
        console.log(datatest.meta.isLastPage);
        allDatatest.push(...datatest.data);
    }
    //console.log(allDatatest);
    return allDatatest;
}

function calculatePopularityScore(post) {
    const comments = post._count.comments || 0;
    const reactions = post._count.reactions || 0;
    return comments*2 + reactions;
}

function getTagCount(posts) {
    const tagCount = {};

    posts.forEach(post => {
        post.tags.forEach(tag => {
            if (tag.length > 1) {
                tagCount[tag] = (tagCount[tag] || 0) + 1;
            }
        })
    })

    Object.keys(tagCount).forEach(tag => {
        if (tagCount[tag] === 1) {
            delete tagCount[tag];
        }
    })

    const tagsTest = Object.keys(tagCount).map(tag => ({tag, count: tagCount[tag]})); 

    tagsTest.sort((a,b) => b.count - a.count);
    console.log(tagsTest);
    const sortedTags = tagsTest.map(item => item.tag);
    return sortedTags;
}

const TagSelection = document.querySelector("#tag-selection");
if (TagSelection) {
    const allPosts = await getAllPosts();
    const popularTags = getTagCount(allPosts);
    for (let i = 0; i < 10; i++) {
        const tagElement = document.createElement("li");
        tagElement.classList.add("list-group-item", "list-group-item-action");
        if (i % 2) {
            tagElement.classList.add("list-group-item-primary");
        }
        const tagButton = document.createElement("button");
        tagButton.classList.add("btn");
        tagButton.textContent = popularTags[i];
        tagButton.onclick = async function() {
            const apiData = await apiCall("/social/posts?_author=true&_reactions=true&_comments=true&_tag=" + tagButton.textContent);
            clearFeed();
            displayFeed(apiData.data);
        }
        tagElement.append(tagButton);
        TagSelection.append(tagElement);
    }
}
const searchInput = document.querySelector("#search-input");
if (searchInput) {
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
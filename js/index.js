import { initializeFormValidation } from "./services/authService.mjs";
import { apiCall, postApiData } from "./services/apiServices.mjs";
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
            if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
                page += 1;
                fetchFeed(page);
            }
        };    
    }
}

async function fetchFeed(page) {
    const apiData = await apiCall("/social/posts?limit=10&_author=true&_reactions=true&_comments=true&page=" + page);
    displayFeed(apiData);
}
const forms = document.querySelectorAll(".needs-validation");
initializeFormValidation(forms);

const createPost = document.querySelector("#create-post");
const postForm = document.querySelector("#post-form");
const closePostForm = document.querySelector("#close-postform");

createPost.addEventListener("click", () => {
    postForm.classList.remove("d-none");
    createPost.classList.add("d-none");
})

closePostForm.addEventListener("click" , () => {
    postForm.classList.add("d-none");
    createPost.classList.remove("d-none");
})

postForm.addEventListener("submit", event => {
    event.preventDefault();
    const title = document.querySelector("#title-input").value;
    const body = document.querySelector("#body-input").value;
    const mediaUrl = document.querySelector("#media-url-input").value;
    const mediaAlt = document.querySelector("#media-alt-input").value;
    const tags = document.querySelector("#added-tags");
    const currentTags = tags.querySelectorAll("span");
    const tagsByName = Array.from(currentTags).map((currentTag) => {
        return currentTag.textContent;
    })
    const dataPackage = {title: title, body: body, tags: tagsByName, media: {url: mediaUrl , alt: mediaAlt}}
    postApiData("/social/posts", dataPackage);
    postForm.reset();
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
let addTag = () => {
    const tagInput = document.querySelector("#tags-input");
    const tag = tagInput.value.trim().toLowerCase();
    const addedTags = document.querySelector("#added-tags");
    const currentTags = addedTags.querySelectorAll("span");
    const tagsByName = Array.from(currentTags).map((currentTag) => {
        return currentTag.textContent;
    })
    if (tag !== "" && !dublicateTag(tagsByName,tag)) {
        const tagElement = document.createElement("span");
        tagElement.classList.add("p-1", "bg-secondary-subtle")
        tagElement.textContent = tag;
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
const mediaToggle = document.querySelector("#media-toggle");
mediaToggle.addEventListener("click", addMedia);

const mediaUrlTest = document.querySelector("#media-url-input");
mediaUrlTest.addEventListener("focusout", () => {
    const image = document.querySelector("#placeholder-image");
    image.src = mediaUrlTest.value;
})
import { postApiData, apiCall, putApiData } from "../services/apiServices.mjs";

/**
 * @description Creates a new post with the provided data and sends it to the server.
 * @param {Event} event
 * @returns {void}
 */
export async function createNewPost(event) {
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

    try {
        const response = await postApiData("/social/posts", dataPackage);
        if (response.ok) {
            console.log("worked");
        } else {
            console.log("failed");
        }
    
    } catch (error) {
        console.log(error);
    }
    //postForm.reset();
}

/**
 * @description Opens the post editor modal and populates it with the data of the specified post.
 * @param {string} id
 * @returns {void}
 */
export async function openPostEditor(id) {
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

/**
 * @description Handles the editing of a post.
 * @param {Event} event
 * @returns {void}
 */
export async function editPost(event) {
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
}

/**
 * @description Toggles the visibility of media inputs for adding images.
 * @returns {void}
 */
export function addMedia() {
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

/**
 * @description Adds a tag to the list of tags in the form.
 * @returns {void}
 */
export function addTag() {
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

/**
 * @description Adds a tag to the list of tags in the edit form.
 * @returns {void}
 */
export function editTag() {
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

/**
 * @description Check if a tag already exists in a given array of tags.
 * @param {Array} tags
 * @param {string} tag
 * @returns {boolean}
 */
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
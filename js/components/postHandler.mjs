import { postApiData, apiCall, putApiData, deleteApiData} from "../services/apiServices.mjs";
import { updateReactions, updateComments } from "./commentSection.mjs";
/**
 * @description Creates a new post with the provided data and sends it to the server.
 * @param {Event} event
 * @returns {void}
 */
export async function createNewPost(event) {
    event.preventDefault();
    const postForm = document.querySelector("#post-form");
    const formData = new FormData(postForm);
    const { title, body, url, alt } = Object.fromEntries(formData.entries());
    const dataPackage = {};
    if (title) {
        dataPackage.title = title;
    }
    if (body) {
        dataPackage.body = body;
    }
    if (url) {
        dataPackage.media = {};
        dataPackage.media.url = url;
        dataPackage.media.alt = alt;
    }
    const tags = document.querySelector("#added-tags");
    const currentTags = Array.from(tags.querySelectorAll("span")).map(currentTag => currentTag.textContent);
    if (currentTags.length > 0) {
        dataPackage.tags = currentTags;
    }
    
    try {
        const response = await postApiData("/social/posts", dataPackage);
        if (response) {
            location.reload();
        } else {
            const postError = document.querySelector("#post-error");
            if (body.length > 160) {
                postError.textContent = "body to long";
            }
            postError.style.display = "block";
        }
    
    } catch (error) {
        console.log(error);
    }
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
    if (data.media) {
        document.querySelector("#edit-media-url-input").value = data.media.url;
        document.querySelector("#edit-media-alt-input").value = data.media.alt;    
    }
    const addedTags = document.querySelector("#edit-added-tags");
    const currentTags = addedTags.querySelectorAll("span");
    const tagsByName = Array.from(currentTags).map((currentTag) => {
        return currentTag.textContent;
    })

    data.tags.forEach(tag => {
        const tagElement = displayTag(tag);
        addedTags.append(tagElement);
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
    const postForm = document.querySelector("#edit-form");
    const formData = new FormData(postForm);
    const { title, body, url, alt } = Object.fromEntries(formData.entries());
    const dataPackage = {}
    if (title) {
        dataPackage.title = title;
    }
    if (body) {
        dataPackage.body = body;
    } else {
        dataPackage.body = "";
    }
    if (url) {
        dataPackage.media = {};
        dataPackage.media.url = url;
        dataPackage.media.alt = alt;
    } else {
        // does not work, can not remove media in edit mode
        dataPackage.media = null;
    }
    const tags = document.querySelector("#edit-added-tags");
    const currentTags = Array.from(tags.querySelectorAll("span")).map(currentTag => currentTag.textContent);
    if (currentTags.length > 0) {
        dataPackage.tags = currentTags;
    } else {
        dataPackage.tags = [];
    }

    const postId = document.querySelector("#myModal").dataset.id;
    try {
        const response = await putApiData(`/social/posts/${postId}`, dataPackage);
        if (response) {
            location.reload();
        } else {
            const authError = document.querySelector("#auth-error");
            authError.style.display = "block";
        }

    } catch (error) {
        
    }
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
        const tagElement = displayTag(tag);
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
        const tagElement = displayTag(tag);
        addedTags.append(tagElement);
    }
    tagInput.value = "";
}
function displayTag(content) {
    const tagElement = document.createElement("span");
    tagElement.classList.add("p-1", "bg-secondary-subtle", "tag");
    tagElement.textContent = content;
    const removeTagButton = document.createElement("button");
    removeTagButton.classList.add("btn", "btn-close", "btn-sm");
    tagElement.append(removeTagButton);
    removeTagButton.onclick = function() {
        tagElement.remove();
    }
    return tagElement;
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
/**
 * @description Handles interactions (reactions, comments, deletion) on a post.
 * @param {Event} e
 * @returns {Promise<void>}
 */
export async function handlePostInteraction(e) {
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
        openPostEditor(postId);
    }
    if (e.target.classList.contains("comment-btn")) {
        e.preventDefault();
        const textarea = e.target.closest(".comment-form").querySelector("textarea");
        const body = textarea.value;
        postApiData(`/social/posts/${postId}/comment`,{body: body});
        triggerDebounce(postContainer);
    }
    if (e.target.classList.contains("delete-comment-btn")) {
        const comment = e.target.closest("[data-comment-id]");
        const commentId = comment.dataset.commentId;
        deleteApiData(`/social/posts/${postId}/comment/${commentId}`);
        triggerDebounce(postContainer);
    }

}

function debounce(func, delay) {
    let timerId;
    return function(...args) {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
}
const updatetest = debounce(updateComments,300);

function triggerDebounce(value) {
    updatetest(value);
}

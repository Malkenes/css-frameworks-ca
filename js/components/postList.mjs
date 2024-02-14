import { timePassed } from "../utils/timeUtils.mjs";
import { showAll } from "../pages/feed.mjs";


export function displayPost(data) {
    const post = document.createElement("div");
    const header = createPostHeader(data);
    const body = createPostBody(data);
    post.append(header);
    post.append(body);
    return post;
}

function createPostHeader(data) {
    const header = document.createElement("div");
    header.classList.add("border-bottom");
    header.innerHTML = `
    <div class="d-flex gap-2 align-items-center">
        <a href="../profile/index.html?user=${data.author.name}">
            <img src="${data.author.avatar.url}" class="user-icon" alt="${data.author.avatar.alt}">
        </a>
        <h2>${data.author.name}</h2>
    </div>`;

    const time = timePassed(data.created);
    header.append(time);
    if (data.author.name === localStorage["name"]) {
        const div = document.createElement("div");
        div.classList.add("btn-group");
        const editBtn = document.createElement("button");
        const deleteBtn = document.createElement("button");
        editBtn.classList.add("btn", "btn-light", "btn-sm", "edit-btn");
        deleteBtn.classList.add("btn", "btn-danger", "btn-sm", "delete-btn");
        editBtn.textContent = "Edit";
        deleteBtn.textContent = "delete";
        div.append(editBtn, deleteBtn);
        //edit.onclick = function() {
        //    editPost(data);
        //}
        //edit.textContent = "edit";
        //edit.dataset.id = data.id;
        header.append(div);
    }
    return header;
}

function createPostBody(data) {
    const body = document.createElement("div");
    body.innerHTML = `
    <h3 class="sr-only">${data.title}</h3>`;

    const div = document.createElement("div");
    const buttonContainer = document.createElement("div");
    div.innerHTML = data.body;
    div.classList.add("content");
    div.style.maxHeight = "200px";
    div.style.overflow = "hidden";
    const button = document.createElement("button");
    button.style.display = "none";
    button.classList.add("show-more", "btn");
    button.textContent = "show more";
    button.onclick = function () {
        showAll(div, button);
    };
    buttonContainer.append(button);
    body.append(div);
    body.append(button);
    if (data.media) {
        const image = createMediaElement(data.media);
        body.append(image);
    }
    if (Array.isArray(data.tags) && data.tags.length > 0) {
        const tags = createTagsElement(data.tags);
        body.append(tags);
    }
    return body;
}

function createMediaElement(media) {
    const div = document.createElement("div");
    div.classList.add("text-center", "mb-3");
    const image = document.createElement("img");
    image.classList.add("img-fluid");
    image.src = media.url;
    image.alt = media.alt;
    div.append(image);
    return div;
}

function createTagsElement(tags) {
    const div = document.createElement("div");
    div.classList.add("d-flex", "gap-2", "mb-3");
    tags.forEach(tag => {
        const container = document.createElement("div");
        container.classList.add("bg-secondary-subtle", "p-1");
        container.innerText = tag;
        div.append(container);
    });
    return div;
}


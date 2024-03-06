import { timePassed } from "../utils/timeUtils.mjs";

export function commentSection(comments, reactions) {
    const div = document.createElement("div");
    div.className = "comment-container";
    const reactionElement = createReactElements(reactions);
    const commentElements = createComments(comments);
    div.append(reactionElement);
    div.append(commentElements);
    return div;
}
function createReactElements(reactions) {
    const div = document.createElement("div");
    div.classList.add("bg-primary-subtle");
    let hearth = 0;
    let smile = 0;
    let frown = 0;
    reactions.filter((reaction) => {
        if (reaction.symbol === "💗") {
            hearth = reaction.count;
        }
        if (reaction.symbol === "😀") {
            smile = reaction.count;
        }
        if (reaction.symbol === "🙁") {
            frown = reaction.count;
        }
    });
    div.innerHTML = `
    <button class="btn react-btn fs-5 position-relative">💗<span class="position-absolute top-0 end-0 badge bg-secondary">${hearth}</span></button>
    <button class="btn react-btn fs-5 position-relative">😀<span class="position-absolute top-0 end-0 badge bg-secondary">${smile}</span></button>
    <button class="btn react-btn fs-5 position-relative">🙁<span class="position-absolute top-0 end-0 badge bg-secondary">${frown}</span></button>
    <button class="btn toggle-comment-btn">Reply</button>
    `;
    return div;
}

function createComments(comments) {
    const div = document.createElement("div");
    div.classList.add("bg-body", "p-3");
    div.innerHTML = `
    <div class="border-bottom border-primary mb-3">
        <h3 class="fs-5">Comments (${comments.length})</h3>
    </div>
    <div class="collapse bg-body mb-3">
        <form class="col comment-form d-flex align-items-stretch rounded-pill">
            <div class="user-icon position-absolute"></div>
            <textarea class="form-control rounded-start-pill ps-5" style="height: 48px;" aria-label="post a comment"></textarea>
            <div class="d-grid">
                <button class="btn btn-primary comment-btn rounded-end-pill">Comment</button>
            </div>
        </form>
    </div>
    `;
    Array.from(comments).forEach(comment => {
        const com = document.createElement("div");
        com.dataset.commentId = comment.id;
        com.innerHTML = `
        <div class="d-flex gap-2 align-items-center">
            <img src="${comment.author.avatar.url}" class="user-icon-sm" alt="${comment.author.avatar.alt}">
            <h2 class="fs-5">${comment.author.name}</h2>
        </div>`;
        const time = timePassed(comment.created);
        com.append(time);
        const body = document.createElement("div");
        body.textContent = comment.body;
        if (comment.author.name === localStorage["name"]) {
            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("btn", "btn-danger", "btn-sm", "delete-comment-btn");
            deleteBtn.textContent = "delete";
            com.append(deleteBtn);
        }
        com.append(body);
        div.append(com);
    });
    return div;
}

export function updateReactions(container, reactions) {
    const item = container.querySelector(".bg-primary-subtle");
    const newItem = createReactElements(reactions);
    item.replaceWith(newItem);
}
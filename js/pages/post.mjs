import { displayPost } from "../components/postList.mjs";
import { commentSection } from "../components/commentSection.mjs";

/**
 * @description Displays a single post on the page.
 * @param {Object} data
 */
export function displaySinglePost(data) {
    const feed = document.querySelector("#feed");
    const post = document.createElement("div");
    post.classList.add("bg-white", "p-3");
    post.dataset.id = data.id;
    post.innerHTML = `<h1>${data.title}</h1>`;
    const postContent = displayPost(data);
    const postComments = commentSection(data.comments, data.reactions);

    post.append(postContent);
    post.append(postComments);
    feed.append(post);
}
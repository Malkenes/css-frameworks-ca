import { displayPost } from "../components/postList.mjs";
import { commentSection } from "../components/commentSection.mjs";

export function displaySinglePost(data) {
    console.log(data);
    const post = document.querySelector("#post");
    post.classList.add("bg-white", "p-3");
    post.innerHTML = `<h1>${data.title}</h1>`;
    const postContent = displayPost(data);
    const postComments = commentSection(data.comments, data.reactions);

    post.append(postContent);
    post.append(postComments);
}
import { commentSection } from "../components/commentSection.mjs";
import { displayPost } from "../components/postList.mjs";

export function displayFeed(data) {
    const feed = document.querySelector("#feed");
    data.forEach(element => {
        const post = document.createElement("div");
        post.classList.add("container", "bg-white", "p-3", "mb-3");
        post.dataset.id = element.id;
        post.innerHTML= `<a href="../post/index.html?id=${element.id}" target="_blank" class="float-end"><i class="fas fa-arrow-up-right-from-square"></i></a>`;
        const postContent = displayPost(element);
        const postComments = commentSection(element.comments, element.reactions);
        post.append(postContent);
        post.append(postComments);
        feed.append(post);

        const bodyText = post.querySelector(".content");
        const bodyShowMore = post.querySelector(".show-more");
        if (bodyText.clientHeight < bodyText.scrollHeight) {
            bodyShowMore.style.display = "block";
        }
    });
} 
export function clearFeed() {
    const feed = document.querySelector("#feed");
    feed.innerHTML = "";
}
export function showAll(div, btn) {
    div.style.maxHeight = "none";
    btn.style.display = "none";
}
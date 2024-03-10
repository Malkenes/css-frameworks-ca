import { displayPost } from "../components/postList.mjs";
import { commentSection } from "../components/commentSection.mjs";
import { apiCall } from "../services/apiServices.mjs";
import { displayError, hideLoadingSpinner, showLoadingSpinner } from "../utils/feedbackUtils.mjs";
import { handlePostInteraction } from "../components/postHandler.mjs";
/**
 * @description Displays a single post on the page.
 * @param {Object} data
 */
export async function displaySinglePost(param) {
    try {
        showLoadingSpinner();
        const apiData = await apiCall("/social/posts/" + param + "?_author=true&_reactions=true&_comments=true");
        const {data} = apiData;
        const container = document.querySelector("#post");
        const post = document.createElement("div");
        post.classList.add("bg-white", "p-3");
        post.dataset.id = data.id;
        container.innerHTML = `<h1>${data.title}</h1>`;
        const postContent = displayPost(data);
        const postComments = commentSection(data.comments, data.reactions);
    
        post.append(postContent);
        post.append(postComments);
        post.addEventListener("click", handlePostInteraction);
        container.append(post);
        hideLoadingSpinner();
    } catch (error) {
        console.log(error)
        displayError();
        hideLoadingSpinner();
    }
}
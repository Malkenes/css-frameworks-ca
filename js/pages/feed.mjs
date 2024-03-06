import { commentSection } from "../components/commentSection.mjs";
import { displayPost } from "../components/postList.mjs";
import { sortByPopularity, sortByTrending, getTagCount } from "../components/sort.mjs";
import { apiCall } from "../services/apiServices.mjs";

export async function displayFeedTest() {
    const postPerPage = 10;
    let currentPage = 1;
    const data = await getAllPosts();
    const originalData = [...data];
    let dataCopy = sortByTrending(data);


    window.onscroll = function() {
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 20) {
            currentPage += 1;
            const startIndex = (currentPage - 1) * postPerPage;
            const endIndex = startIndex + postPerPage;
            displayFeed(dataCopy.slice(startIndex,endIndex));
        }
    }

    const trending = document.querySelector("#trending");
    trending.addEventListener("click", () => {
        dataCopy = sortByTrending(data);
        clearFeed();
        displayFeed(dataCopy.slice(0,10));
        setActive(trending);
    })
    const recent = document.querySelector("#recent");
    recent.addEventListener("click", () => {
        dataCopy = originalData;
        clearFeed();
        displayFeed(dataCopy.slice(0,10));
        setActive(recent);
    })
    const popular = document.querySelector("#popular");
    popular.addEventListener("click", () => {
        dataCopy = sortByPopularity(data);
        console.log(originalData);
        clearFeed();
        displayFeed(dataCopy.slice(0,10));
        setActive(popular);
    })

    const TagSelection = document.querySelector("#tag-selection");
    const popularTags = getTagCount(data);
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
            dataCopy = apiData.data;
            displayFeed(dataCopy.slice(0,10));
        }
        
        tagElement.append(tagButton);
        TagSelection.append(tagElement);
    }

    displayFeed(dataCopy.slice(0,10));
}

export function displayFeed(data) {
    const feed = document.querySelector("#feed");
    data.forEach(element => {
        const post = document.createElement("div");
        post.classList.add("container", "bg-white", "p-3", "mb-3");
        post.dataset.id = element.id;
        post.innerHTML= `<a href="../post/index.html?id=${element.id}" class="float-end"><i class="fas fa-arrow-up-right-from-square"></i></a>`;
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

async function getAllPosts() {
    let datatest = await apiCall("/social/posts?_author=true&_reactions=true&_comments=true");
    const allDatatest = [];
    allDatatest.push(...datatest.data);
    while (!datatest.meta.isLastPage) {
        datatest = await apiCall(`/social/posts?_author=true&_reactions=true&_comments=true&page=${datatest.meta.currentPage + 1}`);
        allDatatest.push(...datatest.data);
    }
    return allDatatest;
}

function setActive(button) {
    const myTabs = document.querySelectorAll("#myTab button");
    Array.from(myTabs).forEach(tab => {
        if (tab === button) {
            tab.classList.add("active");
        } else {
            tab.classList.remove("active");
        }
    })
}
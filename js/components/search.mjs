import { apiCall } from "../services/apiServices.mjs";

export async function handleInputChange(event) {
    //const searchResults = document.querySelector("#search-results");
    if (event.target.value.length > 3) {
        const postApiData = await apiCall("/social/posts/search?q=" + event.target.value);
        const postList = document.querySelector("#post-list");
        postList.innerHTML = "";
        const posts = postApiData.data;
        const numPosts = Math.min(posts.length, 3);
        for (let i = 0; i < numPosts; i++) {
            const post = document.createElement("li");
            post.classList.add("list-group-item");
            post.innerHTML = `<a href="../post/index.html?id=${posts[i].id}">${posts[i].title}</a>`
            postList.append(post);
        }

        const profileApiData = await apiCall("/social/profiles/search?q=" + event.target.value);
        const profileList = document.querySelector("#profile-list");
        profileList.innerHTML = "";
        const profiles = profileApiData.data;
        const numProfiles = Math.min(profiles.length, 3);
        for (let i = 0; i < numProfiles; i++) {
            const profile = document.createElement("li");
            profile.classList.add("list-group-item");
            const profileName = document.createElement("a");
            profileName.href = `../profile/index.html?user=${profiles[i].name}`;
            profileName.innerHTML = `<img class=user-icon-sm src=${profiles[i].avatar.url}>${profiles[i].name}`
            profile.append(profileName);
            profileList.append(profile);
        }
    }
}
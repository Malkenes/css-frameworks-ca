import { putApiData } from "../services/apiServices.mjs";

export function displayProfile(data) {

    console.log(data);
    const avatar = document.querySelector("#user-avatar");
    avatar.src = data.data.avatar.url;
    avatar.alt = data.data.avatar.alt;

    const user = document.querySelector("h1");
    user.textContent = data.data.name;

    const bio = document.querySelector("#bio");
    if (data.data.bio) {
        bio.textContent = data.data.bio;
    }

    const followOrEdit = document.querySelector("#followOrEdit");
    if (data.data.name === localStorage["name"]) {
        followOrEdit.textContent = "Edit";
        const postBtn = document.querySelector("#create-posts");
        postBtn.classList.remove("d-none");
    } else {
        if (isFollowing(data.data.followers)) {
            followOrEdit.textContent = "Unfollow";
        }
        followOrEdit.addEventListener("click", function() {
            if (isFollowing(data.data.followers)) {
                putApiData(`/social/profiles/${data.data.name}/unfollow`);
                followOrEdit.textContent = "Follow";
            } else {
                putApiData(`/social/profiles/${data.data.name}/follow`);
                followOrEdit.textContent = "Unfollow";
            }
        })
    }
    const testFollow = document.querySelectorAll(".followers");
    displayFollow(data.data.followers, testFollow);
    const testFollowing = document.querySelectorAll(".following");
    displayFollow(data.data.following, testFollowing);
}

function displayFollow(followers, containers) {
    Array.from(containers).forEach(container => {
        const amount = container.querySelector(".amount");
        const followLength = followers.length;
        amount.textContent = followLength;
        let list = displayUsers(followers);
        if (followLength >= 4) {
            list = displayUsers(followers,4);
        }
        const modal = container.querySelector(".modal-body");
        if (modal) {
            list.classList.add("d-flex", "flex-wrap", "gap-3");
            modal.append(list);
        } else {
            list.classList.add("d-none", "d-lg-flex", "gap-2");
            container.append(list);
        }
    })
}

function isFollowing(users) {
    const following = users.find((user) => {
        if (user.name === localStorage["name"]) {
            return true;
        }
    })
    return following;
}

function displayUsers(users, amount = users.length) {
    const div = document.createElement("div");
    for (let i = 0 ; i < amount ; i++) {
        const user = document.createElement("a");
        user.href = "../profile/index.html?user=" + users[i].name;
        user.classList.add("d-flex","flex-column","align-items-center");
        const userImg = document.createElement("img");
        userImg.src = users[i].avatar.url;
        userImg.classList.add("user-icon");
        const userName = document.createElement("h3");
        userName.textContent = users[i].name;
        user.append(userImg);
        user.append(userName);
        div.append(user);
    }
    return div;
}

import { putApiData } from "../services/apiServices.mjs";

export function displayProfile(data) {

    console.log(data);
    const avatar = document.querySelector("#user-avatar");
    avatar.src = data.data.avatar.url;
    avatar.alt = data.data.avatar.alt;

    const banner = document.querySelector("#banner");
    getMeta(data.data.banner.url, (err,img) => {
        if (img.naturalHeight > img.naturalWidth) {
            banner.style.backgroundSize = "100% auto";
        } else {
            banner.style.backgroundSize = "auto 100%";

        }
        banner.style.backgroundImage = `url(${data.data.banner.url})`;
    });

    const user = document.querySelector("h1");
    user.textContent = data.data.name;
    user.style.filter = "drop-shadow(4px -4px 12px white)";
    const bio = document.querySelector("#bio");
    if (data.data.bio) {
        bio.textContent = data.data.bio;
    }

    const followOrEdit = document.querySelector("#followOrEdit");
    if (data.data.name === localStorage["name"]) {
        followOrEdit.textContent = "Edit";
        followOrEdit.onclick = function() {
             editProfile(data.data.avatar, data.data.banner);
        }
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
        const modal = container.querySelector(".modal-body");
        if (modal) {
            list.classList.add("row");
            modal.append(list);
        } else {
            if (followLength >= 3) {
                list = displayUsers(followers,3);
            }    
            list.classList.add("d-none", "d-lg-flex", "row");
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
        user.classList.add("d-flex","flex-column","align-items-center","col-4", "overflow-hidden");
        const userImg = document.createElement("img");
        userImg.src = users[i].avatar.url;
        userImg.classList.add("user-icon");
        const userName = document.createElement("h3");
        userName.classList.add("fs-5");
        userName.textContent = users[i].name;
        user.append(userImg);
        user.append(userName);
        div.append(user);
    }
    return div;
}

function editProfile(avatar, banner) {
    const editModal = new bootstrap.Modal(document.getElementById("edit-modal"))
    const modal = document.querySelector("#edit-modal");
    const userImg = modal.querySelector("img");
    const userBanner = modal.querySelector(".test-bg");
    userBanner.style.backgroundImage = `url(${banner.url})`;
    userBanner.style.backgroundSize = "100% auto";
    userImg.src = avatar.url;
    const avatarUrl = document.querySelector("#avatar-url");
    const avatarAlt = document.querySelector("#avatar-alt");
    const bannerUrl = document.querySelector("#banner-url");
    const bannerAlt = document.querySelector("#banner-alt");
    avatarUrl.value = avatar.url;
    avatarAlt.value = avatar.alt;
    bannerUrl.value = banner.url;
    bannerAlt.value = banner.alt;
    editModal.toggle();
    avatarUrl.addEventListener("input", () => {
        userImg.src = avatarUrl.value;
    });
    bannerUrl.addEventListener("input", () => {
        getMeta(bannerUrl.value, (err,img) => {
            if (img.naturalHeight > img.naturalWidth) {
                userBanner.style.backgroundSize = "100% auto";
            } else {
                userBanner.style.backgroundSize = "auto 100%";

            }
            //console.log(img.naturalWidth,img.naturalHeight);
        });
        userBanner.style.backgroundImage = `url(${bannerUrl.value})`;
    })

    const form = document.querySelector("#edit-profile-form");
    form.addEventListener("submit", event => {
        event.preventDefault();
        const dataPackage = {}
        if (bannerUrl) {
            dataPackage.banner = {};
            dataPackage.banner.url = bannerUrl.value;
            dataPackage.banner.alt = bannerAlt.value;
        }
        if (avatarUrl) {
            dataPackage.avatar = {};
            dataPackage.avatar.url = avatarUrl.value;
            dataPackage.avatar.alt = avatarAlt.value;
        }
        putApiData("/social/profiles/" + localStorage["name"], dataPackage);
        editModal.hide()
    })
}

function getMeta(url,cb) {
    const img = new Image();
    img.onload = () => cb(null, img);
    img.onerror = (err) => cb(err);
    img.src = url;
}
<header class="d-flex flex-column p-2 position-sticky secondary-bg shadow-sm w-100" style="top: 0; z-index: 1;">
    <div class="d-flex align-items-center justify-content-center position-relative">
        <a class="back-icon position-absolute" style="left: 0;">
            <img src="https://blog.deepthought.education/wp-content/uploads/2022/04/back-icon.svg" alt="back-icon">
        </a>
        <div id="profile-info" class="rounded-circle">
            <div class="d-flex align-items-center">
                <div class="profile-pic mr-2">
                    <img src="https://blog.deepthought.education/wp-content/uploads/2022/04/image-2.png" alt="profile-info"
                        class="img-cover circle-sm rounded-circle">
                </div>
                <h2 class="font-14 font-medium mb-0">Ananya Doshi</h2>
            </div>
        </div>
        <div class="settings-icon position-absolute mr-1" style="right: 0;">
            <img src="https://blog.deepthought.education/wp-content/uploads/2022/04/settings-icon.svg" alt="settings-icon">
        </div>
    </div>
    </div>
    <div id="dropdown"
        class="  dropdown-content d-none flex-column position-absolute secondary-bg font-14 font-regular shadow px-3 py-2 rounded-lg"
        style="right: 0; top: 0; z-index: 1;">

        <a class="dropdown-content__holde primary-text mb-1" href="#">Mute Chat</a>
        <a class="dropdown-content__holde primary-text mb-1" href="#">Delete Chat</a>
        <a class="dropdown-content__hold primary-text mb-1" href="#">Block Chat</a>
    </div>
</header>

<div id="request-container" class="chat-row incoming">
    <div class="chat">
        <p class="mb-0">Hi Olivia, Please accept my message request, so that I can bug you with things that you
            have no
            interest
            for. Isn't that funs</p>
    </div>
</div>
<div class="chat-row incoming">
    <div class="chat">
        <p class="mb-0">Hi Olivia, Please accept my message request, so that I can bug you with things that you
            have no
            interest
            for. Isn't that funs</p>
    </div>
</div>

<div id="request-alert" class="d-flex flex-column text-center p-3 primary-bg component-full rounded-top-15-px"
    style="position: fixed; bottom: 0; left:50%; transform: translate(-50%, 0px);">
    <p>You both know <span class="text-primary">Ananya</span> , <span class="text-primary">Amit</span>, <span
            class="text-primary">Anne</span> and 4 others</p>
    <div id="request-alert-buttons" class="d-flex justify-content-center">
        <button id="request-decline" class="btn btn-danger mr-3 border-0 rounded-lg">Decline</button>
        <button id="request-accept" class=" btn btn-success border-0 rounded-lg">Accept</button>
    </div>
</div>
<header class="d-flex flex-column p-2 position-fixed secondary-bg shadow-sm w-100" style="top: 0; z-index: 1;">
    <div class="d-flex align-items-center justify-content-center position-relative">
        <a class="back-icon position-absolute" style="left: 0;">
            <img src="https://blog.deepthought.education/wp-content/uploads/2022/04/back-icon.svg" alt="back-icon">
        </a>
        <div id="profile-info" class="rounded-circle">
           
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

<div id="chats" class="align-items-center col-12 d-flex flex-column justify-content-center pb-5 pt-5 px-3"></div>

<form action="" id="message-input">
    <div class="fixed-bottom mb-2 px-3" id="dr-footer">
        <div class="input-group">
            <input type="text" class="form-control font-12" required max="{maximumChatMessageLength}" placeholder="Type a message" name="chatbox"
                id="chat-input">
            <div class="input-group-append" id="button-addon4">
                <button class="border-0 bg-transparent ml-1 attachment" id="attachments-btn" type="button">
                    <img src="https://blog.deepthought.education/wp-content/uploads/2022/04/paperclip-solid.svg" alt="" class="circle-xsm attachment">
                </button>
                <button class="border-0 bg-transparent brand-text ml-1" type="submit" id="submit-thread">
                    <img src="https://blog.deepthought.education/wp-content/uploads/2022/04/Vector-9.svg" alt="" class="circle-xsm">
                </button>
            </div>
        </div>
    </div>

    <!-- attachment options -->
    <div class="d-none attachments-menu">
        <div
            class="secondary-bg shadow-sm primary-border rounded-10-px d-inline-flex flex-column py-2 px-1 justify-content-between align-items-center">

            <input type="file" class="form-control-file d-none" id="file-attach" name="files" />
            <label for="file-attach" class="mb-2 attachment">
                <img src="https://blog.deepthought.education/wp-content/uploads/2022/04/file-solid.svg" alt="" class="circle-xsm attachment">
            </label>

            <input type="file" accept="image/*" class="form-control-file d-none" id="img-attach" name="files" />
            <label for="img-attach" class="mb-2 attachment">
                <img src="https://blog.deepthought.education/wp-content/uploads/2022/04/attach-image.svg" alt="" class="circle-xsm attachment">
            </label>

            <input type="file" accept="image/*" class="form-control-file d-none" id="cam-attach" name="files" />
            <label for="cam-attach" class="mb-0 attachment">
                <img src="https://blog.deepthought.education/wp-content/uploads/2022/04/camera-solid.svg" alt="" class="circle-xsm attachment">
            </label>
        </div>
    </div>
</form>

<div class="modal fade" id="imageModal" data-backdrop="static" data-keyboard="false" tabindex="-1"
    aria-labelledby="imageModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div id="message-modal" class="modal-content rounded-10-px">
            <div class="modal-header border-0">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body py-2">
                <img src="" alt="" class="rounded-lg w-100 img-cover" id="modalImg">
            </div>
        </div>
    </div>
</div>
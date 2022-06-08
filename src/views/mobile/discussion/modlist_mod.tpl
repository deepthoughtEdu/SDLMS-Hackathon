<div class="primary-bg">
    <!-- header -->
    <div class="fixed-top dr-header d-flex container align-items-center py-1 shadow-sm secondary-bg">
        <div class="dr-name d-flex align-items-center">
            <i class="fas fa-solid fa-arrow-left mr-2" onclick="document.location.href='view'"></i>
            <img src="https://cdn.motor1.com/images/mgl/VA0z9/s1/tesla-roadster.jpg" alt="tesla roadster"
                class="circle-sm rounded-circle mr-1 img-cover">
            <div class="d-flex flex-column justify-content-center">
                <p class="font-bold font-14 mb-0">Elon Musk: Tesla</p>
                <p class="font-10 mb-0">Moderators List</p>
            </div>
        </div>
    </div>

    <div class="pt-5">
        <div class="rounded-10-px secondary-bg component-full">

            <img src="https://cdn.motor1.com/images/mgl/VA0z9/s1/tesla-roadster.jpg" alt="static-banner"
                class="height-160 component-full rounded-top-10-px img-cover">

            <div class="container mt-3">
                <p class="brand-text font-10 mb-0">Discussion Room</p>
                <p class="font-18">Elon Musk: Tesla</p>
                <p class="mt-3 font-14 mb-2">Moderator's List:</p>

                <div class="shadow-sm rounded-10-px p-2 owner-card">
                    <div class="d-flex justify-content-between align-items-center">
                        <img src="https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/01/man-serious-portrait-1296x728-header.jpg?w=1155&h=1528"
                            alt="mod-1" class="img-cover circle-md rounded-circle">
                        <div>
                            <p class="mb-0 font-10 brand-text">Owner</p>
                            <p class="font-12 mb-0">Louis Rossman</p>
                        </div>
                        <div>
                            <p class="mb-1 font-10">Rigor rank: 7</p>
                            <p class="mb-1 font-10">Articles written: 2</p>
                            <p class="font-10 mb-0">Discussion Rooms: 3</p>
                        </div>
                    </div>
                </div>
                <div class="shadow-sm rounded-10-px mt-2 p-2 mod-card">
                    <div class="d-flex justify-content-between align-items-center">
                        <img src="https://www.mantruckandbus.com/fileadmin/media/bilder/02_19/219_05_busbusiness_interviewHeader_1485x1254.jpg"
                            alt="mod-1" class="img-cover circle-md rounded-circle">
                        <div>
                            <p class="mb-0 font-10 brand-text">Moderator</p>
                            <p class="font-12 mb-0">Billy Kidman</p>
                        </div>
                        <div>
                            <p class="mb-1 font-10">Rigor rank: 5</p>
                            <p class="mb-1 font-10">Articles written: 4</p>
                            <p class="font-10 mb-0">Discussion Rooms: 1</p>
                        </div>
                    </div>
                    <div class="d-flex mt-2 justify-content-center">
                        <button type="button" class="button-primary rounded-lg button-md-p border-0 font-medium font-10"
                            id="send-mod-message">Send
                            Message</button>
                        <button type="button"
                            class="button-primary rounded-lg button-md-p border-0 font-medium ml-4 font-10"
                            id="view-mod-profile">View
                            Profile</button>
                        <button type="button"
                            class="button-primary rounded-lg button-md-p border-0 font-medium ml-4 font-10 text-danger d-none"
                            id="rm-mod">Remove Moderator</button>
                    </div>
                </div>
                <div class="shadow-sm rounded-10-px mt-2 p-2 mod-card">
                    <div class="d-flex justify-content-between align-items-center">
                        <img src="https://i.pinimg.com/originals/7f/7b/0a/7f7b0af3e88a94cea225d7ac9f794161.jpg"
                            alt="mod-1" class="img-cover circle-md rounded-circle">
                        <div>
                            <p class="mb-0 font-10 brand-text">Moderator</p>
                            <p class="font-12 mb-0">Astolpho Lorenz</p>
                        </div>
                        <div>
                            <p class="mb-1 font-10">Rigor rank: 6</p>
                            <p class="mb-1 font-10">Articles written: 5</p>
                            <p class="font-10 mb-0">Discussion Rooms: 2</p>
                        </div>
                    </div>
                    <div class="d-flex mt-2 justify-content-center">
                        <button type="button" class="button-primary rounded-lg button-md-p border-0 font-medium font-10"
                            id="send-mod-message">Send
                            Message</button>
                        <button type="button"
                            class="button-primary rounded-lg button-md-p border-0 font-medium ml-4 font-10"
                            id="view-mod-profile">View
                            Profile</button>
                        <button type="button"
                            class="button-primary rounded-lg button-md-p border-0 font-medium ml-4 font-10 text-danger d-none"
                            id="rm-mod">Remove Moderator</button>
                    </div>
                </div>

                <div class="d-flex justify-content-between mt-3 pb-30-px">
                    <button type="button" class="button-primary font-10 font-medium border-0 button-sm-p floating-right"
                        id="edit-mods-btn">Edit
                        Moderators</button>
                    <button type="button" class="button-primary font-10 font-medium border-0 button-sm-p d-none"
                        id="add-mods-btn">Add
                        Moderator</button>
                    <button type="button" class="button-primary font-10 font-medium border-0 button-sm-p d-none"
                        id="save-mods-btn">Save
                        Changes</button>
                </div>
            </div>

            <div class="modal fade" id="add-mod-modal" tabindex="-1" aria-labelledby="add-mod-modal-label"
                aria-hidden="true">
                <div class="modal-dialog p-4 m-0">
                    <div class="modal-content secondary-bg rounded-10-px">
                        <div class="modal-body">
                            <div class="search-participant mb-3">
                                <input type="search" name="search-participant-box" id="search-participant-box"
                                    class="form-control font-10" placeholder="Search participants list">
                                <div class="row mt-3">
                                    <div class="col-6 d-flex align-items-center mb-2 participant-display">
                                        <img src="https://cdn.pixabay.com/photo/2015/01/08/18/29/entrepreneur-593358__340.jpg"
                                            alt="man1" class="img-cover circle-sm rounded-circle">
                                        <p class="font-10 ml-1 mb-0">Adam Spintzer</p>
                                    </div>
                                    <div class="col-6 d-flex align-items-center mb-2 participant-display">
                                        <img src="https://static01.nyt.com/images/2019/11/17/books/review/17Salam/Salam1-superJumbo.jpg"
                                            alt="man1" class="img-cover circle-sm rounded-circle">
                                        <p class="font-10 ml-1 mb-0">July Cramer</p>
                                    </div>
                                    <div class="col-6 d-flex align-items-center mb-2 participant-display">
                                        <img src="https://www.thoughtco.com/thmb/jIUclL8nYDNm5ikjNTHoAtRnKxg=/735x0/good-looking-man-with-big-beard-56688bcf3df78ce1611f7ba8.jpg"
                                            alt="man1" class="img-cover circle-sm rounded-circle">
                                        <p class="font-10 ml-1 mb-0">Arnold Parker</p>
                                    </div>
                                    <div class="col-6 d-flex align-items-center mb-2 participant-display">
                                        <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500g"
                                            alt="man1" class="img-cover circle-sm rounded-circle">
                                        <p class="font-10 ml-1 mb-0">Sam Cardon</p>
                                    </div>
                                    <div class="col-6 d-flex align-items-center mb-2 participant-display">
                                        <img src="https://www.the-sun.com/wp-content/uploads/sites/6/2021/12/NINTCHDBPICT000546900214.jpg"
                                            alt="man1" class="img-cover circle-sm rounded-circle">
                                        <p class="font-10 ml-1 mb-0">Ally Lotti</p>
                                    </div>
                                    <div class="col-6 d-flex align-items-center mb-2 participant-display">
                                        <img src="https://cdn.episode.ninja/file/episodeninja/6404757.jpg" alt="man1"
                                            class="img-cover circle-sm rounded-circle">
                                        <p class="font-10 ml-1 mb-0">Crony Parkinson</p>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between px-5">
                                <button type="button" class="button-tertiary-blue-text font-12 border-0"
                                    id="cancel-select">Cancel</button>
                                <button type="button" class="button-tertiary text-success font-12 border-0"
                                    id="select-confirm">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
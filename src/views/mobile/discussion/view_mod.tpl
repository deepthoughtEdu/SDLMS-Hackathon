<!-- mod options -->
<div class="d-none secondary-bg py-3 px-2 shadow-sm rounded-10-px floating-right" id="mod-options">
    <div class="d-flex align-items-center mb-3" id="saved-threads">
        <i class="fas fa-solid fa-bookmark font-12"></i>
        <p class="font-10 ml-2 mb-0">Saved Threads</p>
    </div>
    <div class="d-flex align-items-center mb-3" id="search-thread">
        <i class="fas fa-solid fa-magnifying-glass font-12"></i>
        <p class="font-10 ml-2 mb-0">Search Thread</p>
    </div>
    <div class="d-flex align-items-center mb-3" id="mod-list">
        <i class="fas fa-solid fa-users font-12"></i>
        <p class="font-10 ml-2 mb-0">Moderators List</p>
    </div>
    <div class="d-flex align-items-center mb-3" id="dr-rules">
        <i class="fas fa-solid fa-book font-12"></i>
        <p class="font-10 ml-2 mb-0">Rules of the room</p>
    </div>
    <div class="d-flex align-items-center mb-3" id="highlighted-threads">
        <i class="fa-solid fa-thumbtack font-12"></i>
        <p class="font-10 ml-2 mb-0">Highlighted Threads</p>
    </div>
    <div class="d-flex align-items-center mb-3" id="reported-threads">
        <i class="fas fa-solid fa-shield font-12"></i>
        <p class="font-10 ml-2 mb-0">Reported Threads</p>
    </div>
    <div class="d-flex align-items-center mb-3" id="mute-room">
        <i class="fas fa-solid fa-bell-slash font-12"></i>
        <p class="font-10 ml-2 mb-0">Mute room</p>
    </div>
    <div class="d-flex align-items-center text-danger" id="leave-room">
        <i class="fa-solid fa-arrow-right-from-bracket font-12"></i>
        <p class="font-10 ml-2 mb-0">Leave room</p>
    </div>
</div>

<!-- mod options on thread select -->
<div class="d-none secondary-bg py-3 px-2 shadow-sm rounded-10-px floating-right" id="mod-options-selected">
    <div class="d-flex align-items-center mb-3" id="reply-selected">
        <i class="fas fa-solid fa-reply font-12"></i>
        <p class="font-10 ml-2 mb-0">Reply</p>
    </div>
    <div class="d-flex align-items-center mb-3" id="save-selected">
        <i class="fas fa-solid fa-bookmark font-12"></i>
        <p class="font-10 ml-2 mb-0">Save Thread</p>
    </div>
    <div class="d-flex align-items-center mb-3" id="share-selected">
        <i class="fas fa-solid fa-share-nodes font-12"></i>
        <p class="font-10 ml-2 mb-0">Share thread</p>
    </div>
    <div class="d-flex align-items-center mb-3" id="highlight-selected">
        <i class="fa-solid fa-thumbtack font-12"></i>
        <p class="font-10 ml-2 mb-0">Highlight Thread</p>
    </div>
    <div class="d-flex align-items-center text-danger mb-3" id="delete-selected">
        <i class="fa-solid fa-circle-minus font-12"></i>
        <p class="font-10 ml-2 mb-0">Delete Thread</p>
    </div>
    <div class="d-flex align-items-center text-danger" id="remove-selected">
        <i class="fa-solid fa-user-minus font-12"></i>
        <p class="font-10 ml-2 mb-0">Remove user</p>
    </div>
</div>


<div id="wrapper" class="toggled py-5">

    <!-- mod Sidebar -->
    <div id="sidebar-wrapper">
        <div class="sidebar-nav">
            <!-- sidebar header -->
            <div class="d-flex justify-content-between align-items-center px-2 py-2 mb-3 shadow-sm secondary-bg"
                id="sidebar-header">
                <div class="font-14 d-flex align-items-center">
                    <i class="fa-solid fa-thumbtack"></i>
                    <p class="mb-0 ml-1 font-bold">Highlighted Threads</p>
                </div>
                <i class="fa-solid fa-xmark font-18" id="close-highlighted"></i>
            </div>
            <!-- sidebar body -->
            <div class="px-3">
                <div class="d-flex" id="tid-1760">
                    <div class="form-check">
                        <input class="form-check-input position-static" type="checkbox" id="blankCheckbox"
                            name="thread-selector" value="tid-1760">
                    </div>
                    <div>
                        <div class="d-flex justify-content-between">
                            <p class="font-8 mb-0 ml-1">Louis Rossman</p>
                            <p class="font-8 mb-0">Posted on 3rd March</p>
                        </div>
                        <div class="font-10 px-2 py-1 mb-2 secondary-border rounded-lg mb-2">
                            <p class="mb-0">I own a tesla roadster and it is great. It is fast and runs on
                                electricity.
                                Whats
                                not to love.
                            </p>
                        </div>
                        <div class="d-flex justify-content-between">
                            <div class="d-flex flex-column align-items-center">
                                <i class="fas fa-solid fa-feather-pointed font-12 mb-1"></i>
                                <p class="font-8 mb-0">Reflection</p>
                            </div>
                            <div class="d-flex flex-column align-items-center">
                                <i class="fas font-12 fa-solid fa-circle-chevron-up mb-1"></i>
                                <p class="font-8 mb-0">Visit thread</p>
                            </div>
                            <div class="d-flex flex-column align-items-center mb-1">
                                <i class="fas font-12 fa-solid fa-reply"></i>
                                <p class="font-8 mb-0">Reply</p>
                            </div>
                        </div>
                        <hr class="primary-border mb-20-px">
                    </div>
                </div>
                <div class="d-flex" id="tid-1761">
                    <div class="form-check">
                        <input class="form-check-input position-static" type="checkbox" name="thread-selector"
                            id="blankCheckbox" value="tid-1761">
                    </div>
                    <div>
                        <div class="d-flex justify-content-between">
                            <p class="font-8 mb-0 ml-1">Louis Rossman</p>
                            <p class="font-8 mb-0">Posted on 3rd March</p>
                        </div>
                        <div class="font-10 px-2 py-1 mb-2 secondary-border rounded-lg mb-2">
                            <p class="mb-0">I own a tesla roadster and it is great. It is fast and runs on
                                electricity.
                                Whats
                                not to love.
                            </p>
                        </div>
                        <div class="d-flex justify-content-between">
                            <div class="d-flex flex-column align-items-center">
                                <i class="fas fa-solid fa-feather-pointed font-12 mb-1"></i>
                                <p class="font-8 mb-0">Reflection</p>
                            </div>
                            <div class="d-flex flex-column align-items-center">
                                <i class="fas font-12 fa-solid fa-circle-chevron-up mb-1"></i>
                                <p class="font-8 mb-0">Visit thread</p>
                            </div>
                            <div class="d-flex flex-column align-items-center mb-1">
                                <i class="fas font-12 fa-solid fa-reply"></i>
                                <p class="font-8 mb-0">Reply</p>
                            </div>
                        </div>
                        <hr class="primary-border mb-20-px">
                    </div>
                </div>
                <div class="d-flex" id="tid-1762">
                    <div class="form-check">
                        <input class="form-check-input position-static" type="checkbox" name="thread-selector"
                            id="blankCheckbox" value="tid-1762">
                    </div>
                    <div>
                        <div class="d-flex justify-content-between">
                            <p class="font-8 mb-0 ml-1">Louis Rossman</p>
                            <p class="font-8 mb-0">Posted on 3rd March</p>
                        </div>
                        <div class="font-10 px-2 py-1 mb-2 secondary-border rounded-lg mb-2">
                            <p class="mb-0">I own a tesla roadster and it is great. It is fast and runs on
                                electricity.
                                Whats
                                not to love.
                            </p>
                        </div>
                        <div class="d-flex justify-content-between">
                            <div class="d-flex flex-column align-items-center">
                                <i class="fas fa-solid fa-feather-pointed font-12 mb-1"></i>
                                <p class="font-8 mb-0">Reflection</p>
                            </div>
                            <div class="d-flex flex-column align-items-center">
                                <i class="fas font-12 fa-solid fa-circle-chevron-up mb-1"></i>
                                <p class="font-8 mb-0">Visit thread</p>
                            </div>
                            <div class="d-flex flex-column align-items-center mb-1">
                                <i class="fas font-12 fa-solid fa-reply"></i>
                                <p class="font-8 mb-0">Reply</p>
                            </div>
                        </div>
                        <hr class="primary-border mb-20-px">
                    </div>
                </div>
                <div class="d-flex" id="tid-1762">
                    <div class="form-check">
                        <input class="form-check-input position-static" type="checkbox" name="thread-selector"
                            id="blankCheckbox" value="tid-1762">
                    </div>
                    <div>
                        <div class="d-flex justify-content-between">
                            <p class="font-8 mb-0 ml-1">Louis Rossman</p>
                            <p class="font-8 mb-0">Posted on 3rd March</p>
                        </div>
                        <div class="font-10 px-2 py-1 mb-2 secondary-border rounded-lg mb-2">
                            <p class="mb-0">I own a tesla roadster and it is great. It is fast and runs on
                                electricity.
                                Whats
                                not to love.
                            </p>
                        </div>
                        <div class="d-flex justify-content-between">
                            <div class="d-flex flex-column align-items-center">
                                <i class="fas fa-solid fa-feather-pointed font-12 mb-1"></i>
                                <p class="font-8 mb-0">Reflection</p>
                            </div>
                            <div class="d-flex flex-column align-items-center">
                                <i class="fas font-12 fa-solid fa-circle-chevron-up mb-1"></i>
                                <p class="font-8 mb-0">Visit thread</p>
                            </div>
                            <div class="d-flex flex-column align-items-center mb-1">
                                <i class="fas font-12 fa-solid fa-reply"></i>
                                <p class="font-8 mb-0">Reply</p>
                            </div>
                        </div>
                        <hr class="primary-border mb-20-px">
                    </div>
                </div>
                <div class="d-flex" id="tid-1763">
                    <div class="form-check">
                        <input class="form-check-input position-static" type="checkbox" name="thread-selector"
                            id="blankCheckbox" value="tid-1763">
                    </div>
                    <div>
                        <div class="d-flex justify-content-between">
                            <p class="font-8 mb-0 ml-1">Louis Rossman</p>
                            <p class="font-8 mb-0">Posted on 3rd March</p>
                        </div>
                        <div class="font-10 px-2 py-1 mb-2 secondary-border rounded-lg mb-2">
                            <p class="mb-0">I own a tesla roadster and it is great. It is fast and runs on
                                electricity.
                                Whats
                                not to love.
                            </p>
                        </div>
                        <div class="d-flex justify-content-between">
                            <div class="d-flex flex-column align-items-center">
                                <i class="fas fa-solid fa-feather-pointed font-12 mb-1"></i>
                                <p class="font-8 mb-0">Reflection</p>
                            </div>
                            <div class="d-flex flex-column align-items-center">
                                <i class="fas font-12 fa-solid fa-circle-chevron-up mb-1"></i>
                                <p class="font-8 mb-0">Visit thread</p>
                            </div>
                            <div class="d-flex flex-column align-items-center mb-1">
                                <i class="fas font-12 fa-solid fa-reply"></i>
                                <p class="font-8 mb-0">Reply</p>
                            </div>
                        </div>
                        <hr class="primary-border mb-20-px">
                    </div>
                </div>
                <div class="d-flex" id="tid-1764">
                    <div class="form-check">
                        <input class="form-check-input position-static" type="checkbox" name="thread-selector"
                            id="blankCheckbox" value="tid-1764">
                    </div>
                    <div>
                        <div class="d-flex justify-content-between">
                            <p class="font-8 mb-0 ml-1">Louis Rossman</p>
                            <p class="font-8 mb-0">Posted on 3rd March</p>
                        </div>
                        <div class="font-10 px-2 py-1 mb-2 secondary-border rounded-lg mb-2">
                            <p class="mb-0">I own a tesla roadster and it is great. It is fast and runs on
                                electricity.
                                Whats
                                not to love.
                            </p>
                        </div>
                        <div class="d-flex justify-content-between">
                            <div class="d-flex flex-column align-items-center">
                                <i class="fas fa-solid fa-feather-pointed font-12 mb-1"></i>
                                <p class="font-8 mb-0">Reflection</p>
                            </div>
                            <div class="d-flex flex-column align-items-center">
                                <i class="fas font-12 fa-solid fa-circle-chevron-up mb-1"></i>
                                <p class="font-8 mb-0">Visit thread</p>
                            </div>
                            <div class="d-flex flex-column align-items-center mb-1">
                                <i class="fas font-12 fa-solid fa-reply"></i>
                                <p class="font-8 mb-0">Reply</p>
                            </div>
                        </div>
                        <hr class="primary-border mb-20-px">
                    </div>
                </div>
                <div class="d-flex" id="tid-1765">
                    <div class="form-check">
                        <input class="form-check-input position-static" type="checkbox" name="thread-selector"
                            id="blankCheckbox" value="tid-1765">
                    </div>
                    <div>
                        <div class="d-flex justify-content-between">
                            <p class="font-8 mb-0 ml-1">Louis Rossman</p>
                            <p class="font-8 mb-0">Posted on 3rd March</p>
                        </div>
                        <div class="font-10 px-2 py-1 mb-2 secondary-border rounded-lg mb-2">
                            <p class="mb-0">I own a tesla roadster and it is great. It is fast and runs on
                                electricity.
                                Whats
                                not to love.
                            </p>
                        </div>
                        <div class="d-flex justify-content-between">
                            <div class="d-flex flex-column align-items-center">
                                <i class="fas fa-solid fa-feather-pointed font-12 mb-1"></i>
                                <p class="font-8 mb-0">Reflection</p>
                            </div>
                            <div class="d-flex flex-column align-items-center">
                                <i class="fas font-12 fa-solid fa-circle-chevron-up mb-1"></i>
                                <p class="font-8 mb-0">Visit thread</p>
                            </div>
                            <div class="d-flex flex-column align-items-center mb-1">
                                <i class="fas font-12 fa-solid fa-reply"></i>
                                <p class="font-8 mb-0">Reply</p>
                            </div>
                        </div>
                        <hr class="primary-border mb-20-px">
                    </div>
                </div>
                <div class="d-flex" id="tid-1766">
                    <div class="form-check">
                        <input class="form-check-input position-static" type="checkbox" name="thread-selector"
                            id="blankCheckbox" value="tid-1766">
                    </div>
                    <div>
                        <div class="d-flex justify-content-between">
                            <p class="font-8 mb-0 ml-1">Louis Rossman</p>
                            <p class="font-8 mb-0">Posted on 3rd March</p>
                        </div>
                        <div class="font-10 px-2 py-1 mb-2 secondary-border rounded-lg mb-2">
                            <p class="mb-0">I own a tesla roadster and it is great. It is fast and runs on
                                electricity.
                                Whats
                                not to love.
                            </p>
                        </div>
                        <div class="d-flex justify-content-between">
                            <div class="d-flex flex-column align-items-center">
                                <i class="fas fa-solid fa-feather-pointed font-12 mb-1"></i>
                                <p class="font-8 mb-0">Reflection</p>
                            </div>
                            <div class="d-flex flex-column align-items-center">
                                <i class="fas font-12 fa-solid fa-circle-chevron-up mb-1"></i>
                                <p class="font-8 mb-0">Visit thread</p>
                            </div>
                            <div class="d-flex flex-column align-items-center mb-1">
                                <i class="fas font-12 fa-solid fa-reply"></i>
                                <p class="font-8 mb-0">Reply</p>
                            </div>
                        </div>
                        <hr class="primary-border mb-20-px">
                    </div>
                </div>
            </div>
            <!-- sidebar footer -->
            <div class="primary-bg d-flex justify-content-center align-items-center py-2 text-danger"
                id="sidebar-footer">
                <p class="font-12 mb-0">Remove Highlighted Thread</p>
            </div>
        </div>
    </div>
    <!-- /#sidebar-wrapper -->

    <!-- Page Content -->
    <div id="page-content-wrapper" class="pt-5 pb-0 px-0">
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-12">

                    <!-- header -->
                    <div class="fixed-top" id="dr-header">
                        <div
                            class="dr-header d-flex justify-content-between align-items-center py-1 shadow-sm px-3 secondary-bg">
                            <div class="dr-name d-flex align-items-center">
                                <i class="fas fa-solid fa-arrow-left mr-2"></i>
                                <img src="https://cdn.motor1.com/images/mgl/VA0z9/s1/tesla-roadster.jpg"
                                    alt="tesla roadster" class="circle-sm rounded-circle mr-1">
                                <p class="font-bold font-14 mb-0">Elon Musk: Tesla</p>
                            </div>
                            <i class="fas fa-solid fa-ellipsis-vertical" id="menu-btn"></i>
                        </div>
                    </div>

                    <!-- search thread -->
                    <div class="d-none fixed-top" id="search-thread-box">
                        <div
                            class="d-flex justify-content-between align-items-center py-1 shadow-sm px-3 secondary-bg">
                            <i class="fas fa-solid fa-arrow-left mr-2" id="close-search"></i>
                            <input type="search" name="search-thread-input" id="search-thread-input"
                                class="form-control font-14" placeholder="Search Thread">
                        </div>
                    </div>

                    <!-- intro boxes: rules and suggested article -->
                    <div id="intro-boxes">
                        <div class="primary-bg rounded-10-px border-secondary p-3 mb-3" id="room-rules-text">
                            <div class="d-flex justify-content-between align-items-center">
                                <p class="font-14 mb-0">Rules of Discussion Room:</p>
                                <i class="fas fa-solid fa-xmark" id="close-rules"></i>
                            </div>
                            <ul class="font-10 mb-0 pl-3 mt-2">
                                <li>
                                    Use of any profanities will lead to instant banning of the user from this room
                                </li>
                                <li>
                                    This is a Technology oriented Discussion room and specifically about the Tesla
                                    Roadster so all
                                    threads
                                    should at least
                                    be related to Technology.
                                </li>
                                <li>
                                    Use of any profanities will lead to instant banning of the user from this room
                                </li>
                                <li>
                                    This is a Technology oriented Discussion room and specifically about the Tesla
                                    Roadster so all
                                    threads
                                    should at least
                                    be related to Technology.
                                </li>
                                <li>
                                    Lastly, Have fun and learn
                                </li>
                            </ul>
                        </div>

                        <div class="primary-bg rounded-10-px border-secondary px-3 pt-3 pb-1 mb-3"
                            id="room-article-text">
                            <div class="d-flex justify-content-between align-items-center">
                                <p class="font-12 mb-0">Article Recommended by the host:</p>
                                <i class="fas fa-solid fa-xmark" id="close-article"></i>
                            </div>
                            <div
                                class="m-3 secondary-bg d-flex justify-content-between align-items-center py-1 px-3 rounded-10-px shadow-sm">
                                <img src="https://electrek.co/wp-content/uploads/sites/3/2021/05/Tesla-Logo-Hero.jpg?quality=82&strip=all&w=1000"
                                    alt="tesla" class="circle-md rounded-circle mr-2">
                                <div>
                                    <p class="font-12 mb-0">Electric Vehicles</p>
                                    <p class="font-8 brand-text mb-0">Sat, May 21,2022</p>
                                    <p class="mt-1 font-8 text-secondary mb-0">learning processes are being broken
                                        down during the</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    <!-- /#page-content-wrapper -->

    <!-- attachment options -->
    <div class="d-none attachments-menu">
        <div
            class="secondary-bg shadow-sm primary-border rounded-10-px d-inline-flex flex-column py-2 px-1 justify-content-between align-items-center">

            <input type="file" class="form-control-file d-none" id="event-img" />
            <label for="event-img" class="mb-2">
                <i class="fas fa-solid fa-file"></i>
            </label>

            <input type="file" accept="image/*" class="form-control-file d-none" id="event-img" />
            <label for="event-img" class="mb-2">
                <i class="fas fa-solid fa-image"></i>
            </label>

            <input type="file" accept="image/*" class="form-control-file d-none" id="event-img" />
            <label for="event-img" class="mb-0">
                <i class="fas fa-solid fa-camera"></i>
            </label>
        </div>
    </div>

    <div class="chat-row incoming">
        <img src="https://www.thoughtco.com/thmb/jIUclL8nYDNm5ikjNTHoAtRnKxg=/735x0/good-looking-man-with-big-beard-56688bcf3df78ce1611f7ba8.jpg"
            alt="man1" class="circle-sm rounded-circle img-cover">
        <div>
            <p class="font-8 mb-0">Louis Rossman</p>
            <div class="chat">
                <p class="mb-0 font-10">I own a tesla roadster and it is great. It is fast and runs on electricity.
                    Whats not to
                    love</p>
            </div>
        </div>
    </div>
    <div class="chat-row outgoing" id="7213">
        <div>
            <p class="font-8 mb-0">
                Me
            </p>
            <div class="chat">
                <p class="mb-0 font-10">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                    ex ea commodo consequat. Duis
                    aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                    laborum.</p>
            </div>
        </div>
        <img src="https://www.mantruckandbus.com/fileadmin/_processed_/c/7/csm_frank-sprenger-interviewkachel_4470dab1a7.jpg"
            alt="man 2" class="circle-sm rounded-circle img-cover">
    </div>
    <div class="chat-row incoming">
        <img src="https://www.thoughtco.com/thmb/jIUclL8nYDNm5ikjNTHoAtRnKxg=/735x0/good-looking-man-with-big-beard-56688bcf3df78ce1611f7ba8.jpg"
            alt="man1" class="circle-sm rounded-circle img-cover">
        <div>
            <p class="font-8 mb-0">Louis Rossman</p>
            <div class="chat">
                <p class="mb-0 font-10">I own a tesla roadster and it is great. It is fast and runs on
                    electricity.
                    Whats not to
                    love</p>
            </div>
        </div>
    </div>
    <div class="chat-row outgoing">
        <div>
            <p class="font-8 mb-0">
                Me
            </p>
            <div class="chat">
                <p class="mb-0 font-10">I own a tesla roadster and it is great. It is fast and runs on
                    electricity.
                    Whats not to
                    love</p>
            </div>
        </div>
        <img src="https://www.mantruckandbus.com/fileadmin/_processed_/c/7/csm_frank-sprenger-interviewkachel_4470dab1a7.jpg"
            alt="man 2" class="circle-sm rounded-circle img-cover">
    </div>
    <div class="chat-row incoming">
        <img src="https://www.thoughtco.com/thmb/jIUclL8nYDNm5ikjNTHoAtRnKxg=/735x0/good-looking-man-with-big-beard-56688bcf3df78ce1611f7ba8.jpg"
            alt="man1" class="circle-sm rounded-circle img-cover">
        <div>
            <p class="font-8 mb-0">Louis Rossman</p>
            <div class="chat">
                <p class="mb-0 font-10">I own a tesla roadster and it is great. It is fast and runs on electricity.
                    Whats not to
                    love</p>
            </div>
        </div>
    </div>
    <div class="chat-row outgoing">
        <div>
            <p class="font-8 mb-0">
                Me
            </p>
            <div class="chat">
                <p class="mb-0 font-10">I own a tesla roadster and it is great. It is fast and runs on
                    electricity.
                    Whats not to
                    love</p>
            </div>
        </div>
        <img src="https://www.mantruckandbus.com/fileadmin/_processed_/c/7/csm_frank-sprenger-interviewkachel_4470dab1a7.jpg"
            alt="man 2" class="circle-sm rounded-circle img-cover">
    </div>
    <div class="chat-row incoming">
        <img src="https://www.thoughtco.com/thmb/jIUclL8nYDNm5ikjNTHoAtRnKxg=/735x0/good-looking-man-with-big-beard-56688bcf3df78ce1611f7ba8.jpg"
            alt="man1" class="circle-sm rounded-circle img-cover">
        <div>
            <p class="font-8 mb-0">Louis Rossman</p>
            <div class="chat">
                <p class="mb-0 font-10">I own a tesla roadster and it is great. It is fast and runs on electricity.
                    Whats not to
                    love</p>
            </div>
        </div>
    </div>
    <div class="chat-row incoming">
        <img src="https://www.thoughtco.com/thmb/jIUclL8nYDNm5ikjNTHoAtRnKxg=/735x0/good-looking-man-with-big-beard-56688bcf3df78ce1611f7ba8.jpg"
            alt="man1" class="circle-sm rounded-circle img-cover">
        <div>
            <p class="font-8 mb-0">Louis Rossman</p>
            <div class="chat">
                <p class="mb-0 font-10">I own a tesla roadster and it is great. It is fast and runs on electricity.
                    Whats not to
                    love</p>
            </div>
        </div>
    </div>
    <div class="chat-row incoming">
        <img src="https://www.thoughtco.com/thmb/jIUclL8nYDNm5ikjNTHoAtRnKxg=/735x0/good-looking-man-with-big-beard-56688bcf3df78ce1611f7ba8.jpg"
            alt="man1" class="circle-sm rounded-circle img-cover">
        <div>
            <p class="font-8 mb-0">Louis Rossman</p>
            <div class="chat">
                <p class="mb-0 font-10">I own a tesla roadster and it is great. It is fast and runs on electricity.
                    Whats not to
                    love</p>
            </div>
        </div>
    </div>
    <div class="chat-row incoming">
        <img src="https://www.thoughtco.com/thmb/jIUclL8nYDNm5ikjNTHoAtRnKxg=/735x0/good-looking-man-with-big-beard-56688bcf3df78ce1611f7ba8.jpg"
            alt="man1" class="circle-sm rounded-circle img-cover">
        <div>
            <p class="font-8 mb-0">Louis Rossman</p>
            <div class="chat">
                <div class="reply mb-1" pointer="7213">
                    <p class="font-10 mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod
                        tempor incididunt ut labore et dolore magna
                        aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                        aliquip
                        ex ea commodo consequat. Duis
                        aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                        pariatur. Excepteur sint
                        occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                        laborum.</p>
                </div>
                <p class="mb-0 font-10">I own a tesla roadster and it is great. It is fast and runs on electricity.
                    Whats not to
                    love</p>
            </div>
        </div>
    </div>

    <!-- text field -->
    <div class="fixed-bottom mb-2 px-3" id="dr-footer">
        <form action="" id="chatbox">
            <div class="input-group">
                <input type="text" class="form-control font-12" placeholder="Type a message" name="chatbox"
                    id="chat-input">
                <div class="input-group-append" id="button-addon4">
                    <button class="border-0 secondary-bg ml-1" id="attachments-btn" type="button">
                        <i class="fas fa-solid fa-paperclip" id="attachments-btn"></i>
                    </button>
                    <button class="border-0 secondary-bg brand-text ml-1" type="submit" id="submit-thread">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>

<!-- leave modal -->
<div class="modal fade" id="mod-leave-modal" tabindex="-1" aria-labelledby="mod-leave-modal-label"
    aria-hidden="true">
    <div class="modal-dialog p-4 m-0">
        <div class="modal-content secondary-bg rounded-10-px">
            <div class="modal-body">
                <div class="search-participant mb-3">
                    <input type="search" name="search-participant-box" id="search-participant-box"
                        class="form-control font-10" placeholder="Search participants list">
                    <div class="row mt-3">
                        <div class="col-6 d-flex align-items-center mb-2 pariticipant-selectable">
                            <img src="https://cdn.pixabay.com/photo/2015/01/08/18/29/entrepreneur-593358__340.jpg"
                                alt="man1" class="img-cover circle-sm rounded-circle">
                            <div class="ml-1">
                                <p class="font-10 mb-0">Adam Spintzer</p>
                                <p class="font-8 brand-text mb-0">Moderator</p>
                            </div>
                        </div>
                        <div class="col-6 d-flex align-items-center mb-2 pariticipant-selectable">
                            <img src="https://static01.nyt.com/images/2019/11/17/books/review/17Salam/Salam1-superJumbo.jpg"
                                alt="man1" class="img-cover circle-sm rounded-circle">
                            <div class="ml-1">
                                <p class="font-10 mb-0">July Cramer</p>
                                <p class="font-8 brand-text mb-0">Moderator</p>
                            </div>
                        </div>
                        <div class="col-6 d-flex align-items-center mb-2 pariticipant-selectable">
                            <img src="https://www.thoughtco.com/thmb/jIUclL8nYDNm5ikjNTHoAtRnKxg=/735x0/good-looking-man-with-big-beard-56688bcf3df78ce1611f7ba8.jpg"
                                alt="man1" class="img-cover circle-sm rounded-circle">
                            <p class="font-10 ml-1 mb-0">Arnold Parker</p>
                        </div>
                        <div class="col-6 d-flex align-items-center mb-2 pariticipant-selectable">
                            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500g"
                                alt="man1" class="img-cover circle-sm rounded-circle">
                            <p class="font-10 ml-1 mb-0">Sam Cardon</p>
                        </div>
                        <div class="col-6 d-flex align-items-center mb-2 pariticipant-selectable">
                            <img src="https://www.the-sun.com/wp-content/uploads/sites/6/2021/12/NINTCHDBPICT000546900214.jpg"
                                alt="man1" class="img-cover circle-sm rounded-circle">
                            <p class="font-10 ml-1 mb-0">Ally Lotti</p>
                        </div>
                        <div class="col-6 d-flex align-items-center mb-2 pariticipant-selectable">
                            <img src="https://cdn.episode.ninja/file/episodeninja/6404757.jpg" alt="man1"
                                class="img-cover circle-sm rounded-circle">
                            <p class="font-10 ml-1 mb-0">Crony Parkinson</p>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-between px-5">
                    <button type="button" class="button-tertiary-blue-text font-12 border-0"
                        id="cancel-leave">Cancel</button>
                    <button type="button" class="button-tertiary text-danger font-12 border-0"
                        id="leave-final">Leave</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- delete thread modal -->
<div class="modal fade" id="delete-thread-modal" tabindex="-1" aria-labelledby="delete-thread-modal-label"
    aria-hidden="true">
    <div class="modal-dialog p-4 m-0">
        <div class="modal-content secondary-bg rounded-10-px">
            <div class="modal-body">
                <div class="d-flex justify-content-center mb-1">
                    <p class="font-14 font-medium text-center">Are you sure you want to delete this thread?
                    </p>
                </div>
                <div class="d-flex justify-content-between px-5">
                    <button type="button" class="button-tertiary-blue-text font-12 border-0"
                        id="cancel-delete">Cancel</button>
                    <button type="button" class="button-tertiary text-danger font-12 border-0"
                        id="delete-final">delete</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- remove user modal -->
<div class="modal fade" id="remove-user-modal" tabindex="-1" aria-labelledby="remove-user-modal-label"
    aria-hidden="true">
    <div class="modal-dialog p-4 m-0">
        <div class="modal-content secondary-bg rounded-10-px">
            <div class="modal-body">
                <div class="d-flex justify-content-center mb-1">
                    <p class="font-14 font-medium text-center">Are you sure you want to remove this user?
                    </p>
                </div>
                <div class="d-flex justify-content-between px-5">
                    <button type="button" class="button-tertiary-blue-text font-12 border-0"
                        id="cancel-remove">Cancel</button>
                    <button type="button" class="button-tertiary text-danger font-12 border-0"
                        id="remove-final">remove</button>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="primary-bg container d-flex align-items-center py-2">
    <i class="fa-solid fa-arrow-left" id="back-btn"></i>
    <div class="font-semi-bold ml-3">Change Username</div>
</div>
<div class="container mt-3">
    <form>
        <div class="form-group">
            <label for="newUserName" class="font-12 font-medium">Enter your new Username</label>
            <input type="text" class="form-control font-12" id="newUserName" name="username" required>
            <div id="username-check"></div>
        </div>
        <div class="form-group">
            <label for="curpwd" class="font-12 font-medium">Enter your current Password</label>
            <input type="password" class="form-control font-12" id="curpwd" name="password" required>
            <div id="password-check"></div>
        </div>
        <button type="submit" class="btn button-brand font-12">Confirm</button>
    </form>
</div>
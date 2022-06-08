<div class="primary-bg container d-flex align-items-center py-2">
    <i class="fa-solid fa-arrow-left" id="back-btn"></i>
    <div class="font-semi-bold ml-3">Change Password</div>
</div>
<div class="container mt-3">
    <form>
        <div class="form-group">
            <label for="newpwd" class="font-12 font-medium">Enter your new Password</label>
            <input type="password" class="form-control font-12" id="newpwd" name="newPassword" required>
        </div>
        <div class="form-group" id="match-check">
            <label for="confirmpwd" class="font-12 font-medium">Re-enter your new Password</label>
            <input type="password" class="form-control font-12" id="confirmpwd" name="confirmpwd" required>
        </div>
        <div class="form-group">
            <label for="oldpwd" class="font-12 font-medium">Enter your current Password</label>
            <input type="password" class="form-control font-12" id="oldpwd" name="currentPassword" required>
        </div>
        <button type="submit" class="btn button-brand font-12">Confirm</button>
    </form>
</div>
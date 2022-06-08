<div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content p-3 rounded-10-px">
            <div class="d-flex justify-content-center align-items-center mb-3">
                <img src="https://blog.deepthought.education/wp-content/uploads/2022/05/dt-logo.svg" alt="dt logo">
            </div>
            <p class="font-semi-bold text-center">Are you sure you want to delete your account?</p>
            <div class="d-flex justify-content-center">
                <button type="button" class="btn button-primary font-12 mr-3">Delete</button>
                <button type="button" class="btn button-brand font-12 ml-3" data-dismiss="modal">Cancel</button>
            </div>
        </div>
    </div>
</div>

<div class="primary-bg container d-flex align-items-center py-2">
    <i class="fa-solid fa-arrow-left"></i>
    <div class="font-semi-bold ml-3">Change Email ID</div>
</div>
<div class="container mt-3">
    <form>
        <div class="form-group">
            <label for="nameInput" class="font-12 font-medium">Enter your Name</label>
            <input type="text" class="form-control font-12" id="nameInput" placeholder="name@example.com" required>
        </div>
        <div class="form-group">
            <label for="emailInput" class="font-12 font-medium">Enter your Email address</label>
            <input type="email" class="form-control font-12" id="emailInput" placeholder="name@example.com"
                required>
        </div>
        <div class="form-group">
            <label for="resonInput" class="font-12 font-medium">Why do you wish to delete your account?</label>
            <textarea class="form-control font-12" id="resonInput" rows="3" required></textarea>
        </div>
        <button type="submit" class="btn button-brand font-12" data-toggle="modal"
            data-target="#confirmModal">Confirm</button>
    </form>
</div>
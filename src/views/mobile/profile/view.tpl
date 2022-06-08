<div class="primary-bg font-12">
    <div class="secondary-bg p-3 rounded-10-px my-3 primary-shadow">
      <div class="d-flex position-relative justify-content-betweeen">
        <div class="pr-3 ">
          <img id="profilePicture" class="rounded-circle" alt="" width="100px" height="100px" />
        </div>
        <div>
          <div class="text-capitalize font-24" >
            {user.fullname} <sup id="cca2" name="location"  >{user.location}</sup>
          </div>
          <div class="brand-text font-12 font-weight-bold" name="social_designation">
            {user.social_designation}
          </div>
        </div>
        <div class="mx-3"><i
          onclick="window.location.href='edit'"
          class="fas fa-edit"
        ></i> </div>
        
      </div>
      <div class="position-relative font-italic my-3 font-14 text-break text-wrap text-center" >
        <p>
          "{user.signature}"
        </p>
      </div>
      <div class="d-flex justify-content-around">
        <button
          type="submit"
          class="btn btn-sm rounded-lg btn-outline-secondary px-4 shadow-sm"
        >
          Post
        </button>
        <button
          type="submit"
          class="button-brand rounded-lg btn btn-sm px-4 shadow-sm"
        >
          Article
        </button>
      </div>
    </div>
    <div class="secondary-bg p-3 rounded-10-px my-3 primary-shadow">
      <div class="brand-text text-capitalize font-18">about {user.fullname}</div>
      <div class="font-12 mt-2 text-break text-wrap">
        {user.aboutme}
      </div>
    </div>

    <div class="secondary-bg py-3 rounded-10-px my-3 primary-shadow">
      <div class="brand-text text-capitalize font-18 px-3">best from {user.fullname}</div>
      <div class="author-content font-12 px-3 py-2">
        <p class="mb-0">
          It's through mistakes that you actually can grow.You have to get bad
          in order to get good.<span class="brand-text"> read more...</span>
        </p>
      </div>
      <div class="author-content font-12 px-3 py-2">
        <p class="mb-0">
          Graphic design is a craft where professionals create visual content to
          communicate messages.<span class="brand-text"> read more...</span>
        </p>
      </div>
      <div class="author-content font-12 px-3 py-2">
        <p class="mb-0">
          It was the beginning of the greatest Christmas ever. Little food No
          presents.<span class="brand-text"> read more...</span>
        </p>
      </div>
    </div>

    <div class="secondary-bg rounded-10-px py-3 my-3 primary-shadow">
      <div class="brand-text text-capitalize font-18 px-3">activities</div>
      <div class="author-activity font-12 px-3 py-2">
        My name is jane and I am a Junior Web Developer for Oswald Technologies
        <div
          class="row text-capitalize font-8 mt-2 d-flex position-relative justify-content-between"
        >
          <div class="col-3 px-3  font-8">
            <i class="fa fa-thumbs-o-up" aria-hidden="true"></i> 25 likes
          </div>
          <div class="col-6 px-3  font-8">
            <i class="fa fa-comments-o" aria-hidden="true"></i> 8 comments
          </div>
          <div class="col-3 px-3  font-8">25 mins ago</div>
        </div>
      </div>

      <div class="author-activity font-12 px-3 py-2">
        My name is jane and I am a Junior Web Developer for Oswald Technologies
        <div
          class="row text-capitalize font-8 mt-2 d-flex position-relative justify-content-between"
        >
          <div class="col-3 px-3  font-8">
            <i class="fa fa-thumbs-o-up" aria-hidden="true"></i> 69 likes
          </div>
          <div class="col-6 px-3 font-8">
            <i class="fa fa-comments-o" aria-hidden="true"></i> 10 comments
          </div>
          <div class="col-3 px-3 font-8 ">3 hrs ago</div>
        </div>
      </div>
      <div class="author-activity font-12 px-3 py-2">
        My name is jane and I am a Junior Web Developer for Oswald Technologies
        <div
          class="row text-capitalize font-8 mt-2 d-flex position-relative justify-content-between"
        >
          <div class="col-3 px-3 font-8">
            <i class="fa fa-thumbs-o-up" aria-hidden="true"></i> 1005 likes
          </div>
          <div class="col-6 px-3 font-8">
            <i class="fa fa-comments-o" aria-hidden="true"></i> 101 comments
          </div>
          <div class="col-3 px-3 font-8">10 days ago</div>
        </div>
      </div>
    </div>
</div>
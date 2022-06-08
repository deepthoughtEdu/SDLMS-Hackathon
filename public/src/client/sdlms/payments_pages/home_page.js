"use strict";

/* globals define */

define("forum/sdlms/payments_pages/home_page", ["api"], function(api) {
  var home_page = {};
  home_page.init = function() {
      console.log('hello')

      var CocredsPacks=[]
      CocredsPacks=ajaxify.data.allCocredProducts

      console.log(CocredsPacks)

     
      // CocredsPack= ajaxify.data.allCocredsProducts
      // console.log(CocredsPack)

      $('.profile').append( ` <div class="row p-4">
      <div class="col-4">
          <img height="63px" width="63px" class="profile-pic rounded-circle" src="${ajaxify.data.user.picture}" alt="profilePic" />
      </div>
      <div class="col-8 mt-2 ">
          <span class="name font-20 font-medium">${ajaxify.data.user.username}</span>
         <br>
         <div class=" ">
             <span class="font-medium">Balance:</span> <span>20,000</span> <span>Cocreds</span>
         </div>
      </div>
  </div>`);

  $('.amount-textarea').append(`<div class="input-group-prepend">
  <label class="input-group-text" for="inputGroupSelect01">₹</label>
</div>
<select class="custom-select" id="inputGroupSelect01">
  <option selected>Choose Amount...</option>
  <option value="1">${CocredsPacks[0].amount}</option>
  <option value="2">${CocredsPacks[3].amount}</option>
  <option value="3">${CocredsPacks[4].amount}</option>
  <option value="3">${CocredsPacks[5].amount}</option>
  <option value="3">${CocredsPacks[1].amount}</option>
</select>`)

    $('.subcription').on('click',function(){
        ajaxify.go(`/payments/subscription`);
    })
    
    $('.transaction').on('click',function(){
        ajaxify.go(`/payments/transaction`);
    })
  }
  return home_page;
})
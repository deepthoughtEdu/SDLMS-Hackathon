class Sharer {
	constructor(data) {
		this.tid = data.tid;
		this.sharer = data.sharer;
		this.target = data.target;
		this.builder(this.target);
	}
	unique(prefix = "") {
		var dt = new Date().getTime();
		var uuid = "xxxxxxxx-xxxx-yxxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
			var r = (dt + Math.random() * 16) % 16 | 0;
			dt = Math.floor(dt / 16);
			return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
		});
		return prefix + uuid;
	}
	builder(target = 'body') {
		let $target = $(target);
		let _$id = this.unique('sdlms-sharer-');
		let $that = this;
		$target.empty();
		$target.append(`<sdlms-sharer id="${_$id}"><svg  data-toggle="modal" data-target="#generateLink_${_$id}" sharer-link="${$that.tid}" fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30px" height="30px" style="width: 27px;margin-bottom: 2px;margin-right: 1px;"><path d="M 23 3 A 4 4 0 0 0 19 7 A 4 4 0 0 0 19.09375 7.8359375 L 10.011719 12.376953 A 4 4 0 0 0 7 11 A 4 4 0 0 0 3 15 A 4 4 0 0 0 7 19 A 4 4 0 0 0 10.013672 17.625 L 19.089844 22.164062 A 4 4 0 0 0 19 23 A 4 4 0 0 0 23 27 A 4 4 0 0 0 27 23 A 4 4 0 0 0 23 19 A 4 4 0 0 0 19.986328 20.375 L 10.910156 15.835938 A 4 4 0 0 0 11 15 A 4 4 0 0 0 10.90625 14.166016 L 19.988281 9.625 A 4 4 0 0 0 23 11 A 4 4 0 0 0 27 7 A 4 4 0 0 0 23 3 z"></path></svg></sdlms-sharer>`);
		$('body').append(`<div class="modal modal_outer right_modal fade" id="generateLink_${_$id}" tab_$id="-1" role="dialog" aria-labelledby="egenerateLink_${_$id}Label">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${this.title || 'Generate Shareable Link'}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
             <div class="modal-body overflow-auto p-0 rounded-0 pb-5">
                <form action="" class="p-3" id="generateLink_${_$id}">
                 <input type="hidden" name="id">
                  <div class="col-md-12 mb-3" expiry>
                      <label>Expires On</label>
                      <input type="datetime-local" name="expiry" class="form-control" required />
                  </div>
                   <div link></div>
                   <div class="d-flex justify-content-end px-3 w-100 ">
                      <button type="submit" class="btn button-primary sdlms-button">Save</button>
                  </div>
               </form>
            </div>
          </div>
        </div>
      </div>`);
		$('body').on('click', '[sharer-link]', function (e) {

			let $id = $(this).attr('sharer-link');
			let data = {
				type: 'class',
				id: $id
			}
			if ($that.sharer && (Date.now() < $that.sharer.expireAt)) {
				let link = `${window.location.origin}${$that.sharer.link}`;
				app.copyText(link);
				e.stopPropagation();
				e.preventDefault();
				return;
			}
			$('#generateLink_' + _$id).off('submit').on('submit', function (e) {
				e.preventDefault();
				let $this = $(this);
				let expireAt = $(this).find('[name="expiry"]').val();
				if (expireAt && expireAt != '' && (expireAt < Date.now())) {
					notify('Expiry date should be greater than current date', 'error');
					return false;
				}
				data.expireAt = (expireAt && expireAt != '') ? ((new Date(expireAt)).getTime()) : undefined;
				$(this).find('button[type="submit"]').prop('disabled', true);
				require(['api'], function (api) {
					api.post('/sdlms/sharer', data).then((response) => {
						let link = `${window.location.origin}${response.link}`;
						app.copyText(link);
						$that.sharer = response;
						$('.right_modal').trigger('click')

					}).catch((error) => {
						$this.find('button[type="submit"]').prop('disabled', !true);
						if (error.message) notify(error.message, 'error');

					});
				})
			});
		})

	}

}
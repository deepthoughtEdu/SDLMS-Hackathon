class Users {
	constructor(options) {
		this.$target = options.target;
		this.data = options;
		this.data.with = options.with || {};
		this.search = options.search;
		this.init(this.$target);
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
	init(target = 'body') {
		this.id = this.unique("sdlms-users-");
		let $that = this;
		let $target = $(target);
		if (!$target.length) {
			console.log("No HTML element found For Builder Given ==>" + target);
			return;
		}
		$target.empty();
		$target.append(
			$("<sdlms-users>")
			.attr({
				id: $that.id,
				class: $that.data.noAction ? "sdlms-readonly" : ''
			})
			.append(`<div class="sdlms-asset-owner" style="display:${$that.data.name || "none"} " name="${$that.data.name}" ></div>`)
			.append(
				$("<div>").attr({
					id: "elem-" + $that.id,
					class: 'd-flex flex-wrap ' + ($that.data.action == 'reader' ? 'readonly' : 'create') + (!$that.data.control ? " no-control" : ""),
					novalidate: ''
				})
			)
		);
		let $builder = $(`#elem-${$that.id}`);
        this.$builder = $builder;
		$that[$that.data.action == 'reader' ? 'reader' : 'create']($that.data.with);
	}
	create(data) {
		let $that = this;
		let $builder = $that.$builder;
		require(['api'], function (api) {
			api.get('/api/users', {
				paginate: false,
			}).then((response) => {
				let users = response.users;
				$builder.empty();
				$.each(users, function (i, e) {
					$builder.append(`
                    <div class="form-group form-check rendered mb-2 col-6">
                        <input type="checkbox" name="members" class="form-check-input custom-sdlms-checkbox" value="${e.uid}" id="student_${e.uid}">
                        <label class="form-check-label" for="student_${e.uid}">${e.fullname|| e.displayname || e.username}</label>
                    </div>`);
				});

			});
			$($that.search).off('keyup').on('keyup', function () {
				let search = $(this).val();
				$builder.find('.form-check').removeClass('rendered').hide();

				if (!$(this).data('searching')) {
					$(this).data('searching', 1);
					api.get('/api/users', {
						query: search,
						paginate: false,
					}).then((response) => {
						let users = response.users;
						$.each(users, function (i, e) {
							if ($builder.find(`#student_${e.uid}`).length) {
								$builder.find(`#student_${e.uid}`).parent('.form-check').addClass('.rendered').show();
							} else {
								$builder.append(`
                                <div class="form-group form-check rendered mb-2 col-6">
                                    <input type="checkbox" name="members" class="form-check-input custom-sdlms-checkbox" value="${e.uid}" id="student_${e.uid}">
                                    <label class="form-check-label" for="student_${e.uid}">${e.fullname|| e.displayname || e.username}</label>
                                </div>
                                `);
							}

						});
						$(this).data('searching', 0);
					})
				}

			});
		})
	}

	reader(data) {
		let $that = this;
		let $builder = $that.$builder;

		$builder.empty();
		if (data.length) {
			$($that.$target).removeClass('justify-content-center');
			$.each(data, function (i, e) {
				$builder.append(`
				<div class="form-group form-check rendered mb-2 col-6">
					<input type="checkbox" name="list-members" class="form-check-input custom-sdlms-checkbox" value="${e.uid}" id="student:${e.uid}">
					<label class="form-check-label d-flex" for="student:${e.uid}">${e.fullname|| e.displayname || e.username}</label>
				</div>`);
			});
		} else {
			$($that.$target).addClass('justify-content-center');
			$builder.append(`
				<div class="d-flex">
					<h5>No users to show</h5>
				</div>
			`);
		}
	}
    getValues(){
        let $target  = this.$builder;
        let values = [];
        $target.find("[name='members']:checked").each(function () {
            if ($(this).val() != '') values.push(Number($(this).val()));
        });
        return values;
    }
	getUserData(){
        let $target  = this.$builder;
        let userData = [];
        $target.find("[name='members']:checked").each(function () {
            if ($(this).val() != '') {
				let uid = Number($(this).val());
				userData.push({
				uid: uid,
				fullname: $(`[for="student_${uid}"]`).text(),
			});
		}
        });
        return userData;
    }
}

// let users = new Users({

// });

// let k = new Users({
//     target: '.desc',
//     search: '[name=name]'
// })

// let values = users.getValues();
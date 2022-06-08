/**
 * @author Deepansu
 * @date 05/2022
 * @description Allow user to build the Polls based on @tid and @uid
 * @returns @Polls 
 */

/**
 * @var {class} Polls
 * @description Contains the @methods or @function - to run the Polls
 * @function Polls.init
 * @function Polls.unique
 * @function Polls.log
 * @function Polls.builder
 * @function Polls.create
 */

class Polls {
	constructor(data = {}) {
		/**
		 * @author Deepansu
		 * @description Tid is required to init a Poll
		 */

		if (!data.tid) throw new Error("Invalid tid supplied");

		this.tid = data.tid;
		this.data = data;
		this.groups = data.groups || [];
		if (!this.groups.length) throw new Error("No Groups Found");
		this.builder(this.data.target);
	}
	/**
	 * @author Deepansu
	 * @date 12/2021
	 * @name unique
	 * @type {function} 
	 * @description to get unique id 
	 * @param {String} prefix optional identifier for generated unique id {prefix + id}
	 */

	static unique(prefix = "") {
		var dt = new Date().getTime();
		var uuid = "xxxxxxxx-xxxx-yxxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
			var r = (dt + Math.random() * 16) % 16 | 0;
			dt = Math.floor(dt / 16);
			return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
		});
		return prefix + uuid;
	}
	/**
	 * @author Deepansu
	 * @date 05/2022
	 * @name log
	 * @type {function} 
	 * @description To Log 
	 * @param {*} log 
	 */

	log(log) {
		!this.data.log || console.log(log);
	}
	/**
	 * @author Deepansu
	 * @date 05/2022
	 * @name builder
	 * @type {function} 
	 * @description Attach an  sdlms-thread-builder element
	 * @param {HTML ELEMENT} HTML element to render builder default body 
	 */

	builder(target = "body") {

		this.id = Polls.unique("sdlms-polls-");
		let $that = this;
		let $target = $(target);
		if (!$target.length) {

			/**
			 * @author Deepansu
			 * @description Given target should be a valid HTML Element
			 */
			$that.log("No HTML element found For Builder Given ==>" + target);
			throw new Error(`No HTML element found while searching ${target}`);
		}
		$target.empty();
		$target.append(
			$("<sdlms-polls>")
			.attr({
				id: $that.id,
				class: $that.data.noAction ? "sdlms-readonly" : ''
			})
			.append(`<div class="sdlms-asset-owner" style="display:${$that.data.name || "none"} " name="${$that.data.name}" ></div>`)
			.append(
				$("<div>").attr({
					id: "poll-" + $that.id,
					class: 'w-100 overflow-auto sdlms-polls-container ' + ($that.data.action == 'reader' ? 'readonly' : 'create'),
				})
			)
		);
		let $builder = $(`#poll-${$that.id}`);
		$that.$builder = $builder;
		$that[$that.data.action == 'reader' ? 'reader' : 'create']($that.data.with);

	}

	/**
	 * @author Deepansu
	 * @date 05/2022
	 * @name create
	 * @type {function} 
	 * @description Append @Polls and  attach all the events 
	 * @param {Object} data optional if @Polls is initied with existing @Polls then render it with Exisiting
	 */
	create(data = null) {

		let $target = this.$builder,
			$that = this;
		this.tray();
	}
	static _template(data = {}) {
		let components = {
			tray: {
				header: (data) => {
					return '';
				},
				container: (data, html = "") => {
					return `<div class="list-group ${data.classes?data.classes:''}">${html}</div>`;
				},
				tabGroup: (data) => {
					return `<ul class="nav nav-tabs" role="tablist">
							${data.map((item)=>{
								return `<li class="nav-item" role="presentation">
									<a class="nav-link" id="${item.id}-tab" data-toggle="tab" href="#${item.id}" role="tab" aria-controls="${item.id}" aria-selected="true">${item.title}<i class="fas fa-bullhorn ml-2" data-group="${item.type}"  publish-group></i></a>
							 	 </li>`
							}).join('')}</ul>`
				},
				tabContainerGroup: (data) => {
					return `<div class="tab-content" id="myTabContent">
							${data.map((item)=>{
								return	`<div thought-group data-group-type="${item.type}" class="tab-pane ${item.classes ? item.classes : ''} fade" id="${item.id}" role="tabpanel" aria-labelledby="${item.id}-tab"></div>`
							}).join('')}</div>`
				},
				listContainer: (data, html = '') => {
					return `<ul class="list-group thought-container ${data.classes?data.classes:''}">${html}</ul>`;
				},
				list: (data) => {
					return `<li class="list-group-item w-100 d-flex justify-content-between ${data.classes?data.classes:''}" data-pid="${data.pid}" thought-list>
								<span class="text-capitalize">${data.content}</span><span data-pid="${data.pid}">upvote <span thought-vote-count="${data.pid}">0</span></span>
							</li>`;
				},
				group: (data, html = "") => {
					return `<div class="col-12 ${data.classes?data.classes:''}" >
						<div class="publish cursor-pointer"  publish-group>Publish ${data.type}</div>
						<div>${html}</div>
					</div>`
				}
			},
			thoughts: {
				header: (data) => {
					return '';
				},
				container: (data, html = "") => {
					return `<ul class="list-group thought-container ${data.classes?data.classes:''}">${html}</ul>`;
				},
				modal: (data) => {
					return `<div class="modal fade right_modal" id="${data.id}" thought-vote-modal tabindex="-1" aria-labelledby="${data.id}Label" aria-hidden="true">
						<div class="modal-dialog  modal-dialog-centered">
						  <div class="modal-content">
							<div class="modal-header">${data.title}</div>
							<div class="modal-body">

							</div>
						 </div>
					  </div>
					</div>`
				},

				list: (data) => {
					return `<li class="list-group-item w-100 d-flex justify-content-between ${data.classes?data.classes:''}" data-pid="${data.pid}" thought-list>
								<span class="text-capitalize"> <img src="${data.creator.profile}" class="thought-list-creator"> ${data.content}</span> <span vote-thought class="cursor-pointer" data-tid="${data.tid}" data-group="${data.group}" data-pid="${data.pid}">upvote <span thought-vote-count="${data.pid}">0</span></span>
							</li>`;
				},
			}
		}
		return components;
	}
	reader(data = null) {
		let $target = this.$builder;
		let $that = this;

	}

	tray() {
		let $target = this.$builder;
		let $that = this;
		let templates = Polls._template();
		let $id = Polls.unique("sdlms-polls-");

		let groups = this.groups;
		let groupTab = groups.map(e => {
			return {
				id: 'poll-tab-' + e + '-' + $id,
				title: e,
				classes: `${e}-${$id}`,
				type:e
			}
		});

		$target.append(templates.tray.header() + templates.tray.container({
			classes: `${$id} w-100 overflow-auto `
		}, (templates.tray.tabGroup(groupTab) + templates.tray.tabContainerGroup(groupTab))));

		let $tray = $target.find('.' + $id);

		$.each(groups, (i, group) => {
			updateGroups(group);
		});

		function updateGroups(group) {
			let payload = {
				tid: $that.tid,
				group: group,
			}
			socket.emit('sdlms.class.thought.get', payload, function (err, thoughts) {
				if (err) throw err;

				let thoughtsHTML = thoughts.length ? thoughts.map((thought) => templates.tray.list(thought)).join('') : '';

				if ($(`.${group}-${$id}`).length) {
					$(`.${group}-${$id}`).html(thoughtsHTML);
					return
				}
			});
		}
		console.log('#poll-tab-' + groups[0] + '-' + $id +'-tab');
		$('#poll-tab-' + groups[0] + '-' + $id + '-tab').trigger('click');
		$target.on('click', '[publish-group]', function () {
			console.log('publish');
			if ($(this).hasClass('publishing')) notify('Publishing...', 'info');
			$(this).attr('publishing', 1);
			let data = $(this).data();
			data.tid = $that.tid;
			socket.emit('sdlms.class.polls.announce', data, function (err, data) {
				if (err) throw err;
			});
			updateGroups(data.group);
		});

		socket.on('event:class.thought.selection', function (data) {
			let $group = $target.find(`.${data.group}-${$id}`);
			$group.append(templates.tray.list(data));
		});

		socket.on('event:class.thought.vote', function (data) {
			let $group = $target.find(`.${data.group}-${$id}`);
			let $list = $group.find(`[data-pid="${data.pid}"]`);
			$list.find(`[thought-vote-count="${data.pid}"]`).html((data.votes || 0).length);
		})
	}

	static thoughts(data, tid) {
		let $target = $('body');
		let $id = Polls.unique("sdlms-polls-");
		let templates = Polls._template();
		console.log(data);
		$('[thought-vote-modal]').remove();

		$target.append(templates.thoughts.modal({
			id: $id + '-modal',
			title: 'Vote'
		}));

		let $modal = $target.find('#' + $id + '-modal');
		$modal.find('.modal-body').append(templates.thoughts.container({}, ''));
		let $container = $modal.find('.thought-container');

		$.each(data, (i, thought) => {
			thought.tid = tid;
			$container.append(templates.thoughts.list(thought));
		});

		$modal.modal('show');

		$modal.on('click', '[vote-thought]', function () {
			let data = $(this).data();
			let $this = $(this);
			if ($('[vote-thought].voted').length) notify('You have already voted', 'info');
			$(this).addClass('voted');
			socket.emit('sdlms.class.thought.vote', data, (err, data) => {
				if (err) throw err;
				$this.removeClass('voted');
				$modal.modal('hide');
				$('body').removeClass('modal-open');
				$('.modal-backdrop').remove();
				$modal.remove();
			});
		});

	}
}
class tracker {
	constructor(data) {
		if (!data) throw new Error('No data provided');
		if (!data.key) throw new Error('No key provided');
		if (!data.uid) throw new Error('No uid provided');
		if (!data.event) throw new Error('No event provided');
		if (!data.target) throw new Error('No target provided');
		if (!data.asset_type) throw new Error('No Invalid type provided');

		if (!$(data.target).length) throw new Error('Target not found');
		this.tid = data.tid;
		this.data = data;
		this.frequency = data.frequency || 1;
		this.frequency = (this.frequency + Math.random())
		this.target = data.target;
		this.$elm = $(data.target);
		this.type = this.$elm[0].nodeName.toLowerCase();
		this.histories = localStorage.getItem(this.data.event + '_' + this.data.asset_type + '_' + this.data.key) ? JSON.parse(localStorage.getItem(this.data.event + '_' + this.data.asset_type + '_' + this.data.key)) : [];
		this.data.with = undefined;
		this.data.target = this.$elm.data();
		this.events();
	}
	events() {
		let $that = this;
		this.$elm.find('textarea, input:not([type="checkbox"],[type="radio"])').each(function () {
			$(this).off('keyup').on('keyup', debounce(function () {
				let data = {
					thread: $(this).attr('sdlms-id'),
					value: $(this).val(),
					parent_id: $(this).parents('[sdlms-id]').first().attr('sdlms-id'),
				}
				$('[members-assets]').find(`[sdlms-id="${data.parent_id}"]`).find(`[sdlms-id="${data.thread}"]`).html(`${data.value}`)
				$that.track(data);
			}, 1000));
		})
	}
	track(thr) {
		let $that = this;
		let data = this.trackings();
		var data_ = data.map(e => {
			let f = {};
			f.timestamp = e.timestamp;
			f.uid = $that.data.uid;
			f.count = e.count;
			f.id = e.id;
			f.tid = this.tid;
			f.asset_type = e.asset_type;
			f.event = e.event;
			f.key = e.key;
			f.action = e.action;
			f.value = thr;
			return f;
		});

		let string = '';
		$.each(data_, function (i, e) {
			string += JSON.stringify(e) + (i > 0 ? 'SDLMS_LOG_SEPARATOR' : '');
		});

		socket.emit('meta.live.track', {
			event: this.data.event,
			data: string,
			uid:$that.data.uid,
			key: this.data.key,
		}, function (err) {
			if (err) console.log(err);
		});
		socket.emit('sdlms.class.assets.update', {
			value: thr,
			key:$that.data.key,
			uid:$that.data.uid,
			classId:$that.data.key,
			asset_type:$that.data.asset_type,
			force_refresh: this.$elm.attr('force-refresh') || 0,
			latest: data[data.length - 1],
		});
		console.log('tracked');
		this.$elm.attr('force-refresh',0)
		this.histories = [];
		localStorage.setItem(this.data.event + '_' + this.data.asset_type + '_' + this.data.key, JSON.stringify(this.histories));
	}
	trackings() {
		let string = '';
		this.$elm.find('textarea, input:not([type="checkbox"],[type="radio"])').each(function () {
			string += $(this).val().replace(/[\r\n\s\x0B\x0C\u0085\u2028\u2029]+/g, " ") + ' ';
		});
		string = string.replace(/[\r\n\s\x0B\x0C\u0085\u2028\u2029]+/g, " ");
		string = $.trim(string);
		let $that = this;
		let track = {
				timestamp: new Date().getTime(),
					asset_type: $that.data.asset_type,
					event: $that.data.event,
					key: $that.data.key,
					action: $that.data.action,
			count: {
				characters: string.length,
				words: string.split(' ').length,
			},
		}
		console.log('on load');
		$(`.user-progress[data-uid="${this.data.uid}"]`).parents('[user-data]').find('.user-last-activity ').html(`Last minute`)
		$('[user-data]').find(`.user-progress[data-uid="${this.data.uid}"] [${this.data.asset_type}]`).html(`${track.count.characters} L`);
		this.histories.push(track);
		localStorage.setItem(this.data.event + '_' + this.data.asset_type + '_' + this.data.key, JSON.stringify(this.histories));
		return this.histories;
	}
}
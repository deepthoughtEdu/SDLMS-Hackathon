'use strict';

define('forum/sdlms/microscope', ['api', 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.1/chart.min.js', "sdlms/eaglebuilder", "sdlms/threadbuilder", "sdlms/feedbacks"], function (api) {
	var Microscope = {};
	Microscope = $.extend(Microscope, ajaxify.data.data);
	Microscope.$container = $('[sdlms-component="microscope"]');
	Microscope.charts = {};
	Microscope.colors = ['#2196f3', '#ff9800', '#4caf50', '#f44336', '#9c27b0', '#673ab7', '#3f51b5', '#009688', '#ffeb3b', '#795548', '#607d8b', '#e91e63', '#9e9e9e', '#000000'];
	window.students = [...Microscope.most.reactions];
	Microscope.reactions = Microscope.reactions || {};
	Microscope.reactions.reactions = Microscope.reactions.reactions || [];
	Microscope.init = function () {
		Microscope.$container.find('[date]').each(function () {
			var $this = $(this);
			var date = Number($this.attr('date'));
			$this.html(moment(date).format('ddd, DD MMM, YYYY'));
		});

		Microscope.initMembers();
		Microscope.getTrackStats();
	}
	Microscope.initMembers = () => {
		$("body").find(".sdlms-asset-selection-user-body").append(app._template('studentSearch', $.extend(Microscope.session.teacher, {
			isTeacher: true,
			role: 'teacher'
		})));
		api.get(`/sdlms/${Microscope.tid}/attendance`, {
				limit: 50
			})
			.then((r) => {
				$('[data-target="search-student"]').each(function () {
					let i = 't'+index++;
					$(this).append(Microscope._template('checkbox', $.extend({}, Microscope.session.teacher, {
						index: i,
						isTeacher: true,
						role: 'teacher'
					})))
				});
				$.each(r.data, function (index, student) {
					if (Array.isArray(window.students) && window.students.indexOf(student.uid) === -1) window.students.push(student);
					$("body").find(".sdlms-asset-selection-user-body").append(app._template('studentSearch', student));
					$('[data-target="search-student"]').each(function () {
						let i = index++;
						$(this).append(Microscope._template('checkbox', $.extend({}, student, {
							index: i
						})))
					});
				});
				$('.sdlms-asset-selection-user-body').data('next', r.next_page_url);
				$('.sdlms-asset-selection-user-body').data('prev', r.prev_page_url);

				$("body").find(".sdlms-asset-selection-user-body").off('click').on('click', '[data-students-search]', function (e) {
					var member = $(this).data();
					if (member.uid) {
						$('#studentAssetView').empty();
						$('[sdlms-toggle-members-list]').toggle();
						$('#studentAssetView').removeClass('h-100 w-100 text-center d-flex justify-content-center align-items-center');;
						$('[sdlms-members-asset-view],[sdlms-search]').toggleClass('w-100 sdlms-w-0');
						$('[asset-selection-label]').text(`${member.fullname || member.displayname || member.username}'s Eagle Builder`);
						$('[asset-selection-label]').addClass('active');
						$('[asset-selection-label]').data('uid', member.uid);
						if (member.role != "teacher" || (member.role == "teacher" && !Microscope.tracker)) {
							$('[asset-selection-label].active').off('click').on('click', function () {
								$('.assetSelectionDropDown').slideToggle();
								$(this).toggleClass('visibility-shown');
								let $this = $(this);
								$('.assetSelectionDropDown').find('[get-asset]').off('click').on('click', function () {
									$('#studentAssetView').empty().removeClass('h-100 w-100 text-center d-flex justify-content-center align-items-center');;
									$('[asset-selection-label]').text(`${member.fullname || member.displayname || member.username}'s ${$(this).data('type') == 'eb' ? 'Eagle' : 'Thread'} Builder`);
									$('.assetSelectionDropDown').slideToggle();
									$('.assetSelectionDropDown').find('[get-asset]').removeClass('active');
									$(this).addClass('active');
									Microscope.getAsset($this.data('uid'), $(this).data('type'));
								});
							});
							api.get(`/sdlms/${Microscope.tid}/eaglebuilder?uid=${member.uid}`, {}).then((r) => {
								let data = {
									meta: r.meta,
									tracks: r.tracks,
									conclusion: r.conclusion || {},
								};
								if (!r.tracks || !r.tracks.length) {
									$('#studentAssetView').html('No Eagle Builder found').addClass('h-100 w-100 text-center d-flex justify-content-center align-items-center');;
									return;
								}
								$('[members-assets]').data('id', r.id)
								new eagleBuilder({
									target: '#studentAssetView',
									action: "reader",
									tid: Microscope.tid,
									id: r.pid || r.id,
									with: data,
									addFeedbacks: true,
									uid: member.uid,
									topic: Microscope.session.topic
								});
							});
						} else {
							try {
								if (Microscope.tracker) {
									let data = {
										meta: Microscope.tracker.meta,
										tracks: Microscope.tracker.tracks,
										conclusion: Microscope.tracker.conclusion || {},
									};
									$('[members-assets]').data('id', Microscope.tracker.id)
									new eagleBuilder({
										target: '#studentAssetView',
										action: "reader",
										tid: Microscope.tid,
										with: data,
										tracking: true,
										control: false,
										id: r.pid || r.id,
										addFeedbacks: true,
										uid: member.uid,
										topic: Microscope.session.topic
									});
								}
							} catch (error) {
								console.log('Error while fetching Tracker:', error);
							}
						}
					}
				});

			})
			.catch((e) => {
				//
				console.log('Error while fetching Tracker:', e);
			});
		Microscope.initSearch();
	}
	Microscope._template = (part, data = {}) => {
		let components = {
			checkbox: () => {
				return `  <div class="form-group form-check col-6" student-checkbox data-fullname="${data.fullname}" data-displayname="${data.displayname}" data-username="${data.username}" data-uid="${data.uid}">		
								<input type="checkbox" class="form-check-input custom-sdlms-checkbox" name="student" value="${data.uid}" id="student-filter-${data.uid}-${data.index}">		
								<label class="form-check-label" for="student-filter-${data.uid}-${data.index}">${data.fullname || data.displayname || data.username}</label> 
						</div>`
			}
		}
		return components[part]();
	}
	Microscope.initSearch = () => {

		$('[search-student]').off('input').on('input', function () {
			let parent = $(this).parents('form').first().find('[data-target="search-student"]');
			let $searchelems = parent.find('[student-checkbox]');
			let query = $(this).val();
			let tid = Microscope.tid;
			let inQueue = $(this).data('inqueue') || false;
			let $this = $(this)
			query = $.trim(query);
			if (query) {
				$searchelems.hide();
				$searchelems.each(function (index, element) {
					let data = $(element).data();
					let k = 0;
					$.each(data, function (i, e) {
						if (e) {
							e = String(e)
						}
						if (e && e.toLowerCase().includes(query.toLowerCase())) {
							k++;
						}
					});
					if (k) {
						$(element).show()
					}
				});
				if (!inQueue && tid && !$searchelems.filter(':visible').length) {
					$(this).data('inqueue', true);
					require(['api'], function (api) {
						api.get(`/sdlms/${tid}/attendance`, {
							limit: 50,
							query: query,
							key: 'fullname'
						}).then(function (res) {
							if (res.data.length) {
								$.each(res.data, function (index, data) {
									if (Array.isArray(window.students) && window.students.indexOf(student.uid) === -1) window.students.push(data);
									if (!parent.find(`[student-checkbox][data-uid="${data.uid}"]`).length) {
										parent.append(Microscope._template('checkbox', data))
									}
								})
							}

						}).catch(function (err) {
							console.log(err);
						}).finally(function () {
							$this.data('inqueue', false);
						});
					});
				}
			} else {
				$searchelems.show();
			}
		});

		$('#reactionFilterForm').on('submit', function (e) {
			e.preventDefault();
			let $this = $(this);
			let students = [];
			let reactions = [];
			$this.find("[student-checkbox] input[name='student']:checkbox:checked").each(function () {
				students.push($(this).val());
			});
			$this.find("input[name='reaction']:checkbox:checked").each(function () {
				reactions.push($(this).val());
			});
			if (!students.length) return notify('Please select at least one student', 'error');
			if (!reactions.length) return notify('Please select at least one reaction', 'error');
			Microscope.charts.reactions.destroy();
			Microscope.DrawReactionGraph([...students], reactions);
			// $('#graphFilter').modal('hide');
			$('#graphFilter .close').first().trigger('click')
		});
		$('#threadFilterForm').on('submit', function (e) {
			e.preventDefault();
			let $this = $(this);
			let students = [];
			$this.find("[student-checkbox] input[name='student']:checkbox:checked").each(function () {
				students.push($(this).val());
			});

			if (!students.length) return notify('Please select at least one student', 'error');
			Microscope.charts.threads.destroy()
			Microscope.DrawThreadGraph(students);
			// $('#graphFilter').modal('hide');
			$('#graphFilter .close').first().trigger('click')
		});

	}
	Microscope.getAsset = (uid, type) => {
		if (type == 'tb') {
			api.get(`/sdlms/${Microscope.tid}/threadbuilder?uid=${uid}`, {}).then((r) => {
				let data = {
					threads: r.threads
				};
				if (!r.threads || !r.threads.length) {
					$('#studentAssetView').html('No Thread Builder found').addClass('h-100 w-100 text-center d-flex justify-content-center align-items-center');
					return;
				}
				$('[members-assets]').data('id', r.id)
				new threadBuilder({
					target: '#studentAssetView',
					action: "reader",
					tid: Microscope.tid,
					with: data,
					addFeedbacks: true,
					uid: uid,
					id: r.pid || r.id,
					topic: Microscope.session.topic
				});
			});
		} else if (type == 'eb') {
			api.get(`/sdlms/${Microscope.tid}/eaglebuilder?uid=${uid}`, {}).then((r) => {
				let data = {
					meta: r.meta,
					tracks: r.tracks,
					conclusion: r.conclusion || {},
				};
				if (!r.tracks || !r.tracks.length) {
					$('#studentAssetView').html('No Eagle Builder found').addClass('h-100 w-100 text-center d-flex justify-content-center align-items-center');;
					return;
				}
				$('[members-assets]').data('id', r.id)
				new eagleBuilder({
					target: '#studentAssetView',
					action: "reader",
					tid: Microscope.tid,
					with: data,
					addFeedbacks: true,
					uid: uid,
					id: r.pid || r.id,
					topic: Microscope.session.topic
				});
			});
		}
	};

	function getEventsByKey(key) {
		let timeStamps = {
			start: Date.now(),
			end: Date.now()
		};
		switch (key) {
		case 'introdution':
			timeStamps = {
				start: Microscope.session.schedule,
				end: Microscope.tracker.meta.completed
			}
			break;
		case 'conclusion':
			timeStamps = {
				start: Microscope.tracker.tracks[Microscope.tracker.tracks.length - 1].completed,
				end: Microscope.tracker.conclusion.completed
			}
			break;
		default:
			timeStamps = {
				start: key > 0 ? Microscope.tracker.tracks[key - 1].completed : Microscope.tracker.meta.completed,
				end: Microscope.tracker.tracks[key].completed
			}
			break;
		}
		let res = {};
		res = {
			label: isNaN(key) ? key : 'Thread ' + app.numberToAlphabates(key + 1),
			start: Number(timeStamps.start),
			end: Number(timeStamps.end)
		}
		return res;
	}

	Microscope.getTrackStats = () => {




		

		// Grouping by thread and getting the time spent in each thread
		let stats =[];
	
		

		if(!Microscope.tracker && Microscope.stats.length){
			Microscope.session.ended_on = (Microscope.session.ended_on >  Microscope.stats[Microscope.stats.length - 1].timestamp ? Microscope.session.ended_on: Microscope.stats[Microscope.stats.length - 1].timestamp);
			Microscope.session.schedule = (Microscope.stats[0].timestamp ? Microscope.stats[0].timestamp : Microscope.session.schedule);
			console.log(Microscope.session.ended_on, Microscope.session.schedule)
			const timeSlices = app.splitTimeIntoChunks(Microscope.session.schedule,Microscope.session.ended_on,5);
			timeSlices.unshift(new Date(Microscope.session.schedule))
			stats = timeSlices.map((timeSlice,index)=>{
				return {
					label: moment(new Date(timeSlice).getTime()).format('HH:mm') + ' - ' + moment(new Date(!timeSlices[index+1] ? Microscope.session.ended_on : timeSlices[index+1]).getTime()).format('HH:mm'),
					start: new Date(timeSlice).getTime(),
					end: new Date(!timeSlices[index+1] ? Microscope.session.ended_on : timeSlices[index+1]).getTime(),
				}
			});
			stats.length = stats.length - 1;
		}else{
			stats =[getEventsByKey('introdution'), ...Microscope.tracker.tracks.map((e, i) => {
				return getEventsByKey(i);
			}), getEventsByKey('conclusion')]
		};
		
		Microscope.statsGroup = stats;
		let data = {
			threads: {},
			reactions: {},
			count: {
				reactions: {}
			}
		};

		// Grouping by thread
		Microscope.stats.forEach((elem) => {
			let key = (stats.find(e => e.start <= elem.timestamp && e.end > elem.timestamp) || {}).label;
			if(key) data.threads[key] = (data.threads[key] ? [...data.threads[key], elem] : [elem]);
		});
		console.log(data.threads)
		// Grouping reaction by thread
		data.reactions = (Microscope.reactions.reactions || []).reduce(function (r, a) {
			r[a.rid] = r[a.rid] || [];
			r[a.rid].push(a);
			return r;
		}, {})

		
		// Counting reactions for each thread
		Microscope.reactions.reactions.forEach((elem) => {
			let key = (stats.find(e => e.start <= elem.timestamp && e.end > elem.timestamp) || {}).label || 'Thread';
			data.count.reactions[key] = data.count.reactions[key] ? [...data.count.reactions[key], elem] : [elem];
		});

		// Counting reactions for each thread
		for (var key in data.count.reactions) data.count.reactions[key] = data.count.reactions[key].length;

		// Sorting Reactions 
		data.count.reactions = Object.fromEntries(Object.entries(data.count.reactions).sort(([, a], [, b]) => b - a));


		Microscope.$container.find('[highest-reaction]').text(Object.keys(data.count.reactions)[0] || 'No Reactions');
		Microscope.$container.find('[lowest-reaction]').text(Object.keys(data.count.reactions)[Object.keys(data.count.reactions).length - 1] || 'No Reactions');

		// now we have stats for each track! Do not modify this Object Create New with this and Modify
		Microscope.threadStats = data.threads;
		Microscope.reactionStats = data.reactions;
		Microscope.DrawThreadGraph();
		Microscope.DrawReactionGraph(Microscope.most.reactions.map(({
			uid
		}) => uid), [1, 2, 3]);
	}
	Microscope.DrawThreadGraph = (uids = []) => {

		let data = {
			threads: [],
		}
		uids = uids.map(e => Number(e));
		console.log(uids);
		console.log(Microscope.threadStats);
		for (let key in Microscope.threadStats) {
			let count = Microscope.threadStats[key].reverse().filter(
				(elem => a =>
					(k => !elem[k] && (elem[k] = true))(a.uid + '|' + a.asset_type)
				)({})
			).filter((ele) => uids.length ? uids.indexOf(ele.uid) > -1 : !uids.length).reduce((a, b) => {
				return a + b.count.characters;
			}, 0);
			data.threads = [...data.threads, count]
		}

		data.threads = data.threads.map((v, i) => i  ? Math.abs(v - (data.threads[i - 1] || 0)) : v);

		let tracker = Microscope.$container.find('#trackerGraph')[0].getContext('2d');
		let labels = [];
		
		if (!Microscope.tracker) {
			labels = Microscope.statsGroup.map((e, i) => e.label);
		} else {
			labels = Microscope.tracker.tracks.map((e, i) => 'Thread ' + app.numberToAlphabates(i + 1));
			labels = ['Introduction', ...labels, 'Conclusion']
		};		
		Microscope.charts.threads = new Chart(tracker, {
			type: 'bar',
			data: {
				labels: labels,
				datasets: [{
					data: data.threads,
					backgroundColor: Microscope.colors[Math.floor(Math.random() * Microscope.colors.length)],
					label: ['Characters Count'],
				}]
			},
			options: {
				indexAxis: 'y',
				legend: {
					display: false
				}
			}
		});
		Microscope.$container.find('[highest-count]').text(labels[data.threads.indexOf(Math.max(...data.threads))]);
		Microscope.$container.find('[lowest-count]').text(labels[data.threads.indexOf(Math.min(...data.threads))]);
	}
	Microscope.DrawReactionGraph = (uids = [], rids = []) => {

		let data = {
			labels: [],
			students: [],
			sets: []
		}
		uids = uids.map(e => Number(e));
		rids = rids.map(e => Number(e));

		function getReaction(key) {
			let reaction = {
				label: '',
				icon: ''
			};
			switch ((isNaN(key) ? key : Number(key))) {
			case 1:
			case 'Hakuna Matata':
				reaction.label = 'Hakuna Matata',
					reaction.icon = 'https://sdlms.deepthought.education/assets/uploads/files/files/unamused.svg';
				break;
			case 2:
			case "Socrates' Glass":
				reaction.label = "Socrates' Glass",
					reaction.icon = 'https://sdlms.deepthought.education/assets/uploads/files/files/confused.svg';
				break;
			case 3:
			case 'Buddha\'s Ether':
				reaction.label = 'Buddha\'s Ether',
					reaction.icon = 'https://sdlms.deepthought.education/assets/uploads/files/files/buddha.svg';
				break;
			case 4:
			case 'Food of thought':
				reaction.label = 'Food of thought',
					reaction.icon = 'https://sdlms.deepthought.education/assets/uploads/files/files/food-of-thought.svg';
				break;
			case 5:
			case 'Eureka Moment':
				reaction.label = 'Eureka Moment',
					reaction.icon = 'https://sdlms.deepthought.education/assets/uploads/files/files/idea.svg';
				break;
			case 6:
			case 'Universal Principle':
				reaction.label = 'Universal Principle',
					reaction.icon = 'https://sdlms.deepthought.education/assets/uploads/files/files/atom.svg';
				break;

			default:
				break;
			}
			return reaction;
		}
		for (let key in Microscope.reactionStats) {
			if (rids.indexOf(Number(key)) > -1 || !rids.length) {
				uids.forEach((elem) => {
					key = String(key);
					let i = data.students.findIndex(e => e.x == elem);
					if (i > -1) data.students[i][key] = Microscope.reactionStats[key].filter(e => e.uid == elem).length;
					else data.students = [...data.students, {
						x: elem,
						[key]: Microscope.reactionStats[key].filter(e => e.uid == elem).length
					}];
				})
			}
		}
		data.labels = data.students.map(e => {
			let student = (window.students.find(elem => elem.uid == e.x) || {});
			return (student.fullname || student.displayname || student.username || student.userslug || student.uid || 'Unknown');
		});

		data.sets = (rids.length ? rids : Object.keys(Microscope.reactionStats)).map(e => {
			return {
				label: getReaction(e).label,
				key: e,
				data: data.students,
				backgroundColor: Microscope.colors[Math.floor(Math.random() * Microscope.colors.length)],
				parsing: {
					yAxisKey: String(e)
				}
			}
		})

		let reactions = Microscope.$container.find('#reactionGraph')[0].getContext('2d');
		var cfg = {
			type: 'bar',
			data: {
				labels: data.labels,
				datasets: data.sets
			},
			options: {
				plugins: {
					legend: {
						display: false
					},
				}
			}
		};
		Microscope.charts.reactions = new Chart(reactions, cfg);
		$('#custom_legend').empty();
		Microscope.charts.reactions.legend.legendItems.forEach((e, i) => {
			let reaction = getReaction(e.text);
			$('#custom_legend').append(`<div class="custom_legend_item"><span style="background:${e.fillStyle};"></span><img src="${reaction.icon}" alt="${reaction.label}"></div>`);
		})
		console.log(Microscope);
	}

	return Microscope
})
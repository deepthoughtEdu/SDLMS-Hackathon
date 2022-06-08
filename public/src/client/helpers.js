const debounce = (func, delay) => {
	let debounceTimer;
	return function () {
		const context = this;
		const args = arguments;
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => func.apply(context, args), delay);
	};
};
// Save dirrty instances
var singleDs = [];
let counterToast = 0;
(function ($) {
	function getSingleton(id) {
		var result;
		$(singleDs).each(function () {
			if ($(this)[0].id == id) {
				result = $(this)[0];
			}
		});
		return result;
	}

	function Dirrty(form, options) {
		this.form = form;
		this.isDirty = false;
		this.options = options;
		this.history = ['clean', 'clean']; // Keep track of last statuses
		this.id = $(form).attr('id');
		singleDs.push(this);
	}

	Dirrty.prototype = {
		init: function () {
			this.saveInitialValues();
			this.setEvents();
		},

		saveInitialValues: function () {
			this.form.find('input, select, textarea').each(function () {
				$(this).attr('data-dirrty-initial-value', $(this).val());
			});

			this.form
				.find('input[type=checkbox], input[type=radio]')
				.each(function () {
					if ($(this).is(':checked')) {
						$(this).attr('data-dirrty-initial-value', 'checked');
					} else {
						$(this).attr('data-dirrty-initial-value', 'unchecked');
					}
				});
		},

		setEvents: function () {
			var d = this;

			$(document).ready(function () {
				d.form.on('submit', function () {
					d.submitting = true;
				});

				d.form.on('make:dirty', function () {
					d.setDirty();
				});
				d.form.on('make:clean', function () {
					d.setClean();
				});
				if (d.options.preventLeaving) {
					$(window).on('beforeunload', function () {
						if (d.isDirty && !d.submitting) {
							return d.options.leavingMessage;
						}
					});
				}

				d.form.find('input, select').change(function () {
					d.checkValues();
				});

				d.form
					.find('input, textarea')
					.on('keyup input keydown blur', function () {
						d.checkValues();
					});

				// fronteend's icheck support
				d.form
					.find('input[type=radio], input[type=checkbox]')
					.on('ifChecked', function (event) {
						d.checkValues();
					});
			});
		},

		checkValues: function () {
			var d = this;
			this.form.find('input, select, textarea').each(function () {
				var initialValue = $(this).attr('data-dirrty-initial-value');
				if ($(this).val() != initialValue) {
					$(this).attr('data-is-dirrty', 'true');
				} else {
					$(this).attr('data-is-dirrty', 'false');
				}
			});
			this.form
				.find('input[type=checkbox], input[type=radio]')
				.each(function () {
					var initialValue = $(this).attr('data-dirrty-initial-value');
					if (
						($(this).is(':checked') && initialValue != 'checked') ||
						(!$(this).is(':checked') && initialValue == 'checked')
					) {
						$(this).attr('data-is-dirrty', 'true');
					} else {
						$(this).attr('data-is-dirrty', 'false');
					}
				});
			var isDirty = false;
			this.form.find('input, select, textarea').each(function () {
				if ($(this).attr('data-is-dirrty') == 'true') {
					isDirty = true;
				}
			});
			if (isDirty) {
				d.setDirty();
			} else {
				d.setClean();
			}

			d.fireEvents();
		},

		fireEvents: function () {
			if (this.isDirty && this.wasJustClean()) {
				this.form.trigger('dirty');
			}

			if (!this.isDirty && this.wasJustDirty()) {
				this.form.trigger('clean');
			}
		},

		setDirty: function () {
			this.isDirty = true;
			this.history[0] = this.history[1];
			this.history[1] = 'dirty';
		},

		setClean: function () {
			this.isDirty = false;
			this.history[0] = this.history[1];
			this.history[1] = 'clean';
		},

		// Lets me know if the previous status of the form was dirty
		wasJustDirty: function () {
			return this.history[0] == 'dirty';
		},

		// Lets me know if the previous status of the form was clean
		wasJustClean: function () {
			return this.history[0] == 'clean';
		},
	};

	$.fn.dirrty = function (options) {
		if (/^(isDirty)$/i.test(options) || /^(setClean)$/i.test(options)) {
			// Check if we have an instance of dirrty for this form
			var d = getSingleton($(this).attr('id'));

			if (!d) {
				var d = new Dirrty($(this), options);
				d.init();
			}
			switch (options) {
				case 'isDirty':
					return d.isDirty;
				case 'setClean':
					d.setClean();
					return true;
			}
		} else if (typeof options === 'object' || !options) {
			return this.each(function () {
				options = $.extend({}, $.fn.dirrty.defaults, options);
				var dirrty = new Dirrty($(this), options);
				dirrty.init();
			});
		}
	};

	$.fn.dirrty.defaults = {
		preventLeaving: true,
		leavingMessage: 'You have unsaved changes',
		onDirty: function () {}, // This function is fired when the form gets dirty
		onClean: function () {}, // This funciton is fired when the form gets clean again
	};
}(jQuery));
(function ($) {
	$.fn.DuplicateWindow = function () {
		var localStorageTimeout = 5 * 1000;
		var localStorageResetInterval = (1 / 2) * 1000;
		var localStorageTabKey = 'testCookie';
		var sessionStorageGuidKey = 'browser-tab-guid';
		var ItemType = {
			Session: 1,
			Local: 2,
		};

		function setCookie(name, value, days) {
			var expires = '';
			if (days) {
				var date = new Date();
				date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
				expires = '; expires=' + date.toUTCString();
			}
			if (location.protocol == 'https:') {
				document.cookie =
					name +
					'=' +
					(value || '') +
					';SameSite=Lax;secure' +
					expires +
					'; path=/';
			} else {
				document.cookie =
					name + '=' + (value || '') + ';SameSite=Lax;' + expires + '; path=/';
			}
		}

		function getCookie(name) {
			var nameEQ = name + '=';
			var ca = document.cookie.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') c = c.substring(1, c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
			}
			return null;
		}

		function GetItem(itemtype) {
			var val = '';
			switch (itemtype) {
				case ItemType.Session:
					val = window.name;
					break;
				case ItemType.Local:
					val = decodeURIComponent(getCookie(localStorageTabKey));
					if (val == undefined) val = '';
					break;
			}
			return val;
		}

		function SetItem(itemtype, val) {
			switch (itemtype) {
				case ItemType.Session:
					window.name = val;
					break;
				case ItemType.Local:
					setCookie(localStorageTabKey, val);
					break;
			}
		}

		function createGUID() {
			this.s4 = function () {
				return Math.floor((1 + Math.random()) * 0x10000)
					.toString(16)
					.substring(1);
			};
			return (
				this.s4() +
				this.s4() +
				'-' +
				this.s4() +
				'-' +
				this.s4() +
				'-' +
				this.s4() +
				'-' +
				this.s4() +
				this.s4() +
				this.s4()
			);
		}

		function TestIfDuplicate() {
			$(window).on('beforeunload', function () {
				if (TestIfDuplicate() == false) {
					SetItem(ItemType.Local, '');
				}
			});
			var sessionGuid = GetItem(ItemType.Session) || createGUID();
			SetItem(ItemType.Session, sessionGuid);

			var val = GetItem(ItemType.Local);
			var tabObj = (val == '' ? null : JSON.parse(val)) || null;

			// If no or stale tab object, our session is the winner.  If the guid matches, ours is still the winner
			if (
				tabObj === null ||
				tabObj.timestamp < new Date().getTime() - localStorageTimeout ||
				tabObj.guid === sessionGuid
			) {
				function setTabObj() {
					// console.log("In setTabObj");
					var newTabObj = {
						guid: sessionGuid,
						timestamp: new Date().getTime(),
					};
					SetItem(ItemType.Local, JSON.stringify(newTabObj));
				}
				setTabObj();
				setInterval(setTabObj, localStorageResetInterval);
				return false;
			}
			return true;
		}
		window.IsDuplicate = function () {
			var duplicate = TestIfDuplicate();
			return duplicate;
		};
	};
	$(window).DuplicateWindow();
}(jQuery));
(function ($, window, document, undefined) {
	var pluginName = 'editable';
	var defaults = {
		keyboard: true,
		dblclick: true,
		button: true,
		buttonSelector: '.edit',
		maintainWidth: true,
		dropdowns: {},
		edit: function () {},
		save: function () {},
		cancel: function () {},
	};

	function editable(element, options) {
		this.element = element;
		this.options = $.extend({}, defaults, options);

		this._defaults = defaults;
		this._name = pluginName;

		this.init();
	}

	editable.prototype = {
		init: function () {
			this.editing = false;

			if (this.options.dblclick) {
				$(this.element)
					.css('cursor', 'pointer')
					.bind('dblclick', this.toggle.bind(this));
			}

			if (this.options.button) {
				$(this.options.buttonSelector, this.element).bind(
					'click',
					this.toggle.bind(this)
				);
			}
		},

		toggle: function (e) {
			e.preventDefault();

			this.editing = !this.editing;

			if (this.editing) {
				this.edit();
			} else {
				this.save();
			}
		},

		edit: function () {
			var instance = this;
			var values = {};

			$('td[data-field]', this.element).each(function () {
				var input;
				var field = $(this).data('field');
				var value = $(this).data('value') ?
					$(this).data('value') :
					$(this).text();
				var width = $(this).width();

				values[field] = value;

				$(this).empty();

				if (instance.options.maintainWidth) {
					$(this).width(width);
				}

				if (field in instance.options.dropdowns) {
					input = $(
						'<select class="form-control" required name=' + field + '></select>'
					);

					for (var i = 0; i < instance.options.dropdowns[field].length; i++) {
						$('<option></option>')
							.text(instance.options.dropdowns[field][i].text)
							.attr('value', instance.options.dropdowns[field][i].id)
							.appendTo(input);
					}

					input
						.val(value)
						.data('old-value', value)
						.dblclick(instance._captureEvent);
				} else {
					input = $(
						'<input class="form-control" required name=' +
							field +
							' type="' +
							(field == 'schedule' ? 'datetime-local' : 'text') +
							'" />'
					)
						.val(value)
						.data('old-value', value)
						.dblclick(instance._captureEvent);
				}

				input.appendTo(this);

				if (instance.options.keyboard) {
					input.keydown(instance._captureKey.bind(instance));
				}
			});

			this.options.edit.bind(this.element)(values);
		},

		save: function () {
			var instance = this;
			var values = {};
			const error = [];
			$('td[data-field]', this.element).each(function () {
				var value = $(':input', this).val();
				if ($(':input', this).prop('required') && !value) {
					error.push($(this).data('field'));
					return;
				}
				values[$(this).data('field')] = value;
				if ($(':input', this)[0].nodeName == 'SELECT') {
					value = $(':input', this).find('option:selected').text();
				}
				if ($(':input', this).attr('type') == 'datetime-local') {
					value = moment($(':input', this).val()).format(
						'ddd, DD MMM, YYYY hh:mm A'
					);
				}
				console.log(value);
				$(this).empty().text(value);
			});
			if (error.length) {
				notify(
					'Please fill out the required fields: ' + error.join(', '),
					'error',
					5000
				);
				return;
			}
			this.options.save.bind(this.element)(values);
		},

		cancel: function () {
			var instance = this;
			var values = {};

			$('td[data-field]', this.element).each(function () {
				var value = $(':input', this).data('old-value');

				values[$(this).data('field')] = value;
				if ($(':input', this)[0].nodeName == 'SELECT') {
					value = $(':input', this).find('option:selected').text();
				}
				if ($(':input', this).attr('type') == 'datetime-local') {
					value = moment($(':input', this)).format('ddd, DD MMM, YYYY hh:mm A');
				}
				$(this).empty().text(value);
			});

			this.options.cancel.bind(this.element)(values);
		},

		_captureEvent: function (e) {
			e.stopPropagation();
		},

		_captureKey: function (e) {
			if (e.which === 13) {
				this.editing = false;
				this.save();
			} else if (e.which === 27) {
				this.editing = false;
				this.cancel();
			}
		},
	};

})(jQuery);

var LB = 1, //Left Bottom
	LT = 2, //Left Top
	RT = 3, //Right Top
	RB = 4, //Right Bottom
	HR = 1, //Horizontal		
	VR = 2, //Vertical
	WordObjType = 'span',
	DIV = 'div',
	Word_Default_font_Family = 'Impact',
	distance_Counter = 1,
	word_counter = 1;

function Util() {}
// To Generate Random Colors For Words
Util.getRandomColor = function () {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.round(Math.random() * 15)];
	}
	return color;
};

function space(spaceType, width, height, x, y) {
	this.spaceType = spaceType;
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
}

function Word(wordConfig) {
	this.word = wordConfig.word;
	this.weight = wordConfig.weight;

	this.fontFactor = wordConfig.fontFactor;
	this.fontOffset = wordConfig.fontOffset;
	this.minWeight = wordConfig.minWeight;
	this.padding_left = wordConfig.padding_left;

	this.font_family = wordConfig.font_family;
	this.font = null;
	this.color = wordConfig.color;
	this.span = null;
	this.width = null;
	this.height = null;
	this.word_class = wordConfig.word_class;

	this._init();
}
Word.prototype = {
	_init: function () {
		this._setFont();
		this._setSpan_Size();
	},
	_setFont: function () {
		this.font = Math.floor(((this.weight - this.minWeight) * this.fontFactor) + this.fontOffset);
	},
	_setSpan_Size: function () {
		var span = document.createElement(WordObjType);
		span.setAttribute('id', 'Word_' + (word_counter++) + '_' + this.weight);
		document.body.appendChild(span);
		$(span).css({
			position: 'absolute',
			display: 'block',
			left: -999990,
			top: 0,
		});
		$(span).css('font-size', this.font + 'px');

		if (this.font_family != null && this.font_family != '') $(span).css('font-family', this.font_family);
		else $(span).css('font-family', Word_Default_font_Family);


		if (this.word_class != null && this.word_class != '') $(span).addClass(this.word_class);

		if (this.color != null && this.color != '') $(span).css('color', this.color);
		else $(span).css('color', Util.getRandomColor());

		$(span).css('-webkit-user-select', 'none').css('-moz-user-select', 'none').css('-ms-user-select', 'none');
		$(span).css('user-select', 'none').css('-o-user-select', 'none');
		$(span).css('line-height', this.font + 'px');
		if (this.padding_left == null) this.padding_left = 0;

		$(span).css('padding-left', this.padding_left + 'px');
		$(span).html(this.word);

		this.width = $(span).outerWidth() + (this.padding_left * 2);
		this.height = $(span).outerHeight();

		$(span).remove();
		this.span = span;
	},
};


function WordCloud() {
	this.defaultOptions = {
		title: 'JQ WOrd Cloud',
		words: [],
		minFont: 10,
		maxFont: 30,
		fontOffset: 0,
		showSpaceDIV: false,
		verticalEnabled: true,
		cloud_color: null,
		cloud_font_family: null,
		spaceDIVColor: 'white',
		padding_left: null,
		word_common_classes: null,
		word_click: function () {},
		word_mouseOver: function () {},
		word_mouseEnter: function () {},
		word_mouseOut: function () {},
		beforeCloudRender: function () {},
		afterCloudRender: function () {},
	};
	this.minWeight = null;
	this.maxWeight = null;

	this.spaceDataObject = null;
	this.spaceIdArray = null;
	this.words = null;
	this.fontFactor = 1,

	this.methods = {
		destroy: this._destroy,
	};
}

WordCloud.prototype = {
	_init: function (options) {
		// Calling Methods from this.Methods{}
		if (options != null && typeof options === 'string') {
			if (this.methods[options] != null) return this.methods[options].apply();
			return null;
		}

		if (options == null) this.options = this.defaultOptions;
		else if (options != null && typeof options === 'object') this.options = $.extend(this.defaultOptions, options);

		this.spaceDataObject = {};
		this.spaceIdArray = [];

		this.words = this.options.words;
		// Sorting Words according weight descending order
		this.words.sort(function (a, b) {
			if (a.weight < b.weight) {
				return 1;
			} else if (a.weight > b.weight) {
				return -1;
			}
			return 0;
		});

		this.options.beforeCloudRender();
		this._start();
		this.options.afterCloudRender();
		this._final();
	},
	_setFontFactor: function () {
		this.maxWeight = this.words[0].weight;
		this.minWeight = this.words[this.words.length - 1].weight;
		this.fontFactor = (this.options.maxFont - this.options.minFont) / (this.maxWeight - this.minWeight);
	},
	_start: function () {
		this._destroy();
		this._setFontFactor();
		this._draw();
	},
	_final: function () {},
	_destroy: function () {
		this.$target.html('');
	},
	_setTarget: function ($target) {
		this.$target = $target;
		$target.css('position', 'relative');
		this.tWidth = $target.innerWidth();
		this.xOffset = this.tWidth / 2;

		this.tHeight = $target.innerHeight();
		this.yOffset = this.tHeight / 2;
	},
	_draw: function () {
		for (var index = 0; index < this.words.length; index++) {
			var currWord = this.words[index];
			var wordConfigObj = {};
			wordConfigObj.word = currWord.word;
			wordConfigObj.weight = currWord.weight;

			if (this.options.cloud_color != null) wordConfigObj.color = this.options.cloud_color;
			else wordConfigObj.color = currWord.color;

			if (this.options.padding_left != null) wordConfigObj.padding_left = this.options.padding_left;

			wordConfigObj.word_class = currWord.word_class;

			if (this.options.cloud_font_family != null) wordConfigObj.font_family = this.options.cloud_font_family;
			else wordConfigObj.font_family = currWord.font_family;

			wordConfigObj.fontFactor = this.fontFactor;
			wordConfigObj.fontOffset = (this.options.fontOffset + this.options.minFont);
			wordConfigObj.minWeight = this.minWeight;


			var wordObj = new Word(wordConfigObj);

			if (this.options.word_common_classes != null) $(wordObj.span).addClass(this.options.word_common_classes);

			$(wordObj.span).on('click', this.options.word_click);
			$(wordObj.span).on('mouseover', this.options.word_mouseOver);
			$(wordObj.span).on('mouseout', this.options.word_mouseOut);
			$(wordObj.span).on('mouseenter', this.options.word_mouseEnter);

			if (index == 0) this._placeFirstWord(wordObj);
			else this._placeOtherWord(wordObj);
		}
	},

	_updateSpaceIdArray: function (distanceS, distance) {
		if (this.spaceIdArray.length != 0) {
			for (var index = 0; index < this.spaceIdArray.length; index++) {
				if (distance < parseFloat(this.spaceIdArray[index].split('_')[0])) {
					this.spaceIdArray.splice(index, 0, distanceS);
					return;
				}
			}
			this.spaceIdArray.push(distanceS);
		} else this.spaceIdArray.push(distanceS);
	},
	_showSpaceDiv: function (type, w, h, x, y) {
		var xMul = 1;
		var yMul = 1;

		switch (type) {
			case LB:
				xMul = 0;
				yMul = -1;
				break;
			case LT:
				xMul = 0;
				yMul = 0;
				break;
			case RT:
				xMul = -1;
				yMul = 0;
				break;
			case RB:
				xMul = -1;
				yMul = -1;
				break;
		}

		var div = document.createElement(DIV);
		$(div).css('left', x + xMul * w).css('top', y + yMul * h).css('width', w)
			.css('height', h)
			.css('border', '1px ' + this.options.spaceDIVColor + ' solid')
			.css('position', 'absolute')
			.css('display', 'block');
		this.$target.append(div);
	},
	_pushSpaceData: function (type, w, h, x, y) {
		// Calculating Distance between (x,y): Key point of Space and and Center of Container (this.xOffset,this.yOffset)
		var distance = Math.sqrt((this.xOffset - x) * (this.xOffset - x) + (this.yOffset - y) * (this.yOffset - y));
		var distanceS = distance + '_' + (distance_Counter++);

		// Update Space Id Array
		this._updateSpaceIdArray(distanceS, distance);
		// Add Space into Space Data Object
		this.spaceDataObject[distanceS] = new space(type, w, h, x, y);

		// To Show The Space
		if (this.options.showSpaceDIV) {
			this._showSpaceDiv(type, w, h, x, y);
		}
	},
	_placeFirstWord: function (word) {
		var w = word.width;
		var h = word.height;
		var xoff = this.xOffset - w / 2;
		var yoff = this.yOffset - h / 2;
		var tw = this.tWidth;
		var th = this.tHeight;

		var span = word.span;
		$(span).css('left', xoff).css('top', yoff).css('display', 'inline');
		this.$target.append(span);

		this._pushSpaceData(LB, tw - xoff - w, h, xoff + w, yoff + h / 2); // M1
		this._pushSpaceData(LT, w, th - yoff - h, xoff + w / 2, yoff + h); // M2
		this._pushSpaceData(RT, xoff, h, xoff, yoff + h / 2); // M3
		this._pushSpaceData(RB, w, yoff, xoff + w / 2, yoff); // M4

		this._pushSpaceData(LT, w / 2, h / 2, xoff + w, yoff + h / 2); // C1
		this._pushSpaceData(RT, w / 2, h / 2, xoff + w / 2, yoff + h); // C2
		this._pushSpaceData(RB, w / 2, h / 2, xoff, yoff + h / 2); // C3
		this._pushSpaceData(LB, w / 2, h / 2, xoff + w / 2, yoff); // C4

		this._pushSpaceData(LT, tw - xoff - w - w / 2, th - yoff - h / 2, xoff + w + w / 2, yoff + h / 2); // S1
		this._pushSpaceData(RT, xoff + w / 2, th - yoff - h - h / 2, xoff + w / 2, yoff + h + h / 2); // S2
		this._pushSpaceData(RB, xoff - w / 2, yoff + h / 2, xoff - w / 2, yoff + h / 2); // S3
		this._pushSpaceData(LB, xoff + w / 2, yoff - h / 2, xoff + w / 2, yoff - h / 2); // S4
	},

	_placeOtherWord: function (word) {
		for (var index = 0; index < this.spaceIdArray.length; index++) {
			var spaceId = this.spaceIdArray[index];
			var obj = this.spaceDataObject[spaceId];

			var alignmentInd = 0;
			var alignmentIndCount = 0;


			if (word.width <= obj.width && word.height <= obj.height) {
				alignmentInd = HR;
				alignmentIndCount++;
			}

			if (this.options.verticalEnabled) {
				if (word.height <= obj.width && word.width <= obj.height) {
					alignmentInd = VR;
					alignmentIndCount++;
				}
			}
			if (alignmentIndCount > 0) {
				this.spaceDataObject[spaceId] = null;
				this.spaceIdArray.splice(index, 1);


				// For Word's Span Position
				var xMul = 1;
				var yMul = 1;

				// For new Child Spaces
				var xMulS = 1;
				var yMulS = 1;

				switch (obj.spaceType) {
					case LB:
						xMul = 0;
						yMul = -1;
						xMulS = 1;
						yMulS = -1;
						break;
					case LT:
						xMul = 0;
						yMul = 0;
						xMulS = 1;
						yMulS = 1;
						break;
					case RT:
						xMul = -1;
						yMul = 0;
						xMulS = -1;
						yMulS = 1;
						break;
					case RB:
						xMul = -1;
						yMul = -1;
						xMulS = -1;
						yMulS = -1;
						break;
				}

				if (alignmentIndCount > 1) {
					if (Math.random() * 5 > 3) alignmentInd = VR;
					else alignmentInd = HR;
				}

				var w = word.width;
				var h = word.height;

				switch (alignmentInd) {
					case HR:
						var span = word.span;
						$(span).css('left', obj.x + xMul * w).css('top', obj.y + yMul * h).css('display', 'inline');
						this.$target.append(span);

						if (Math.random() * 2 > 1) {
							this._pushSpaceData(obj.spaceType, obj.width - w, h, obj.x + xMulS * w, obj.y); // R
							this._pushSpaceData(obj.spaceType, obj.width, obj.height - h, obj.x, obj.y + yMulS * h); // T
						} else {
							this._pushSpaceData(obj.spaceType, obj.width - w, obj.height, obj.x + xMulS * w, obj.y); // R
							this._pushSpaceData(obj.spaceType, w, obj.height - h, obj.x, obj.y + yMulS * h); // T
						}
						break;

					case VR:
						var span = word.span;

						$(span).css('left', obj.x + xMul * h - (w - h) / 2).css('top', obj.y + yMul * w + (w - h) / 2);


						$(span).css('display', 'block').css('-webkit-transform', 'rotate(270deg)').css('-moz-transform', 'rotate(270deg)');
						$(span).css('-o-transform', 'rotate(270deg)').css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=3)');
						this.$target.append(span);

						if (Math.random() * 2 > 1) {
							this._pushSpaceData(obj.spaceType, obj.width - h, w, obj.x + xMulS * h, obj.y); // R
							this._pushSpaceData(obj.spaceType, obj.width, obj.height - w, obj.x, obj.y + yMulS * w); // T
						} else {
							this._pushSpaceData(obj.spaceType, obj.width - h, obj.height, obj.x + xMulS * h, obj.y); // R
							this._pushSpaceData(obj.spaceType, h, obj.height - w, obj.x, obj.y + yMulS * w); // T
						}
						break;
				}

				return;
			}
		}
	},

};

(function ($) {
	$.fn.jQWCloud = function (options) {
		var wc = new WordCloud();
		wc._setTarget($(this));
		wc._init(options);
	};
}(jQuery));








$('._toast__close').click(function (e) {
	var parent = $(this).parent('._toast');
	parent.css(
		{
			transform: 'skewX(-10deg)',
		},
		'slow'
	);
	parent.animate(
		{
			left: '-40px',
		},
		'fast'
	);
	parent.animate(
		{
			left: '2300px',
		},
		'slow',
		function () {
			$(this).remove();
		}
	);
});
$('body').append(
	`<div class="_toast__container"><div class="_toast__cell"></div></div>`
);

function notify(message, status, timeout = 3000) {
	let colorClass;
	let icon;
	if (status == 'success') {
		colorClass = '_toast--green';
		icon =
			'<svg version="1.1" class="_toast__svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g><g><path d="M504.502,75.496c-9.997-9.998-26.205-9.998-36.204,0L161.594,382.203L43.702,264.311c-9.997-9.998-26.205-9.997-36.204,0    c-9.998,9.997-9.998,26.205,0,36.203l135.994,135.992c9.994,9.997,26.214,9.99,36.204,0L504.502,111.7    C514.5,101.703,514.499,85.494,504.502,75.496z"></path></g></g></svg>';
	} else if (status == 'error') {
		colorClass = '_toast--error';
		icon =
			'<svg version="1.1" class="_toast__svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve"><g><g id="info"><g><path  d="M10,16c1.105,0,2,0.895,2,2v8c0,1.105-0.895,2-2,2H8v4h16v-4h-1.992c-1.102,0-2-0.895-2-2L20,12H8     v4H10z"></path><circle  cx="16" cy="4" r="4"></circle></g></g></svg>';
	} else {
		colorClass = '_toast--blue';
		icon =
			'<svg version="1.1" class="_toast__svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 301.691 301.691" style="enable-background:new 0 0 301.691 301.691;" xml:space="preserve"><g><polygon points="119.151,0 129.6,218.406 172.06,218.406 182.54,0  "></polygon><rect x="130.563" y="261.168" width="40.525" height="40.523"></rect></g></svg>';
	}
	const addedToast = '_toast' + counterToast;
	const notificate =
		'<div id=' +
		addedToast +
		' class="_toast ' +
		colorClass +
		' add-margin"><div class="_toast__icon">' +
		icon +
		'</div><div class="_toast__content"><p class="_toast__message">' +
		message +
		'</p></div><div class="_toast__close"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.642 15.642" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 15.642 15.642"><path fill-rule="evenodd" d="M8.882,7.821l6.541-6.541c0.293-0.293,0.293-0.768,0-1.061  c-0.293-0.293-0.768-0.293-1.061,0L7.821,6.76L1.28,0.22c-0.293-0.293-0.768-0.293-1.061,0c-0.293,0.293-0.293,0.768,0,1.061  l6.541,6.541L0.22,14.362c-0.293,0.293-0.293,0.768,0,1.061c0.147,0.146,0.338,0.22,0.53,0.22s0.384-0.073,0.53-0.22l6.541-6.541  l6.541,6.541c0.147,0.146,0.338,0.22,0.53,0.22c0.192,0,0.384-0.073,0.53-0.22c0.293-0.293,0.293-0.768,0-1.061L8.882,7.821z"></path></svg></div></div>';
	$('._toast__cell').append(notificate);
	const selectedToast = '#' + addedToast;
	$(selectedToast).show();
	$(selectedToast).animate(
		{
			left: '-40px',
		},
		'slow',
		'swing',
		function () {
			$(selectedToast).css({
				transform: 'skewX(10deg)',
			});
		}
	);
	$(selectedToast).animate(
		{
			left: '0px',
		},
		'fast',
		'swing',
		function () {
			$(selectedToast).css({
				transform: 'skewX(0deg)',
			});
		}
	);
	setTimeout(function () {
		$(selectedToast).css(
			{
				transform: 'skewX(-10deg)',
			},
			'slow'
		);
		$(selectedToast).animate(
			{
				left: '-30px',
			},
			'fast'
		);
		$(selectedToast).animate(
			{
				left: '2300px',
			},
			'slow',
			function () {
				$(this).fadeOut(1000, function () {
					$(this).remove();
				});
			}
		);
	}, timeout);
	counterToast++;
}
$('._toast__cell').delegate('._toast__close', 'click', function () {
	var parent = $(this).parent('._toast');
	parent.css(
		{
			transform: 'skewX(-10deg)',
		},
		'slow'
	);
	parent.animate(
		{
			left: '-40px',
		},
		'fast'
	);
	parent.animate(
		{
			left: '2300px',
		},
		'slow',
		function () {
			$(this).fadeOut(1000, function () {
				$(this).remove();
			});
		}
	);
});

function selectImage(elemId) {
	var elem = document.getElementById(elemId);
	if (elem && document.createEvent) {
		var evt = document.createEvent('MouseEvents');
		evt.initEvent('click', true, false);
		elem.dispatchEvent(evt);
		console.log(selectImage);
	}
}

function randomGenerator(low, high) {
	if (arguments.length < 2) {
		high = low;
		low = 0;
	}
	this.low = low;
	this.high = high;
	this.reset();
}

randomGenerator.prototype = {
	reset: function () {
		this.remaining = [];
		for (var i = this.low; i <= this.high; i++) {
			this.remaining.push(i);
		}
	},
	get: function () {
		if (!this.remaining.length) {
			this.reset();
		}
		var index = Math.floor(Math.random() * this.remaining.length);
		var val = this.remaining[index];
		this.remaining.splice(index, 1);
		return val;
	},
};

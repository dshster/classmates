/* К сожалению я пока плохо знаю современные js-фреймворки (angularjs, backbone), поэтому делаю на jquery */

(function($, moment){
	'use strict';

	// по условию задачи я немного не понял почему
	// можно выбирать только одну дату и один ресторан?
	// допустим, у нас есть выбор рестранов и мы выбираем тот,
	// который нам нравится указывая цену на человека

	// но зачем показывать несколько блоков с датами
	// и давать возможность выбрать только одну?
	// более логично дать на выбор несколько дат (те же 3)
	// с возможностью изменить их
	// или же просто показывать одну дату

	// надо было откуда-то брать иконки с именами
	var getMembersUrl = '//api.vk.com/method/groups.getMembers',
	    group_id = 'yo_photo',
	    countUsers = 50,
	    offsetUsers = 0;

	// список ресторанов может загружаться из json, например
	var restaurants = [
		{	'name'      : 'Эларджи',
			'url'       : '#',
			'table'     : 'Грузинская кухня',
			'min_price' : 1000 },
		{	'name'      : 'Оливковый пляж',
			'url'       : '#',
			'table'     : 'Европейская кухня',
			'min_price' : 1000 },
		{	'name'      : 'Dandy Cafe',
			'url'       : '#',
			'table'     : 'Европейская кухня',
			'min_price' : 1000 },
	];

	// вероятно это тоже бралось бы из json
	var calendars = {
		amount : 3,
		time   : '19:00',
		now    : moment()
	};

	var calendarsModel = {
		// можно было бы объединить функционал календарей и ресторанов,
		// но _завтра_ придёт заказчик или менеджер проектов
		// и скажет поменять оформление одного из этих блоков
		// поэтому я _за_ разделение оформления и функционала
		// логически различных блоков, даже если их функционал в чем-то схож
		classes: {
			'face'     : 'calendar__face',
			'label'    : 'calendar__label',
			'date'     : 'calendar__date',
			'day'      : 'calendar__day',
			'time'     : 'calendar__time',
			'radio'    : 'calendar__radio',
			'change'   : 'button button_change',
			'calendar' : 'calendar__container'
		},

		calendar: {
			lang: 'ru',
			sundayFirst: false,
			years: 1,
			format: 'DD.MM.YYYY'
		},

		init: function() {
			var $result = this;

			$result.append(calendarsModel.buildCalendarList.apply(calendars));
		},

		templateCalendar: function() {
			var day = moment().add('d', this);

			var $template = {
				label: $('<label>', { 'class': calendarsModel.classes.label }),
				face: $('<div>', { 'class': calendarsModel.classes.face }),
				date: $('<div>', { 'class': calendarsModel.classes.date }).text(day.format('D MMMM')).data('currentdate', day.format(calendarsModel.calendar.format)),
				day: $('<span>', { 'class': calendarsModel.classes.day }).text(day.format('dddd')),
				time: $('<span>', { 'class': calendarsModel.classes.time }).text(calendars.time),
				radio: $('<input>', { 'class': calendarsModel.classes.radio, 'type': 'radio', 'name': 'calendars' }),
				change: $('<button>', { 'class': calendarsModel.classes.change, 'type': 'button' }).text('Изменить'),
				calendar: $('<div>', { 'class': calendarsModel.classes.calendar })
			};

			calendarsModel.setCalendarAction.apply($template);

			return $template.label.append(
				$template.radio,
				$template.face.append(
					$template.date, $template.day, $template.time, $template.change
				)
			);
		},

		buildCalendarList: function() {
			var list = [],
			    parameters = this;

			for (var day = 0; day < parameters.amount; day++) {
				list.push(calendarsModel.templateCalendar.apply(day));
			}
			return list;
		},

		setCalendarAction: function() {
			var $template = this;

			$template.change
				.on('click', function(event) {
					var $calendar = $template.calendar.appendTo($template.face);

					$calendar.on('click', function(event) {
						event.stopPropagation();
					});

					$(window).on('click', function() {
						$calendar.remove();
						$(window).off('click');
					});

					calendarsModel.calendar.startDate = $template.date.data('currentdate');
					calendarsModel.calendar.onClick = function(date) {
						var momentdate = moment(date, calendarsModel.calendar.format);

						if (true === momentdate.isValid()) {
							$template.date
								.data('currentdate', date)
								.text(momentdate.format('D MMMM'));

							$template.day.text(momentdate.format('dddd'));
						}
						$calendar.remove();
						$(window).off('click');
					};

					$calendar.ionCalendar(calendarsModel.calendar);
					event.preventDefault();
					// предотвратить window click
					event.stopPropagation();
				});
		}
	};

	var restaurantsModel = {
		classes: {
			'face'    : 'restaurant__face',
			'label'   : 'restaurant__label',
			'title'   : 'link restaurant__title',
			'table'   : 'restaurant__table',
			'price'   : 'restaurant__price',
			'unit'    : 'restaurant__unit',
			'radio'   : 'restaurant__radio',
			'change'  : 'button button_change'
		},

		init: function() {
			var $result = this;

			$result.append(restaurantsModel.buildRestaurantList.apply(restaurants));
		},

		templateRestaurant: function() {
			var data = this;

			var $template = {
				label: $('<label>', { 'class': restaurantsModel.classes.label }),
				face: $('<div>', { 'class': restaurantsModel.classes.face }),
				// Возможно с заголовка могла бы быть ссылка на описание ресторана
				// title: $('<a>', { 'class': restaurantsModel.classes.title, 'href': data.url }).text(data.name),
				title: $('<span>', { 'class': restaurantsModel.classes.title }).text(data.name),
				table: $('<div>', { 'class': restaurantsModel.classes.table }).text(data.table),
				price: $('<div>', { 'class': restaurantsModel.classes.price }).text(data.min_price),
				unit: $('<div>', { 'class': restaurantsModel.classes.unit }).text('на человека'),
				radio: $('<input>', { 'class': restaurantsModel.classes.radio, 'type': 'radio', 'name': 'restaurants' }),
				change: $('<button>', { 'class': restaurantsModel.classes.change, 'type': 'button' }).text('Изменить')
			};

			restaurantsModel.setRestaurantAction.apply($template);

			return $template.label.append(
				$template.radio,
				$template.face.append(
					$template.title, $template.table, $template.price, $template.unit, $template.change
				)
			);
		},

		buildRestaurantList: function() {
			var list = [],
			    itemsList = this;

			for (var restaurant in itemsList) {
				list.push(restaurantsModel.templateRestaurant.apply(itemsList[restaurant]));
			}
			return list;
		},

		setRestaurantAction: function() {
			var $template = this;

			$template.change
				.on('click', function(event) {
					editinplace.init.apply($template.price, [this]);
					event.preventDefault();
				});
		},
	};

	var usersModel = {
		classes: {
			'face'    : 'classmates__item',
			'icon'    : 'classmates__icon',
			'label'   : 'classmates__label',
			'caption' : 'classmates__caption',

			'result'  : 'classmates__result',

			// modifier
			'active'  : '_active',
			'focus'   : '_focus',
			'hover'   : '_hover',
			'error'   : '_error',
			'loading' : '_loading'
		},

		init: function() {
			var $result = this;

			$result.addClass(usersModel.classes.result + usersModel.classes.loading);

			usersModel.getUsersList.apply(function() {
				var result = this;

				if (result.error) {
					$result.text(result.error.error_msg).addClass(usersModel.classes.result + usersModel.classes.error);
				} else {
					if (result.response) {
						$result
							.append(usersModel.buildUsersList.apply(result.response.items))
							.removeClass(usersModel.classes.result + usersModel.classes.loading);
					}
				}
			});
		},

		templateUser: function() {
			var data = this,
			    title = data.first_name + ' ' + data.last_name;

			var $template = {
				face: $('<a>', { 'class': usersModel.classes.face, 'title': title }).data('id', data.id),
				icon: $('<img>', { 'class': usersModel.classes.icon, 'src': data.photo_50 }),
				label: $('<span>', { 'class': usersModel.classes.label }),
				caption: $('<span>', { 'class': usersModel.classes.caption }).text(title)
			};

			usersModel.setUserActions.apply($template);

			return $template.face.append(
				$template.icon, $template.label.append(
					$template.caption
				)
			);
		},

		buildUsersList: function() {
			var list = [],
			    itemsList = this;

			for (var user in itemsList) {
				list.push(usersModel.templateUser.apply(itemsList[user]));
			}
			return list;
		},

		setUserActions: function() {
			var $template = this;

			$template.face
				.on('click', function(event) {
					$(this).toggleClass(usersModel.classes.face + usersModel.classes.active);
					event.preventDefault();
				});

			$template.face
				.on('mouseenter touchenter', function() {
					$(this).addClass(usersModel.classes.face + usersModel.classes.hover);
				});

			$template.face
				.on('mouseleave touchleave', function() {
					$(this).removeClass(usersModel.classes.face + usersModel.classes.hover);
				});
		},

		getUsersList: function() {
			var callback = this;

			$.ajax({
				url: getMembersUrl,
				data: {
					group_id: group_id,
					offset: offsetUsers * countUsers,
					fields: 'photo_50',
					count: countUsers,
					v: 5.11
				}
			}).done(function(data) {
				callback.apply(data);
			});
		},
	};

	var editinplace = {
		wait: null,

		init: function(change) {
			var $element = this,
			    $change = $(change),
			    $wrapper = $('<div>', { 'class': 'editinplace__wrapper'} ),
			    $input = $('<input>', {
						'class': 'editinplace__input',
						'type': 'text',
						'pattern': '[0-9]{4,5}',
						'placeholder': 'желаемая цена',
						'title': 'Без единицы измерения'
			    });

			$element.wrap($wrapper);
			$element.hide().parent().append($input);
			$input.focus();

			$input.on('blur', function() {
				// таймаут для корректной обработки blur
				// перед нажатием на кнопку 'Изменить'
				editinplace.wait = setTimeout(function() {
					$change.trigger('click', false);
				}, 120);
			});

			$input.on('keydown', function(event) {
				if (13 === event.keyCode) {
					// Enter
					$change.trigger('click', true);
				} else if (27 === event.keyCode) {
					// Esc
					$change.trigger('click', false);
				} else {
				}
			});

			// этот метод помечен в jquery как deprecated,
			// пока не нашел как правильно сохранить event
			if ('undefined' !== typeof $._data(change, 'events').click) {
				var click_event = $._data(change, 'events').click[0].handler;

				$change.off('click');
				$change.on('click', function(event, flag) {
					editinplace.submit.apply($element, [$input, (false === flag) ? false : true]);

					$change.off('click');
					$change.on('click', click_event);
				});
			}
		},

		submit: function(input, flag) {
			var $element = $(this),
			     price = input.val();

			if (true === flag) {
				$element.text(editinplace.validate.apply(price) || $element.text());
			}

			if (true === $element.parent().hasClass('editinplace__wrapper')) {
				$element.parent().replaceWith($element);
				clearTimeout(editinplace.wait);
			}

			$element.show();
			$(input).remove();
		},

		validate: function() {
			return $.trim(this.replace(/[^\0-9]/ig, ''));
		},
	};


	$(function() {
		// dom init
		var $classmatesList = $('.classmates-list'),
		    $classmatesResult = $('.classmates__result'),
		    $moreUsersLink = $('<a>', {'class': 'link link_local classmates__more'}).text('Показать еще ' + countUsers + ' человек');

		$.ajaxSetup({
			type: 'GET',
			async: false,
			cache: true,
			contentType: 'application/json',
			dataType: 'jsonp'
		});

		$classmatesResult.empty();

		$moreUsersLink.on('click', function(event) {
			usersModel.init.apply($classmatesResult);
			offsetUsers++;
			event.preventDefault();
		}).trigger('click');

		$classmatesList.append($moreUsersLink);

		var $calendarsList = $('.calendars-list');
		if ($calendarsList.length) {
			calendarsModel.init.apply($calendarsList);
		}

		var $restaurantList = $('.restaurants-list');
		if ($restaurantList.length) {
			restaurantsModel.init.apply($restaurantList);
		}
	});

})(window.jQuery, window.moment);

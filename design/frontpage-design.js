/* К сожалению я пока плохо знаю современные js-фреймворки (angularjs, backbone), поэтому делаю на jquery */

(function($){
	'use strict';

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

	var restaurantsModel = {
		classes: {
			'face'    : 'restaurant__face',
			'label'   : 'restaurant__label',
			'title'   : 'link restaurant__title',
			'table'   : 'restaurant__table',
			'price'   : 'restaurant__price',
			'unit'    : 'restaurant__unit',
			'radio'   : 'restaurant__radio',
			'change'  : 'button restaurant__change'
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
		init: function(change) {
			var $element = this,
			    $change = $(change),
			    $wrapper = $('<div>', { 'class': 'editinplace__wrapper'} ),
			    $input = $('<input>', { 'class': 'editinplace__input', 'placeholder': 'желаемая цена' });

			$element.wrap($wrapper);
			$element.hide().parent().append($input);
			$input.focus();

			// этот метод помечен в jquery как deprecated,
			// пока не нашел как правильно сохранить event
			if (undefined !== $._data(change, 'events').click) {
				var click_event = $._data(change, 'events').click[0].handler;

				$change.off('click');
				$change.on('click', function() {
					editinplace.submit.apply($element, [$input]);

					$change.off('click');
					$change.on('click', click_event);
				});
			}
		},

		submit: function(input) {
			var $element = $(this),
			     price = input.val();

			// добавить проверку вводимого значения
			$element.show().unwrap().text(price);
			$(input).remove();
		}
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
			offsetUsers++;
			//usersModel.init.apply($classmatesResult);
			event.preventDefault();
		}).trigger('click');

		$classmatesList.append($moreUsersLink);

		var $restaurantList = $('.restaurants-list');
		restaurantsModel.init.apply($restaurantList);
	});

})(window.jQuery);

/* К сожалению я пока плохо знаю современные js-фреймворки (angularjs, backbone), поэтому делаю на jquery */

(function($){
	'use strict';

	var getMembersUrl = '//api.vk.com/method/groups.getMembers',
	    group_id = 'yo_photo',
	    countUsers = 20,
	    offsetUsers = 0;

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
				face: $('<a>', { 'class': usersModel.classes.face, 'title': title }),
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

			return $template;
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

	$(function() {
		// dom init
		var $classmatesList = $('.classmates-list'),
		    $classmatesResult = $('.classmates__result'),
		    $moreUsersLink = $('<a>', {'class': 'link link_local classmates__more'}).text('Показать еще ' + countUsers + ' человек');

		$.ajaxSetup({
			type: 'GET',
			async: false,
			cache: true,
			jsonpCallback: 'jsonCallback',
			contentType: 'application/json',
			dataType: 'jsonp'
		});

		$classmatesResult.empty();

		$moreUsersLink.on('click', function(event) {
			offsetUsers++;
			usersModel.init.apply($classmatesResult);
			event.preventDefault();
		}).trigger('click');

		$classmatesList.append($moreUsersLink);
	});

})(window.jQuery);

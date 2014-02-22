/* К сожалению я пока плохо знаю современные js-фреймворки (angularjs, backbone), поэтому делаю на jquery */

(function($){
	'use strict';

	var group_id = 'yo_photo',
	    getMembersUrl = '//api.vk.com/method/groups.getMembers',
	    countUsers = 20,
	    offsetUsers = 1;

	var engine = {
		init: function() {
			$.ajaxSetup({
				type: 'GET',
				async: false,
				jsonpCallback: 'jsonCallback',
				contentType: 'application/json',
				dataType: 'jsonp'
			});

			engine.getMembers.apply(function() {
				var result = this;

				if (result.error) {
					window.alert(result.error.error_msg);
				} else {

				}
			});
		},

		buildUsers: function() {},

		actionsUser: function() {},

		getMembers: function() {
			var callback = this;

			$.ajax({
				url: getMembersUrl,
				data: {
					group_id: group_id,
					offset: offsetUsers,
					fields: 'photo_50,city,verified',
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
		var $classmates = $('.classmates__result');

		engine.init.apply($classmates);
	});

})(window.jQuery);

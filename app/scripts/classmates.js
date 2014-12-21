'use scrict';

var classmates = angular.module('classmates', []);

classmates.directive('hoverClass', function() {
	return {
		restrict: 'A',
		scope: {
			hoverClass: '@'
		},
		link: function(scope, element) {
			element.on('mouseenter', function() {
				element.addClass(scope.hoverClass);
			});
			element.on('mouseleave', function() {
				element.removeClass(scope.hoverClass);
			});
		}
	}
});

classmates.factory('getMembers', function($http) {
	var baseurl = 'http://api.vk.com/method/groups.getMembers?';

	return {
		get: function(step, slice) {
			return $http.jsonp(baseurl + [
				'group_id=mdk',
				'fields=photo_50',
				'count=' + slice,
				'offset=' + (slice * step),
				'callback=JSON_CALLBACK'
			].join('&'))
		}
	};
});

classmates.controller('classmatesList', function($scope, getMembers) {
	$scope.step = 0;
	$scope.slice = 10;
	$scope.users = [];

	$scope.nextSlice = function() {
		$scope.step++;
	};

	$scope.$watch('step', function() {
		getMembers.get($scope.step, $scope.slice).success(function(data) {
			$scope.users = $scope.users.concat(data.response.users);
		});
	});
});

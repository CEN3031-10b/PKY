(function () {
  'use strict';

  angular.module('exams-take')
    .directive('modaldraggable', modaldraggable);

  modaldraggable.$inject = ['$document', '$timeout'];

  function modaldraggable($document,$timeout) {
	return function (scope, element, attr) {
		// use timeout so that the querySelector runs after the DOM has loaded
		$timeout(function(){		
			var startX = 0, startY = 0, x = 0, y = 0;
			// the modaldraggable directive should have the class of the modal, ex: modaldraggable="calc-modal"
			var dialog = angular.element(document.querySelector('.' + attr.modaldraggable + ' .modal-dialog'));
			var header = angular.element(document.querySelector('.' + attr.modaldraggable + ' .modal-header'));
			dialog.css({
				position: 'fixed',
				cursor: 'move'
			});

			header.on('mousedown', function (event) {
				// Prevent default dragging of selected content
				event.preventDefault();
				startX = event.screenX - x;
				startY = event.screenY - y;
				$document.on('mousemove', mousemove);
				$document.on('mouseup', mouseleave);
				//header.on('mouseleave', mouseleave);
			});

			function mousemove(event) {
				y = event.screenY - startY;
				x = event.screenX - startX;
				dialog.css({
					top: y + 'px',
					left: x + 'px'
				});
			}
			function mouseleave(){
				$document.unbind('mousemove', mousemove);
				$document.unbind('mouseup', mouseleave);
				//header.unbind('mouseleave', mouseleave);
			}
		},0);
	};
 }
}());
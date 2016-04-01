/*
'use strict';

angular.module('exams')
.directive("mathjaxBind", function() {
    return {
        restrict: "A",
        controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
            $scope.$watch($attrs.mathjaxBind, function(value) {
                var $script = angular.element("<script type='math/tex'>")
                    .html(value == undefined ? "" : value);
                $element.html("");
                $element.append($script);
                MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $element[0]]);
            });
        }]
    };
});
*/
'use strict';
angular.module('exams')

    .value('mathDefaults', {
        center: True,
        fallback: True
    })

    .directive('katex', function (mathDefaults) {

        return {
			restrict: 'C',
			link: function(scope,element){
				katex.render(element.html(),element[0]);
			}
			
        };
    });

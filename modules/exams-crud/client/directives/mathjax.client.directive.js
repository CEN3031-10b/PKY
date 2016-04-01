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
    .directive('katex', function () {
        return {
			restrict: 'C',
			//link: function(scope,element){
			//	console.log(element.html());
			//try{katex.render(element.html(),element[0]);}
			//catch(err){
			//	console.log(err);
			//}
			//	
			//}
			
			////katex.render(element.html(),element[0]);
			//link: function(scope, element, attrs) {
			//	attrs.$observe('value', function(val) {console.log(val); });
			//}

        link: function(scope, element, attributes){


            attributes.$observe('myDirective', function(value){
                katex.render(value,element[0]);
            });

        }
    };

});
setTimeout(function(){
console.log(MathJax);

MathJax.Hub.Config({
    skipStartupTypeset: true,
    messageStyle: "none",
    "HTML-CSS": {
        showMathMenu: false
    }
});
MathJax.Hub.Configured();
},7000);
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



MathJax.Hub.Config({
    skipStartupTypeset: true,
	text2jax:{preview:"none"},
    messageStyle: "none",
    "HTML-CSS": {
        showMathMenu: false
    }
});
MathJax.Hub.Configured();

angular.module('exams').directive("mathjaxBind", function() {
    return {
        restrict: "A",
        scope:{
            text: "@mathjaxBind"
        },
        controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
            
            $scope.$watch('text', function(value) {
                var $script = angular.element("<script type='math/tex'>")
                    .html(value == undefined ? "" : value);
                $element.html("");
                $element.append($script);
                MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $element[0]],function(){

				});
            });
        }]
    };
});
angular.module('exams').directive('mathjax', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
	link: function (scope, ele, attrs) {
		scope.$watch(attrs.mathjax, function(html) {
			if(!html){
				return;
			} 
			html = html.replace(/\$([^$]+)\$/g, "<katex>$1</katex>");                
			ele.html(html);
			$compile(ele.contents())(scope);
		});
	}
  };
});


angular.module('exams')
    .directive('katex', function () {
       return {
            restrict: 'AE',
            link: function (scope, element) {
                var text = element.html();
                katex.render(text, element[0]);
            }
        };
    });

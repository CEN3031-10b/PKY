'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.min.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
		'public/lib/mathquill-0.10.1/mathquill.css',
		'public/lib/tr-ng-grid/trNgGrid.css',
		'public/lib/KaTeX/dist/katex.min.css'
      ],
      js: [
        'public/lib/angular/angular.min.js',
        'public/lib/angular-resource/angular-resource.min.js',
        'public/lib/angular-animate/angular-animate.min.js',
        'public/lib/angular-messages/angular-messages.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/angular-ui-utils/ui-utils.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/angular-file-upload/dist/angular-file-upload.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
		'public/lib/angular-filter/dist/angular-filter.js',
		'public/lib/mathquill-0.10.1/mathquill.js',
		'public/lib/tr-ng-grid/trNgGrid.js',
		'public/lib/KaTeX/dist/katex.min.js',
      ]
    },
    css: 'public/dist/application.min.css',
    js: 'public/dist/application.min.js'
  }
};

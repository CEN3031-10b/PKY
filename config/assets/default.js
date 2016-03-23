'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        // 'public/lib/CalculatorCSS/add2home.css',
        // 'public/lib/CalculatorCSS/calc.css',
        // 'public/lib/CalculatorCSS/standalone.css',
        // 'public/lib/CalculatorCSS/project.css',
		'public/lib/mathquill-0.10.1/mathquill.css',
		'public/lib/tr-ng-grid/trNgGrid.css'
      ],
      js: [
	    'public/lib/jquery/dist/jquery.js',
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-file-upload/dist/angular-file-upload.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/angular-filter/dist/angular-filter.js',
        // 'public/lib/CalculatorJS/add2home.js',
        // 'public/lib/CalculatorJS/excanvas.js',
        // 'public/lib/CalculatorJS/shortcut.js',
        // 'public/lib/CalculatorJS/sylvester.js',
        // 'public/lib/CalculatorJS/sylvester.src.js',
        // 'public/lib/CalculatorJS/tds_calc_arithmetic.js',
        // 'public/lib/CalculatorJS/tds_calc_config.js',
        // 'public/lib/CalculatorJS/tds_calc_graphing.js',
        // 'public/lib/CalculatorJS/tds_calc_main.js',
        // 'public/lib/CalculatorJS/tds_calc_matrices.js',
        // 'public/lib/CalculatorJS/tds_calc_regression.js',
        // 'public/lib/CalculatorJS/textCanvas.js',
        // 'public/lib/CalculatorJS/yahoo-dom-event.js',
        // 'public/lib/CalculatorJS/tds_calc_env.js',
        // 'public/lib/CalculatorJS/css_browser_selector.js',
		    'public/lib/mathquill-0.10.1/mathquill.js',
		    'public/lib/tr-ng-grid/trNgGrid.js'
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    img: [
      'modules/**/*/img/**/*.jpg',
      'modules/**/*/img/**/*.png',
      'modules/**/*/img/**/*.gif',
      'modules/**/*/img/**/*.svg'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gruntConfig: ['gruntfile.js'],
    gulpConfig: ['gulpfile.js'],
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: ['modules/*/server/config/*.js'],
    policies: 'modules/*/server/policies/*.js',
    views: ['modules/*/server/views/*.html']
  }
};

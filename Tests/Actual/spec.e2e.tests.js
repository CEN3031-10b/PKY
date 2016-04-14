// spec.js
describe('PK Yonge App', function() {
	
	//var ptor;
	
  beforeEach(function(){
	  browser.get('http://localhost:3000/');	  
  });
  
  //Checks to see if the website is operational
  it('Is the Website Online', function() {
	// var ptor; 
	//var ele = by.id('body');
	//expect(ptor.isElementPresent(ele)).toBe(true);
    var body = element(by.tagName('body'));
	expect(body.isElementPresent(by.tagName('div'))).toBeTruthy();
  });
    
	//Checks to see if the website accessed if the PK Yonge Website 
    it('Have we accessed the right website', function() {
				
        expect(browser.getTitle()).toEqual('PKY EOC Practice Test');
  });
  
  it('should not allow user when select practice exam clicked and not signed in', function() {
		
        var scope;		
        expect(scope.authentication).toBeTruthy();
  });
});

describe('Authentication capabilities', function() {
  var fail = function() { expect(true).toBe(false); }

  it('should redirect to the login page if trying to load protected page while not authenticated', fail);
  it('should warn on missing/malformed credentials', fail);
  it('should accept a valid email address and password', fail);
  it('should return to the login page after logout', fail);
});
/*
describe('Authentication capabilities', function() {
  var loginURL;
  var email = element(by.name('login-email'));
  var password = element(by.name('login-password));
  var loginButton = element(by.xpath('//form[1]/input[@type="submit"]'));
  var error = element(by.model('loginError'));

  it('should redirect to the login page if trying to load protected page while not authenticated', function() {
    browser.get('/#/login');
    loginURL = browser.getCurrentUrl();

    browser.get('/#/');
    expect(browser.getCurrentUrl()).toEqual(loginURL);
  });

  it('should warn on missing/malformed credentials', function() {
    email.clear();
    password.clear();

    password.sendKeys('test');
    loginButton.click();
    expect(error.getText()).toMatch('missing email');

    email.sendKeys('test');
    loginButton.click();
    expect(error.getText()).toMatch('invalid email');

    email.sendKeys('hoopla@gmail.com');
    password.clear();
    loginButton.click();
    expect(error.getText()).toMatch('missing password');
  });

  it('should accept a valid email address and password', function() {
    email.clear();
    password.clear();

    email.sendKeys('hoopla@gmail.com');
    password.sendKeys('246_BIM_G2MKit');
    loginButton.click();
    expect(browser.getCurrentUrl()).not.toEqual(loginURL);
  });

  it('should return to the login page after logout', function() {
    var logoutButton = $('a.logout');
    logoutButton.click();
    expect(browser.getCurrentUrl()).toEqual(loginURL);
  });
});
*/
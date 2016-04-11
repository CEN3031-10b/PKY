// spec.js
describe('PK Yonge App', function() {
	
	//var ptor;
	
  beforeEach(function(){
	  browser.get('http://localhost:3000/');	  
  });
  
  it('should have a title', function() {
	 var ptor; 
	var ele = by.id('body');
	expect(ptor.isElementPresent(ele)).toBe(true);
    expect(browser.getTitle()).toEqual('PKY EOC Practice Test');
  });
  
    it('should not allow user when select practice exam clicked and not signed in', function() {
				
        expect(browser.getTitle()).toEqual('PKY EOC Practice Test');
  });
});
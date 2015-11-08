'use strict';

describe('Raves E2E Tests:', function () {
  describe('Test raves page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/raves');
      expect(element.all(by.repeater('rave in raves')).count()).toEqual(0);
    });
  });
});

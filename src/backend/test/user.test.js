const { assert } = require('chai');

describe('Array', () => {
  it('should start empty', function() {
    var arr = [];

    assert.equal(arr.length, 0);
  });
});

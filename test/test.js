(function() {
  var CssToMatrix, data, div, expect, precision;

  CssToMatrix = window['css-to-matrix'];

  expect = chai.expect;

  div = document.getElementById('test');

  precision = 100000;

  data = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]];

  mocha.setup('bdd');

  describe('constructor', function() {
    return it('adds data that is passed when intialized to its model', function() {
      var actual, cssToMatrix;
      cssToMatrix = new CssToMatrix(data);
      actual = cssToMatrix.model.get('matrix');
      return expect(actual).to.deep.equal(data);
    });
  });

  describe('matrix', function() {
    it('should add valid data to its instance model', function() {
      var actual, cssToMatrix;
      cssToMatrix = new CssToMatrix;
      cssToMatrix.matrix(data);
      actual = cssToMatrix.model.get('matrix');
      return expect(actual).to.deep.equal(data);
    });
    return it('should throw an error when intialized with an invalid array', function() {
      var fn;
      fn = function() {
        return new CssToMatrix('bad');
      };
      return expect(fn).to["throw"](Error);
    });
  });

  describe('getMatrix', function() {
    return it('should properly apply transformations', function() {
      var actual, cssToMatrix, expected;
      cssToMatrix = new CssToMatrix;
      cssToMatrix.translate3d(10, 20, 30);
      actual = cssToMatrix.getMatrix();
      expected = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [10, 20, 30, 1]];
      return expect(actual).to.deep.equal(expected);
    });
  });

  describe('getMatrixCSS', function() {
    return it('should convert matricies to CSS strings', function() {
      var css, cssToMatrix;
      cssToMatrix = new CssToMatrix(data);
      css = cssToMatrix.getMatrixCSS();
      return expect(css).to.equal('matrix3d(1,5,9,13,2,6,10,14,3,7,11,15,4,8,12,16)');
    });
  });

  mocha.run();

}).call(this);

(function() {
  define(function() {
    var Background;
    Background = (function() {
      function Background(director) {
        this.director = director;
        this.actor = new CAAT.ShapeActor().setLocation(0, 0).setSize(window.innerWidth, window.innerHeight).setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE).setFillStyle('#D3EFF5');
      }
      return Background;
    })();
    return Background;
  });
}).call(this);

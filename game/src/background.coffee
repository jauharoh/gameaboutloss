define ->
  class Background
    constructor: (@director) ->
      @actor = new CAAT.ShapeActor().
      setLocation(0,0).
      setSize(window.innerWidth, window.innerHeight).
      setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE).
      setFillStyle('#D3EFF5')
  return Background

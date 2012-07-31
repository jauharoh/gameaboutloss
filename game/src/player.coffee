define ['./character'], (Character) ->
  class Player extends Character
    maxForce: 1
    name: 'player'
    events:
      'mouseDown' : 'mousePull'
      'mouseDrag' : 'mousePull'
      'mouseUp'   : 'endPull'
      'touchStart' : 'touchPull'
      'touchMove' : 'touchPull'
      'touchEnd'   : 'endPull'

    constructor: (name, director, other) ->
      super(name, director, other)
    update: =>
      super()
    #    if @getDistanceToVector(@localizedVector)
    release: =>
      super()
      time = @director.time
      @lastShout = time
      range = 200
      if( @other.lastShout+range  > time )
        @other.happiness += 1
        @other.emitAura()
    touchPull: (e) =>
      x = e.changedTouches[0].pageX + @actor.x
      y = e.changedTouches[0].pageY + @actor.y
      @startPull( x, y)

    mousePull: (e) =>
      x = e.sourceEvent.pageX
      y = e.sourceEvent.pageY
      @startPull(x, y)
  return Player

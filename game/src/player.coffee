define [
  './character',
  './states/revolving']
, (Character, Revolving) ->
  class Player extends Character
    maxForce: 1
    name: 'player'
    scale: 0.3
    radian: Math.PI*0.7
    events:
      'mouseDown' : 'mousePull'
      'mouseDrag' : 'mousePull'
      'mouseUp'   : 'endPull'
      'touchStart' : 'touchPull'
      'touchMove' : 'touchPull'
      'touchEnd'   : 'endPull'

    constructor: (name, director) ->
      super(name, director)
    initialize: =>
      console.log 'init'
      @enterState 'revolving'
    update: =>
      super()
    #    if @getDistanceToVector(@localizedVector)
    isGood: =>
      @emitAura()
    release: =>
      super()
      @messenger.broadcast(@, {event: 'hearNote'})
      time = @director.time
      @lastShout = time
      range = 200
    touchPull: (e) =>
      x = e.changedTouches[0].pageX + @actor.x
      y = e.changedTouches[0].pageY + @actor.y
      @startPull( x, y)

    mousePull: (e) =>
      x = e.sourceEvent.pageX
      y = e.sourceEvent.pageY
      @startPull(x, y)
  return Player

define ['./timer', './states'], (Timer, State) ->
  class Character
    deviceScale: window.innerHeight/768
    events: {}
    mass: 100
    vel: 0
    accelerationTimer: null
    force: 0
    maxForce: 1
    friction: 0.1
    orientation: 0
    pulling: false
    normalizedVector: [0,0]
    localizedVector: [0,0]
    radian: 0
    radius: 140
    scale: 0.5
    speed: 0
    maxSpeed: 0.02
    behaviors:
      shrink : new CAAT.ScaleBehavior()
      release: new CAAT.ScaleBehavior()
      revert : new CAAT.ScaleBehavior()
      alpha  : new CAAT.AlphaBehavior()
      rotate: new CAAT.RotateBehavior()

    interps:
      shrink  : new CAAT.Interpolator().createExponentialOutInterpolator(4,false)
      move    : new CAAT.Interpolator().createExponentialOutInterpolator(2, false)
      shrink  : new CAAT.Interpolator().createExponentialOutInterpolator(4,false)
      release : new CAAT.Interpolator().createExponentialOutInterpolator(2, false)
      revert  : new CAAT.Interpolator().createElasticOutInterpolator(1, 0.5)
      inOut   : new CAAT.Interpolator().createExponentialInOutInterpolator(1, false)

    constructor: (@name, @director, @other) ->
      @vel = {x:0, y: 0}
      @radius = screen.height/4 - ((screen.height/2)*0.2)
      @setScale()
      @actor = new CAAT.Actor().
      setBackgroundImage(@director.getImage(@name))
      @actor.setScale(@baseScale, @baseScale)
      @actor.name = @name
      @target = [@actor.x, @actor.y]
      #Set up inputs
      @accelerationTimer = new Timer(@director)
      @initialize()
      @initEvents()

    setScale: =>
      @maxScale = (@scale*1.1)*@deviceScale
      @minScale = (@scale*0.9)*@deviceScale
      @baseScale = @scale*@deviceScale

    initialize: =>

    initEvents: =>
      if @events?
        for event of @events
          @actor[event] = @[@events[event]]

    startPull: (x, y) =>
      @setVector(x, y)
      @pulling = true
    endPull :  () =>
      @pulling = false
    addForce: (force) =>
    #    distanceToTarget = Math.abs(Math.sqrt(Math.pow((@actor.x+@actor.width/2)-@target[0], 2) + Math.pow((@actor.y+@actor.height/2) - @target[1], 2)))
    #    f = ((distanceToTarget-@actor.width/4) / 200)
    #    if f > 1
    #      f = 1
    #    if f < 0.01
    #      f = 0
      @force = force

    setOrientation: (orientation) =>
      @orientation = orientation
      @

    setVector: (x, y) =>
      @target = [x,y]
      tx = (@actor.x+@actor.width/2) - x
      ty = (@actor.y+@actor.height/2) - y
      m = Math.sqrt(tx*tx + ty*ty)
      nx = tx/m
      ny = ty/m
      @localizedVector = [tx, ty]
      @normalizedVector = [nx,ny]
      @

    isNearWaypoint: =>
      @getDistanceToVector(@target) < 500
    #
    setDestination: =>
      if @waypoints.length > 0
        @setWaypoint()

    addWaypoint: (x,y) =>
      waypoint = new Waypoint(@director, x, y)
      if @waypoints then @waypoints.push(waypoint) else @waypoints = [waypoint]
      @

    setWaypoint: =>
      @setVector @waypoints[0].x, @waypoints[0].y
      if @currentWaypoint
        @currentWaypoint.waypoint.setExpired(0)
      @currentWaypoint = @waypoints[0]
      @waypoints.splice(0,1)

    test: (x,y) =>
      @testPoints = [x,y]

    currentState:
      update: ->
        return

    update: =>
      @currentState.update()
      @updateSpeed()
    paint: =>

    getActorCenter:  =>
      [@actor.x + @actor.width/2, @actor.y + @actor.height/2]


    getDistanceToVector: (vector) =>
      tx = @getActorCenter()[0] - vector[0]
      ty = @getActorCenter()[1] - vector[1]
      (tx * tx) + (ty * ty)
    setLocation: (x,y) =>
      @actor.setLocation(x,y)
      @target = @getActorCenter()

    move: (e) =>
      x = @actor.x
      y = @actor.y
      @vel.x = ((e.pageX - @actor.width/2) - x ) / 30
      @vel.y = ((e.pageY - @actor.height/2) - y) / 30
      @actor.x = x + @vel.x
      @actor.y = y + @vel.y

    updatePosition: =>
      @vel.x -= @normalizedVector[0]* @force
      @vel.y -= @normalizedVector[1]* @force
      @vel.x *= 1 - @friction
      @vel.y *= 1 - @friction
      @actor.x += @vel.x
      @actor.y += @vel.y
    updateSpeed: =>
      @speed -= @speed/40
    updateRadialPosition: =>
      @radian += @speed
      @actor.x = window.innerWidth/3 + @radius*Math.cos(@radian)   - @actor.width/2
      @actor.y = window.innerHeight/3 + @radius*Math.sin(@radian)  - @actor.height/2
    push: =>
      @speed = @maxSpeed
      @release()

    rest: =>
      @vel.x = @vel.x - (@vel.x/30)
      @vel.y = @vel.y - (@vel.y/30)
      @actor.x = @actor.x + @vel.x
      @actor.y = @actor.y + @vel.y

    behave: (behavior, isolate = false) =>
      if not isolate then @actor.emptyBehaviorList()
      @actor.addBehavior(behavior)

    revert: =>
      behavior = new CAAT.ScaleBehavior().
      setValues( @maxScale, @baseScale, @maxScale, @baseScale, 0.5, 0.5).
      setInterpolator(@interps.revert).
      setFrameTime(@director.time, 800)
      @actor.addBehavior(behavior)

    receiveMessage: (message) =>
      for name of message when name is 'event'
        @[message[name]]()


    sendMessage: (message) =>
      @messenger.broadcast(@, message)

    setProperty: (properties) =>
      for property of properties
        @[property] = properties[property]

    reactNegative: =>
      @shakeCount = 3
      @rotate(0, Math.PI * 0.1)
    rotate: (start, end) =>
      behavior = new CAAT.RotateBehavior().
      setValues(start, end).
      setFrameTime(@director.time, 150).
      setInterpolator(@interps.inOut)
      if @shakeCount > 0
        behavior.
        addListener
          behaviorExpired: (behavior, time, actor) =>
            start = end
            if @shakeCount == 1
              end = 0
            else
              end = -start
            @rotate(start, end)
            @shakeCount -= 1
      @behave(behavior)

    shrink: =>
      behavior = new CAAT.ScaleBehavior().
      setCycle(false).
      setValues(@actor.scaleX, @minScale, @actor.scaleY, @minScale, 0.5, 0.5).
      setInterpolator(@interps.shrink).
      setFrameTime(@director.time, 3000)
      @behave(behavior)

    emitAura: =>
      bScale = new CAAT.ScaleBehavior().
      setCycle(false).
      setValues( 0.2*@deviceScale, 1.2*@deviceScale, 0.2*@deviceScale, 1.2*@deviceScale, 0.5, 0.5).
      setInterpolator(@interps.release).
      setFrameTime(@director.time, 800)
      bAlpha = new CAAT.AlphaBehavior().
      setCycle(false).
      setValues(1,0).
      setInterpolator(@interps.release).
      setFrameTime(@director.time, 800)
      aura = new CAAT.Actor().setBackgroundImage(@director.getImage(@name+'-aura')).centerAt(@actor.x+@actor.width/2, @actor.y+@actor.height/2).
      setFrameTime(@director.time, 800).addBehavior(bAlpha).addBehavior(bScale)
      @director.scenes[0].activeChildren.addChild aura

    release: =>
      @director.getAudioManager().play('ding')
      #    Behaviors for aura lifecycle
      behavior = new CAAT.ScaleBehavior().
      setCycle(false).
      setValues( 0.85, @maxScale, 0.85, @maxScale, 0.5, 0.5).
      setInterpolator(@interps.shrink).
      setFrameTime(@director.time, 120).
      setValues( @actor.scaleX, @maxScale, @actor.scaleY, @maxScale, 0.5, 0.5).
      addListener
        behaviorExpired: (behavior, time, actor) =>
          @revert()
      #          if actor.id is @actor.id then @revert()
      @behave(behavior)

    enterState: (name, option = null) =>
      @currentState = new State[name](@, option)

    setCurrentState: (state, option = null) =>
      @currentState = new state(@, option)

  class Waypoint
    constructor: (director,x,y) ->
      @x = x
      @y = y
      @waypoint = new CAAT.Actor().setBackgroundImage(director.getImage('waypoint')).centerAt(x,y).setScale(0.1, 0.1)
      director.scenes[0].activeChildren.addChild @waypoint

  return Character

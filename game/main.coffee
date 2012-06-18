class Sound
  constructor: (src) ->
    audio = new Audio()
    audio.src = src
    audio.load()
    @audio = audio
  play: ->
    @audio.play()
  stop: ->
    @audio.pause()
    @audio.currentTime = 0
  pause: ->
    @audio.pause()
class Background
  constructor: (@director) ->
    @actor = new CAAT.ShapeActor().
      setLocation(0,0).
      setSize(window.innerWidth, window.innerHeight).
      setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE).
      setFillStyle('#D3EFF5')
class Player
  deviceScale: window.innerHeight/768
  constructor: (@director) ->
    @maxScale = 1.2*@deviceScale
    @minScale = 0.35*@deviceScale
    @baseScale = 1*@deviceScale
    @actor = new CAAT.Actor().
      setBackgroundImage(@director.getImage('player'))
    #Add aura actor
#    @director.scenes[0].addChild @actor
    #Set up inputs
    @actor.mouseDown = =>
      @shrink()
    @actor.mouseUp = =>
      window.ding.play()
      @release()
    @actor.touchStart = (e) =>
      touch = e.changedTouches[0]
      @shrink()
    @actor.touchEnd = (e) =>
      @release()
    #Set up interpolators
    @moveEase = new CAAT.Interpolator().createExponentialOutInterpolator(2, false)
    @shrinkEase = new CAAT.Interpolator().createExponentialOutInterpolator(4,false)
    @releaseEase = new CAAT.Interpolator().createExponentialOutInterpolator(2, false)
    @revertEase = new CAAT.Interpolator().createElasticOutInterpolator(1, 0.5)
    @shrinkBehavior = new CAAT.ScaleBehavior().
      setCycle(false).
      setValues(@baseScale, @minScale, @baseScale, @minScale, 0.5, 0.5).
      setInterpolator(@shrinkEase).
      setId(1)
    @releaseBehavior = new CAAT.ScaleBehavior().
      setCycle(false).
      setValues( 0.85, @maxScale, 0.85, @maxScale, 0.5, 0.5).
      setInterpolator(@shrinkEase).
      setId(2).
      addListener
        behaviorExpired: =>
          @revert()
    @revertBehavior = new CAAT.ScaleBehavior().
      setValues( @maxScale, @baseScale, @maxScale, @baseScale, 0.5, 0.5).
      setInterpolator(@revertEase).
      setId(3)
  move: (e) =>
    x = @actor.x
    y = @actor.y
    @actor.x = x + ((e.pageX-@actor.width/2) - x)/30
    @actor.y = y  + ((e.pageY-@actor.height/2) - y)/30
  moveTo: (x, y) =>
    @moving = true
    tx = x-@actor.width/2
    ty = y-@actor.height/2
    @path = new CAAT.LinearPath().setInitialPosition(@actor.x, @actor.y).setFinalPosition(tx,ty)
    console.log length = Math.sqrt(Math.pow(Math.abs(@actor.x - tx), 2) + Math.pow(Math.abs(@actor.y - ty), 2))
    b = new CAAT.PathBehavior().setPath(@path).setInterpolator(@moveEase)
    b.setFrameTime(@director.time, length*2)
    @actor.addBehavior(b)

  updatePath: (x,y) =>

    tx = x-@actor.width/2
    ty = y-@actor.height/2
    @path.setFinalPosition(tx, ty)
  revert: ->
    @revertBehavior.setFrameTime(@director.time, 800)
    @actor.addBehavior(@revertBehavior)

  shrink: ->
    @shrinkBehavior.setFrameTime(@director.time, 3000)
    console.log @baseScale
#    @actor.removeBehavior(@revertBehavior)
#    @actor.removeBehavior(@revertBehavior).removeBehavior(@releaseBehavior)
    @actor.removeBehaviorById(2).removeBehaviorById(3)
    @actor.addBehavior(@shrinkBehavior)

  release: ->
    window.ding.play()
    #Behaviors for aura lifecycle
    bScale = new CAAT.ScaleBehavior().
      setCycle(false).
      setValues( 0.2*@deviceScale, 1.2*@deviceScale, 0.2*@deviceScale, 1.2*@deviceScale, 0.5, 0.5).
      setInterpolator(@releaseEase).
      setFrameTime(@director.time, 800)
    #      addListener
    #        behaviorExpired: =>
    #          @revert()
    aScale = new CAAT.AlphaBehavior().
      setCycle(false).
      setValues(1,0).
      setInterpolator(@releaseEase).
      setFrameTime(@director.time, 800)

    aura = new CAAT.Actor().setBackgroundImage(@director.getImage('aura')).centerAt(@actor.x+@actor.width/2, @actor.y+@actor.height/2).
      setFrameTime(@director.time, 800).addBehavior(bScale).addBehavior(aScale)

    @director.scenes[0].activeChildren.addChild aura
    @actor.removeBehaviorById(1)
    @releaseBehavior.setFrameTime(@director.time, 120).
      setValues( @actor.scaleX, @maxScale, @actor.scaleY, @maxScale, 0.5, 0.5)
    @actor.addBehavior(@releaseBehavior)

window.addEventListener('load', -> preload())

CAAT.TOUCH_BEHAVIOR= CAAT.TOUCH_AS_MULTITOUCH;

preload = ->
  window.images = new CAAT.ImagePreloader().loadImages [
    {id: 'player', url: 'game/assets/images/player.png'}
    {id: 'aura', url: 'game/assets/images/aura.png'}]
  , ( counter, images ) =>
      if counter is images.length
        start(images)
start = (images) ->
  window.music = new Sound('game/assets/soundtracks/unity_1.mp3')
  window.ding = new Sound('game/assets/sounds/ding.mp3')
  window.music.audio.addEventListener('ended', window.music.play())
  window.music.play()
  #Canvas
  canvas = document.createElement('canvas')
  document.body.appendChild(canvas)
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  #Director
  director = window.director = new CAAT.Director().initialize window.innerWidth, window.innerHeight, canvas
  director.setImagesCache(images)

  director.onRenderStart = ->
  #Scene
    if(director.mousePos)
      player.move(director.mousePos)
  scene = director.createScene()
  #Container
  container = new CAAT.ActorContainer().
    setBounds(0, 0, window.innerWidth, window.innerHeight).
    setGestureEnabled(false)
  container.mouseDown = (e)->
    director.mousePos = e.sourceEvent
#    movePlayerTo(e.sourceEvent.pageX, e.sourceEvent.pageY)
  container.mouseDrag = (e) ->
    director.mousePos = e.sourceEvent
  container.mouseUp = ->
    director.mousePos = null
#    player.release()
  container.touchStart = (e)->
    touch = e.changedTouches[0]
    movePlayerTo(touch.pageX, touch.pageY)
  container.touchEnd = ->
    player.release()
#  container.touchMove = (e)->
#    touch = e.changedTouches[0]
#    updatePlayerPath(e.sourceEvent.pageX, e.sourceEvent.pageY)

  movePlayerTo = (x,y)->
    player.moveTo(x,y)
  updatePlayerPath = (x,y)->
    player.updatePath(x,y)
  #Player
  player = window.player = new Player(director);
  background = new Background(director)
  #Add children
  scene.addChild background.actor
  scene.addChild container
  scene.addChild player.actor

  player.actor.setLocation(300, 300)

  CAAT.loop 1

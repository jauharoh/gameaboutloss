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
class Character
  deviceScale: window.innerHeight/768

  events: []

  behaviors:
    shrink : new CAAT.ScaleBehavior()
    release: new CAAT.ScaleBehavior()
    revert : new CAAT.ScaleBehavior()
    alpha  : new CAAT.AlphaBehavior()

  interps:
    shrink  : new CAAT.Interpolator().createExponentialOutInterpolator(4,false)
    move    : new CAAT.Interpolator().createExponentialOutInterpolator(2, false)
    shrink  : new CAAT.Interpolator().createExponentialOutInterpolator(4,false)
    release : new CAAT.Interpolator().createExponentialOutInterpolator(2, false)
    revert  : new CAAT.Interpolator().createElasticOutInterpolator(1, 0.5)
  constructor: (@name, @director) ->
    @vel = {x:0, y: 0}
    @maxScale = 1.2*@deviceScale
    @minScale = 0.35*@deviceScale
    @baseScale = 1*@deviceScale
    @actor = new CAAT.Actor().
    setBackgroundImage(@director.getImage(@name))
    @actor.setScale(@baseScale, @baseScale)
    @actor.name = @name
    #Set up inputs
    @initialize()
    @initEvents()

  initialize: =>
    @behaviors.shrink.
      setCycle(false).
      setValues(@baseScale, @minScale, @baseScale, @minScale, 0.5, 0.5).
      setInterpolator(@interps.shrink)
    @behaviors.release.
      setCycle(false).
      setValues( 0.85, @maxScale, 0.85, @maxScale, 0.5, 0.5).
      setInterpolator(@interps.shrink).
      addListener
        behaviorExpired: (behavior, time, actor) =>
          if actor.id is @actor.id then @revert()
          if actor.id is @actor.id
            console.log(actor.id)
    @behaviors.revert.
      setValues( @maxScale, @baseScale, @maxScale, @baseScale, 0.5, 0.5).
      setInterpolator(@interps.revert)

  initEvents: =>
    if @events?
      for event of @events
        console.log event, @[@events[event]]
        @actor[event] = @[@events[event]]

  update: =>

  move: (e) =>
    x = @actor.x
    y = @actor.y
    @vel.x = ((e.pageX - @actor.width/2) - x ) / 30
    @vel.y = ((e.pageY - @actor.height/2) - y) / 30
    @actor.x = x + @vel.x
    @actor.y = y + @vel.y

  rest: =>
    @vel.x = @vel.x - (@vel.x/30)
    @vel.y = @vel.y - (@vel.y/30)
    @actor.x = @actor.x + @vel.x
    @actor.y = @actor.y + @vel.y

  behave: (behavior, isolate = false) =>
    if not isolate then @actor.emptyBehaviorList()
    @actor.addBehavior(@behaviors[behavior])

  revert: =>
    @behaviors.revert.setFrameTime(@director.time, 800)
    @behave('revert')

  shrink: =>
    @behaviors.shrink.setFrameTime(@director.time, 3000)
    @behave('shrink')

  release: =>
    window.ding.play()
    #Behaviors for aura lifecycle
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
    @behaviors.release.setFrameTime(@director.time, 120).
    setValues( @actor.scaleX, @maxScale, @actor.scaleY, @maxScale, 0.5, 0.5)
    @behave('release')



class Player extends Character
  events:
    'mouseDown' : 'shrink'
    'mouseUp'   : 'release'
    'touchStart': 'shrink'
    'touchEnd'  : 'release'

class Timer
  constructor: (@director) ->
    @startTime = @director.time

  getTime: ->
    @director.time - @startTime

class Companion extends Character
  proximity: 100
  constructor: (@director, @name, @player) ->
    super(@director, @name)
    @reactionTimer = new Timer(@director)
  update: =>
    @pathToPlayer = new CAAT.LinearPath().setInitialPosition(@actor.x, @actor.y).setFinalPosition(@player.actor.x, @player.actor.y)
    if @pathToPlayer.updatePath().getLength() < 300
      @react()



  react: =>
    if @reactionTimer.getTime() > 1000
      @release()
      @reactionTimer = new Timer(@director)




window.addEventListener('load', -> preload())

CAAT.TOUCH_BEHAVIOR= CAAT.TOUCH_AS_MULTITOUCH;

preload = ->
  window.images = new CAAT.ImagePreloader().loadImages [
    {id: 'player', url: 'game/assets/images/player.png'}
    {id: 'player-aura', url: 'game/assets/images/aura.png'}
    {id: 'companion-aura', url: 'game/assets/images/companion-aura.png'}
    {id: 'companion', url: 'game/assets/images/companion-body.png'}
  ]
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

  scene = director.createScene()
  #Container
  container = new CAAT.ActorContainer().
    setBounds(0, 0, window.innerWidth, window.innerHeight).
    setGestureEnabled(false)
  container.mouseDown = (e)->
    director.mousePos = e.sourceEvent
  container.mouseDrag = (e) ->
    director.mousePos = e.sourceEvent
  container.mouseUp = ->
    director.mousePos = null
  container.touchStart = (e)->
    director.mousePos = e.changedTouches[0]
  container.touchMove = (e) ->
    director.mousePos = e.changedTouches[0]
  container.touchEnd = ->
    director.mousePos = null

  movePlayerTo = (x,y)->
    player.moveTo(x,y)
  updatePlayerPath = (x,y)->
    player.updatePath(x,y)
  #Player
  player = window.player = new Player('player', director)
  window.companion = companion = new Companion('companion', director, player)
  background = new Background(director)
  #Add children
  scene.addChild background.actor
  scene.addChild container
  scene.addChild player.actor
  container.addChild companion.actor

  director.onRenderStart = ->
    companion.update()

    if(director.mousePos)
      player.move(director.mousePos)
    else
      player.rest()
  player.actor.setLocation(300, 300)

  CAAT.loop 1

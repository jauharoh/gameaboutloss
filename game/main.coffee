#---------------#
class Background
  constructor: (@director) ->
    @actor = new CAAT.ShapeActor().
      setLocation(0,0).
      setSize(window.innerWidth, window.innerHeight).
      setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE).
      setFillStyle('#D3EFF5')
#---------------#

class Character
  deviceScale: window.innerHeight/768
  events: []
  mass: 100
  vel: 0
  accelerationTimer: null
  force: 0
  maxForce: 0
  friction: 0.05
  orientation: 0
  normalizedVector: [0,0]
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

  constructor: (@name, @director, @other) ->
    @vel = {x:0, y: 0}
    @maxScale = 1.2*@deviceScale
    @minScale = 0.35*@deviceScale
    @baseScale = 1*@deviceScale
    @actor = new CAAT.Actor().
      setBackgroundImage(@director.getImage(@name))
    @actor.setScale(@baseScale, @baseScale)
    @actor.name = @name
    @target = [0,0]
    #Set up inputs
    @accelerationTimer = new Timer(@director)
    @initialize()
    @initEvents()

  initialize: =>

  initEvents: =>
    if @events?
      for event of @events
        @actor[event] = @[@events[event]]

  setForce: (force) =>
    @accelerationTimer = new Timer(@director)
    @force = force
    @

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
    @normalizedVector = [nx,ny]
    @

  update: =>
    accel = @force / @mass
    velocity = accel * @accelerationTimer.getTime()
    velocity *= 0.95
#    if Math.abs(@vel) > 2
#      if @vel < 0 then @vel = -2 else @vel = 2
    @vel.x -= @normalizedVector[0]* @force
    @vel.y -= @normalizedVector[1]* @force
    @vel.x *= 1 - @friction
    @vel.y *= 1 - @friction
    @actor.x += @vel.x
    @actor.y += @vel.y

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
    @actor.addBehavior(behavior)

  revert: =>
    behavior = new CAAT.ScaleBehavior().
      setValues( @maxScale, @baseScale, @maxScale, @baseScale, 0.5, 0.5).
      setInterpolator(@interps.revert).
      setFrameTime(@director.time, 800)
    @actor.addBehavior(behavior)

  shrink: =>
    behavior = new CAAT.ScaleBehavior().
      setCycle(false).
      setValues(@baseScale, @minScale, @baseScale, @minScale, 0.5, 0.5).
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

class Player extends Character
  events:
    'mouseDown' : 'shrink'
    'mouseUp'   : 'release'
    'touchStart': 'shrink'
    'touchEnd'  : 'release'

  constructor: (name, director, other) ->
    super(name, director, other)
  update: =>

    distanceToTarget = Math.abs(Math.sqrt(Math.pow((@actor.x+@actor.width/2)-@target[0], 2) + Math.pow((@actor.y+@actor.height/2) - @target[1], 2)))
    @force = ((distanceToTarget-@actor.width/2) / 200)
    if @force > 1
      @force = 1
    if @force < .01
      @force = 0
    @force *= .6
    super()
  release: =>
    super()
    time = @director.time
    @lastShout = time
    range = 200
    if( @other.lastShout+range  > time )
      @other.happiness += 1
      @other.emitAura()

class Companion extends Character
  constructor: (name, director, other) ->
    super(name, director, other)
    @beat = 60000 / 44
    @reactionTimer = new Timer(@director)
    @chargeTimer = new Timer(@director)
    @beatsTimer = new Timer(@director)
    @offset = 0
    @happiness = 0
    @singing = false

  setTrack:(track, signature, offset) =>
    @beatsTimer.reset()
    @beat = (60000/(track.bpm/signature))
    @offset = offset

  update: =>
    super()
    if @happiness > 3
      music.next(4000)
      @setTrack(music.tracks[music.currentIndex], 3, 300)
      @happiness = 0
    if @singing
      if @beatsTimer.getTime(@offset) > @beat
        @charge()
        @beatsTimer.reset()
    if @charging?
      if @chargeTimer.getTime() > 1000
        @release()
        if @other.lastShout > @director.time - 100
          @emitAura()
          @happiness += 1
        @lastShout = @director.time
        @charging = null
    @pathToPlayer = new CAAT.LinearPath().setInitialPosition(@actor.x, @actor.y).setFinalPosition(@other.actor.x, @other.actor.y)
    if @pathToPlayer.updatePath().getLength() < 300
      @react()

  charge: =>
    @charging = true
    @chargeTimer.reset()
    @shrink()

  react: =>
    if @reactionTimer.getTime() > 1000
      @release()
      @reactionTimer = new Timer(@director)

#---------------#
class Timer
  constructor: (@director) ->
    @reset()

  getTime: (offset = 0) ->
    @director.time - @startTime - offset

  reset: =>
    @startTime = @director.time
#---------------#

class MusicManager
  constructor: (@director) ->
    @manager = new CAAT.AudioManager().initialize(8)
    @currentTracks = []
    @stopping = []
    @tracks = []
    @currentIndex = 0

  update: ->

  addTracks: (tracks) =>
    for track in tracks
      sound = new buzz.sound(track.url, {format: ['ogg'], preload: true})
      sound.bpm = track.bpm
      sound.load()
      @tracks.push sound

  play: (id, duration = 2000) =>
    @tracks[id].play().loop().fadeIn(duration)
    @currentTracks[id] = @tracks[id]

  stop: (id, duration = 2000) =>
    @tracks[id].fadeOut(duration, => @tracks[id].stop())

  next: (fade = 2000) =>
    @stop @currentIndex, fade
    if @tracks[@currentIndex+1]? then @currentIndex += 1 else @currentIndex = 0
    @play @currentIndex, fade

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
  dirs =
    sound : 'game/assets/sound/'
    music : 'game/assets/music/'
  canvas = document.createElement('canvas')
  document.body.appendChild(canvas)
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  #Director
  director = window.director = new CAAT.Director().initialize window.innerWidth, window.innerHeight, canvas
  window.music = music = new MusicManager(director)
  director.setImagesCache(images)
  director.addAudio('ding', dirs.sound + 'ding.mp3')

  music.addTracks([
    { id: 'intro',      bpm: 110, url: dirs.music + 'intro.mp3'}
    { id: 'harmony',    bpm: 88,  url: dirs.music + 'harmony.mp3'}
    { id: 'disharmony', bpm: 88,  url: dirs.music + 'disharmony.mp3'}
  ])


  scene = director.createScene()
  #Container
  container = new CAAT.ActorContainer().
    setBounds(0, 0, window.innerWidth, window.innerHeight).
    setGestureEnabled(false)

  movePlayerTo = (x,y)->
    player.moveTo(x,y)
  updatePlayerPath = (x,y)->
    player.updatePath(x,y)
  #Player
  player = window.player = new Player('player', director)
  window.companion = companion = new Companion('companion', director, player)
  player.other = companion
  background = new Background(director)
  #Add children
  scene.addChild background.actor
  scene.addChild container
  scene.addChild player.actor
  container.addChild companion.actor

  #start
#  music.play(0)
  companion.setTrack(music.tracks[0], 3, 3)
  director.onRenderStart = ->
    companion.update()
    player.update()
    music.update()
  player.actor.setLocation(300, 300)

  CAAT.loop 1

  container.mouseDown = (e)->
    player.setVector(e.sourceEvent.pageX, e.sourceEvent.pageY).setForce(0.5)
  container.mouseDrag = (e) ->
    player.setVector(e.sourceEvent.pageX, e.sourceEvent.pageY).setForce(0.5)
  container.mouseUp = ->
    player.setForce(0)
    director.mousePos = null
  container.touchStart = (e)->
    director.mousePos = e.changedTouches[0]
  container.touchMove = (e) ->
    director.mousePos = e.changedTouches[0]
  container.touchEnd = ->
    director.mousePos = null


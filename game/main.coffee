class Game
  constructor: (@options)->
    @canvas = document.createElement('canvas')
    @canvas.width = @options.width
    @canvas.height = @options.height
    @canvas.addEventListener('touchstart', @tap)
    @ctx = @canvas.getContext('2d')
    document.body.appendChild(@canvas)
    @entities = []
    setInterval =>
      @update()
    , 1000/60

  tap: =>
    this.ding.play()
    this.music.play()

  addEntity: (entity)->
    @entities.push entity

  update: =>
#    entity.update() for entity in @entities
#    @draw()

  draw: =>

    console.log('draw')
    entity.draw(@ctx) for entity in @entities


class Actor
  constructor: (@shape, @voice)->
    @shape.addEventListener 'mousedown', @shrink
    @shape.addEventListener 'mouseup mouseout', @release

  shrink: =>
    @shape.scale = 2
  release: =>
    @voice.play()
    @shape.transitionTo
      duration: 0.06
      easing: 'ease-out'
      scale:
        x: 1.2
        y: 1.2
      callback: =>
        @shape.transitionTo
          duration: 0.5
          easing: 'elastic-ease-out'
          scale:
            x: 1
            y: 1


class Sound
  constructor: (src) ->
    audio = new Audio()
    audio.src = src
    audio.load()
    audio.play()
    @audio = audio
  play: ->
    @audio.currentTime = 0.5
    @audio.play()
  stop: ->
    @audio.pause()
    @audio.currentTime = 0
  pause: ->
    @audio.pause()

class Rectangle
  constructor: (@options)->
    @canvas = document.createElement('canvas')
    @canvas.id = @options.id
    @canvas.zIndex = @options.zIndex
    @canvas.width = @options.width
    @canvas.height = @options.height
    document.body.appendChild(@canvas)
    @ctx = @canvas.getContext('2d')
    @draw()

  draw: ->
    @ctx.beginPath()
    @ctx.rect(@options.x, @options.y, @options.width, @options.height)
    @ctx.fillStyle = @options.fill
    @ctx.closePath()
    @ctx.fill()

  update: ->
    return

class Circle
  constructor: (@options) ->
    @attrs = {}
  update: =>
    for option of @options when option isnt "styles"
      if @options[option] isnt @attrs[option]
        console.log(@options[option] , @attrs[option])
        console.log 'updated'
        break
    for option of @options when option isnt 'styles'
      @attrs[option] = @options[option]

  draw: (ctx)->
    ctx.beginPath()
    #arc(x,y,radius,beginRadian, endRadian, anticlockwise)
    ctx.arc(50, 50, @options.radius, 0, Math.PI*2)
    ctx.fillStyle = @options.fill
    ctx.closePath()
    ctx.fill()

class Player
  constructor: (@director) ->
    @actor = new CAAT.ShapeActor().
      setLocation(20,20).
      setSize(60,60).
      setFillStyle('#FFFFFF').
      setStrokeStyle('#000000')
    @actor.mouseDown = =>
      @shrink()
    @actor.mouseUp = =>
      window.ding.play()
      @release()
    @shrinkEase = new CAAT.Interpolator().createExponentialOutInterpolator(4,false)
    @releaseEase = new CAAT.Interpolator().createExponentialOutInterpolator(2, false)
    @revertEase = new CAAT.Interpolator().createExponentialInOutInterpolator(6, false)
    @shrinkBehavior = new CAAT.ScaleBehavior().
      setCycle(false).
      setValues(1, 0.85, 1, 0.85, 0.5, 0.5).
      setInterpolator(@shrinkEase)
    @releaseBehavior = new CAAT.ScaleBehavior().
      setCycle(false).
      setValues( 0.85, 1.4, 0.85, 1.4, 0.5, 0.5).
      setInterpolator(@shrinkEase).
      addListener
        behaviorExpired: =>
          @revert()
    @revertBehavior = new CAAT.ScaleBehavior().
      setValues( 1.4, 1, 1.4, 1, 0.5, 0.5).
      setInterpolator(@revertEase)

  revert: ->
    @revertBehavior.setFrameTime(@director.time, 100)
    @actor.addBehavior(@revertBehavior)

  shrink: ->
    @shrinkBehavior.setFrameTime(@director.time, 100)
#    @actor.removeBehavior(@revertBehavior)
    @actor.addBehavior(@shrinkBehavior)

  release: ->
    @releaseBehavior.setFrameTime(@director.time, 120)
    @actor.addBehavior(@releaseBehavior)


#  window.addEventListener 'load', -> alert('hi'), false

window.addEventListener('load', -> start())

start = ->
#  window.game = game = new Game
#    width: 1024
#    height: 768
#  game.background = new Rectangle
#    x: 0
#    y: 0
#    width: screen.width
#    height: screen.height
#    id: 'background'
#    fill: 'red'
#    styles:
#      zIndex: 0
#      position: 'absolute'
#      top: 0
#      left: 0

  player= new Circle
    radius: 50
    id: 'player'
    x:300
    y:200
    fill: "green"
    sX: 1
    sY: 1
    styles:
      zIndex: 1
      position: 'absolute'
      top: 0
      left: 0
      background: 'none'
  #  point1 =
  #  companionShape = new Kinetic.Polygon
  #    points:
#  game.addEntity(game.player)
#  game.addEntity(game.background)
  window.music = new Sound('track_1.mp3')
  window.ding = new Sound('ding.mp3')
#  player = new Actor(playerShape, game.ding)
  #  companion = new Actor(companionShape)
  window.music.play()
  canvas = document.createElement('canvas')
  document.body.appendChild(canvas)
  canvas.width = 1024
  canvas.height = 768
  window.director = director = new CAAT.Director().initialize 1024, 768, canvas
  scene = director.createScene()
  #player

  window.player = new Player(director);
  scene.addChild window.player.actor
  CAAT.loop 1

#  game.player = player
#  game.canvas.append(playerShape)
#  $('body').bind 'touchstart', ->
#    player.shrink()
#  $('body').bind 'touchend', ->
#    player.release()

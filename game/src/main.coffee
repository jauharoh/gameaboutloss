#---------------#
require.config
  baseUrl: "game/lib/"
require ['entities'], (entities) ->
  load(entities)

load = (entities) ->
  CAAT.TOUCH_BEHAVIOR= CAAT.TOUCH_AS_MULTITOUCH;
  Player = entities.player
  Companion = entities.companion
  MusicManager = entities.musicManager
  Background = entities.background
  Pathway = entities.pathway
  window.addEventListener('load', -> preload())

  preload = ->
    new CAAT.ImagePreloader().loadImages [
      {id: 'player', url: 'game/assets/images/player.png'}
      {id: 'player-aura', url: 'game/assets/images/aura.png'}
      {id: 'companion-aura', url: 'game/assets/images/companion-aura.png'}
      {id: 'companion', url: 'game/assets/images/companion-body.png'}
      {id: 'waypoint', url: 'game/assets/images/waypoint.png'}
    ]
      , ( counter, images ) ->
        if counter is images.length
          start(images)

  start = (images) ->
    dirs =
      sound : 'game/assets/sound/'
      music : 'game/assets/music/'
    canvas = document.createElement('canvas')
    #  canvas = $('#gameCanvas')
    document.body.appendChild(canvas)
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    director = window.director = new CAAT.Director().initialize window.innerWidth, window.innerHeight, canvas
    director.setImagesCache(images)

    director.addAudio('ding', dirs.sound + 'ding.mp3')
    director.addAudio('drum1', dirs.sound + 'drum_1.mp3')
    window.ding = director.getAudioManager().getAudio('ding')

    window.music = music = new MusicManager(director)
    music.addTracks([
      { id: 'intro',      bpm: 110, url: dirs.music + 'intro.mp3'}
      { id: 'harmony',    bpm: 88,  url: dirs.music + 'harmony.mp3'}
      { id: 'disharmony', bpm: 88,  url: dirs.music + 'disharmony.mp3'}
    ])
    music.tracks[1].fadeIn(6)
    scene = director.createScene()
    container = new CAAT.ActorContainer().
    setBounds(0, 0, window.innerWidth, window.innerHeight).
    setGestureEnabled(false)
    #
    background = new Background(director)
    player = window.player = new Player('player', director)
#    path = window.path = new Pathway(director, player)
    companion = window.companion= new Companion('companion', director, player)
    player.other = companion

    scene.addChild background.actor
    scene.addChild container
    scene.addChild player.actor
    container.addChild companion.actor
    companion.setTrack(music.tracks[0], 3, 3)
    director.onRenderStart = ->
      companion.update()
      player.update()
      music.update()
    player.setLocation(300, 300)
    CAAT.loop 1

    #  container.mouseDown = (e)->
    #    pullCharacter(e.sourceEvent.pageX, e.sourceEvent.pageY, player)
    #  container.mouseDrag = (e) ->
    #    console.log('move')
    #    pullCharacter(e.sourceEvent.pageX, e.sourceEvent.pageY, player)
    director.mouseDown = (e) ->
      player.push()
    #  container.touchStart = (e)->
    #    pullCharacter(e.changedTouches[0].pageX, e.changedTouches[0].pageY, player)
    #  container.touchMove = (e) ->
    #    pullCharacter(e.changedTouches[0].pageX, e.changedTouches[0].pageY, player)
    container.touchEnd = (e) ->
      pullCharacter(e.changedTouches[0].pageX, e.changedTouches[0].pageY, player)

    window.pullCharacter = pullCharacter = (x, y, character) =>
      player.addWaypoint(x,y)
    endPull =  (character) =>
      character.endPull()


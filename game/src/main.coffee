#---------------#
require.config
  baseUrl: "game/lib/"
require ['entities', 'kibo'], (entities, Kibo) ->
  load(entities)

load = (entities) ->
  CAAT.TOUCH_BEHAVIOR= CAAT.TOUCH_AS_MULTITOUCH;
  for name of entities
    nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1)
    @[nameCapitalized] = entities[name]
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
    companion = window.companion= new Companion('companion', director, player)
    messenger = new Messenger()
    messenger.add(player).add(companion)
    scene.addChild background.actor
    scene.addChild container
    scene.addChild player.actor
    container.addChild companion.actor
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
    k = new Kibo()
    k.down ['space'], ->
      player.shrink()
    k.up ['space'], ->
      player.push()

    container.mouseDown = (e) ->
      player.shrink()
    container.mouseUp = (e) ->
      player.push()
    container.keyDown = (e) ->
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


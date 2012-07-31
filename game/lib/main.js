(function() {
  var load;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  require.config({
    baseUrl: "game/lib/"
  });
  require(['entities'], function(entities) {
    return load(entities);
  });
  load = function(entities) {
    var Background, Companion, MusicManager, Pathway, Player, preload, start;
    CAAT.TOUCH_BEHAVIOR = CAAT.TOUCH_AS_MULTITOUCH;
    Player = entities.player;
    Companion = entities.companion;
    MusicManager = entities.musicManager;
    Background = entities.background;
    Pathway = entities.pathway;
    window.addEventListener('load', function() {
      return preload();
    });
    preload = function() {
      return new CAAT.ImagePreloader().loadImages([
        {
          id: 'player',
          url: 'game/assets/images/player.png'
        }, {
          id: 'player-aura',
          url: 'game/assets/images/aura.png'
        }, {
          id: 'companion-aura',
          url: 'game/assets/images/companion-aura.png'
        }, {
          id: 'companion',
          url: 'game/assets/images/companion-body.png'
        }, {
          id: 'waypoint',
          url: 'game/assets/images/waypoint.png'
        }
      ], function(counter, images) {
        if (counter === images.length) {
          return start(images);
        }
      });
    };
    return start = function(images) {
      var background, canvas, companion, container, director, dirs, endPull, music, player, pullCharacter, scene;
      dirs = {
        sound: 'game/assets/sound/',
        music: 'game/assets/music/'
      };
      canvas = document.createElement('canvas');
      document.body.appendChild(canvas);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      director = window.director = new CAAT.Director().initialize(window.innerWidth, window.innerHeight, canvas);
      director.setImagesCache(images);
      director.addAudio('ding', dirs.sound + 'ding.mp3');
      director.addAudio('drum1', dirs.sound + 'drum_1.mp3');
      window.ding = director.getAudioManager().getAudio('ding');
      window.music = music = new MusicManager(director);
      music.addTracks([
        {
          id: 'intro',
          bpm: 110,
          url: dirs.music + 'intro.mp3'
        }, {
          id: 'harmony',
          bpm: 88,
          url: dirs.music + 'harmony.mp3'
        }, {
          id: 'disharmony',
          bpm: 88,
          url: dirs.music + 'disharmony.mp3'
        }
      ]);
      music.tracks[1].fadeIn(6);
      scene = director.createScene();
      container = new CAAT.ActorContainer().setBounds(0, 0, window.innerWidth, window.innerHeight).setGestureEnabled(false);
      background = new Background(director);
      player = window.player = new Player('player', director);
      companion = window.companion = new Companion('companion', director, player);
      player.other = companion;
      scene.addChild(background.actor);
      scene.addChild(container);
      scene.addChild(player.actor);
      container.addChild(companion.actor);
      companion.setTrack(music.tracks[0], 3, 3);
      director.onRenderStart = function() {
        companion.update();
        player.update();
        return music.update();
      };
      player.setLocation(300, 300);
      CAAT.loop(1);
      director.mouseDown = function(e) {
        return player.push();
      };
      container.touchEnd = function(e) {
        return pullCharacter(e.changedTouches[0].pageX, e.changedTouches[0].pageY, player);
      };
      window.pullCharacter = pullCharacter = __bind(function(x, y, character) {
        return player.addWaypoint(x, y);
      }, this);
      return endPull = __bind(function(character) {
        return character.endPull();
      }, this);
    };
  };
}).call(this);

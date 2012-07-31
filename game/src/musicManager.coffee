define ->
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
        @director.addAudio(track.id, track.url)
        audio = @director.getAudioManager().getAudio(track.id)
        music = new Music(audio)
        music.bpm = track.bpm
        @tracks.push music

    #  setTimeout( function() {
    #    if ( from < to && that.volume < to ) {
    #    that.setVolume( that.volume += 1 );
    #      doFade();
    #  } else if ( from > to && that.volume > to ) {
    #that.setVolume( that.volume -= 1 );
    #  doFade();
    #  } else if ( callback instanceof Function ) {
    #callback.apply( that );
    #  }
    #  }, delay );
    #  }

    play: (id, duration = 2000) =>
      @tracks[id].play().loop().fadeIn(duration)
      @currentTracks[id] = @tracks[id]

    stop: (id, duration = 2000) =>
      @tracks[id].fadeOut(duration, => @tracks[id].stop())

    next: (fade = 2) =>
      @tracks[@currentIndex].fadeOut(fade)
      if @tracks[@currentIndex+1]? then @currentIndex += 1 else @currentIndex = 0
      @tracks[@currentIndex].fadeIn(fade)

  class Music
    constructor: (@audio) ->
      @audio.volume = 0
      @audio.loop = true
    play: =>
      @audio.play()
    pause: =>
      @audio.pause()
    stop: =>
      @audio.pause()
      @audio.currentTime = 0
    fadeIn: (duration, callback = null)=>
      @play()
      @fadeTo(1, duration, callback)
    fadeOut: (duration, callback = @stop) =>
      @fadeTo(0, duration, callback)
    fadeTo: (to, duration, callback) =>
      that = @audio
      _this = @
      from = that.volume
      inc = 0.01
      duration *= 1000
      delay = duration / (Math.abs( (from - to) / inc))
      doFade = ->
        setTimeout ->
            if from < to and that.volume < to
              if that.volume > 0.99
                that.volume = 1
              else
                that.volume += inc
              doFade()
            else if from > to and that.volume > to
              if that.volume < 0.01
                that.volume = 0
              else
                that.volume -= inc
              doFade()
            else
              if callback instanceof Function
                callback.apply(_this)
          , delay
      doFade()

  return MusicManager

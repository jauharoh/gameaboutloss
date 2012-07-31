(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  define(function() {
    var Music, MusicManager;
    MusicManager = (function() {
      function MusicManager(director) {
        this.director = director;
        this.next = __bind(this.next, this);
        this.stop = __bind(this.stop, this);
        this.play = __bind(this.play, this);
        this.addTracks = __bind(this.addTracks, this);
        this.manager = new CAAT.AudioManager().initialize(8);
        this.currentTracks = [];
        this.stopping = [];
        this.tracks = [];
        this.currentIndex = 0;
      }
      MusicManager.prototype.update = function() {};
      MusicManager.prototype.addTracks = function(tracks) {
        var audio, music, track, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = tracks.length; _i < _len; _i++) {
          track = tracks[_i];
          this.director.addAudio(track.id, track.url);
          audio = this.director.getAudioManager().getAudio(track.id);
          music = new Music(audio);
          music.bpm = track.bpm;
          _results.push(this.tracks.push(music));
        }
        return _results;
      };
      MusicManager.prototype.play = function(id, duration) {
        if (duration == null) {
          duration = 2000;
        }
        this.tracks[id].play().loop().fadeIn(duration);
        return this.currentTracks[id] = this.tracks[id];
      };
      MusicManager.prototype.stop = function(id, duration) {
        if (duration == null) {
          duration = 2000;
        }
        return this.tracks[id].fadeOut(duration, __bind(function() {
          return this.tracks[id].stop();
        }, this));
      };
      MusicManager.prototype.next = function(fade) {
        if (fade == null) {
          fade = 2;
        }
        this.tracks[this.currentIndex].fadeOut(fade);
        if (this.tracks[this.currentIndex + 1] != null) {
          this.currentIndex += 1;
        } else {
          this.currentIndex = 0;
        }
        return this.tracks[this.currentIndex].fadeIn(fade);
      };
      return MusicManager;
    })();
    Music = (function() {
      function Music(audio) {
        this.audio = audio;
        this.fadeTo = __bind(this.fadeTo, this);
        this.fadeOut = __bind(this.fadeOut, this);
        this.fadeIn = __bind(this.fadeIn, this);
        this.stop = __bind(this.stop, this);
        this.pause = __bind(this.pause, this);
        this.play = __bind(this.play, this);
        this.audio.volume = 0;
        this.audio.loop = true;
      }
      Music.prototype.play = function() {
        return this.audio.play();
      };
      Music.prototype.pause = function() {
        return this.audio.pause();
      };
      Music.prototype.stop = function() {
        this.audio.pause();
        return this.audio.currentTime = 0;
      };
      Music.prototype.fadeIn = function(duration, callback) {
        if (callback == null) {
          callback = null;
        }
        this.play();
        return this.fadeTo(1, duration, callback);
      };
      Music.prototype.fadeOut = function(duration, callback) {
        if (callback == null) {
          callback = this.stop;
        }
        return this.fadeTo(0, duration, callback);
      };
      Music.prototype.fadeTo = function(to, duration, callback) {
        var delay, doFade, from, inc, that, _this;
        that = this.audio;
        _this = this;
        from = that.volume;
        inc = 0.01;
        duration *= 1000;
        delay = duration / (Math.abs((from - to) / inc));
        doFade = function() {
          return setTimeout(function() {
            if (from < to && that.volume < to) {
              if (that.volume > 0.99) {
                that.volume = 1;
              } else {
                that.volume += inc;
              }
              return doFade();
            } else if (from > to && that.volume > to) {
              if (that.volume < 0.01) {
                that.volume = 0;
              } else {
                that.volume -= inc;
              }
              return doFade();
            } else {
              if (callback instanceof Function) {
                return callback.apply(_this);
              }
            }
          }, delay);
        };
        return doFade();
      };
      return Music;
    })();
    return MusicManager;
  });
}).call(this);

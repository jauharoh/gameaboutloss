define ['./character'], (Character) ->
  class Companion extends Character
    name: 'companion'
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
        music.next(4)
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
  return Companion


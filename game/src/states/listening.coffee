define ['../state'], (State) ->
  class Listening extends State
    constructor: (@owner, options) ->
      super(@owner)
      @bakePattern(options.pattern)
      @noteIndex = 0
      @notes = []
      @lastNote = 0
      @goodNotes = 0
      @listening = true
    bakePattern: (pattern) =>
      @pattern = []
      for timing in pattern
        if _i > 0
          last = @pattern[_i-1]
        else
          last = 0
        @pattern.push(last+timing)
    hearNote: =>
      @notes.push( @owner.director.time)
      if @notes.length > 1
        @checkNote()
    update: =>
      super()
    checkNote: =>
      i = @notes.length-2
      @lastNote += @notes[i+1] - @notes[i]
      if Math.abs(@lastNote - @pattern[i]) < 250
        @isGood()
      else
        @isBad()
    isGood: =>
      @owner.messenger.broadcast(@owner, {event: 'isGood'})
      @goodNotes += 1
      @owner.satisfaction += 1
      if @goodNotes >= @pattern.length
        if @listening = true
          @owner.satisfaction += 5
          if @owner.satisfaction > @owner.goal
            @owner.newPattern()
          setTimeout =>
            @owner.release()
            @owner.emitAura()
          , 500
          setTimeout =>
            @owner.enterState 'singing'
          , 3000
        @listening = false
    isBad: =>
      if @listening
        @owner.satisfaction -= 2
        @owner.reactNegative()
        setTimeout =>
            @owner.enterState 'singing'
          , 1000
      @listening = false

  return Listening



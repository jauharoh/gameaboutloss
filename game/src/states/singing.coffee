define ['../state'], (State) ->
  class Singing extends State
    constructor: (@owner) ->
      super(@owner)
      @timer = new Timer(@owner.director)
      @currentIndex = 0
      @start(@owner.pattern)
    start: (pattern) =>
      @timer.reset()
      @owner.push()
      @pattern = pattern
    update: =>
      super()
      @checkTimer()
    checkTimer: =>
      diff = @pattern[@currentIndex] - @timer.getTime()
      if diff <= 0
        @timer.reset(diff)
        @owner.push()
        @owner.emitAura()
        if @currentIndex >= @pattern.length-1
          @owner.enterState 'listening', {pattern: @pattern}
        else
          @currentIndex += 1
  return Singing


define [
  './character',
  './timer',
  './data/patterns']
, (Character, Timer, patternData) ->
  class Companion extends Character
    name: 'companion'
    scale: 0.7
    radian: Math.PI*1.8
    singing: false
    satisfaction: 0
    currentPattern: 0
    goal: 15
    goalIncrement: 20
    constructor: (name, director, other) ->
      @pattern = patternData[0]
      super(name, director, other)

    initialize: =>
      @enterState 'revolving'
      setTimeout =>
        @enterState 'singing'
      , 2000
    sing: =>
      @enterState 'singing'
    update: =>
      super()

    newPattern: =>
      console.log 'new pattern'
      @currentPattern += 1
      @pattern = patternData[@currentPattern]
      @goal += @goalIncrement

    hearNote: =>
      @currentState.hearNote()?

    react: =>
      if @reactionTimer.getTime() > 1000
        @release()
        @reactionTimer = new Timer(@director)

  return Companion


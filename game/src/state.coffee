define ->
  class State
    constructor: (@owner) ->

    update: =>
      @owner.updateRadialPosition()
    enter: (state, option = null) =>
      @owner.setCurrentState state, option
  return State

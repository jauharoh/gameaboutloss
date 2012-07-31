class Timer
  constructor: (@director) ->
    @reset()

  getTime: (offset = 0) ->
    @director.time - @startTime - offset

  reset: =>
    @startTime = @director.time

window.Timer = Timer
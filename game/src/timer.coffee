define ->
  class Timer
    constructor: (@director) ->
      @reset()

    getTime: (offset = 0) ->
      @director.time - @startTime - offset

    reset: (offset) =>
      offset = offset or 0
      @startTime = @director.time + offset
  return Timer

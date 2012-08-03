define ['state'], (State) ->
  class Navigating extends State
  constructor: (@owner) ->
  update: =>
    super()
    @owner.setVector(@owner.target[0], @owner.target[1])
    if @owner.isNearWaypoint()
      setTimeout =>
        #          @owner.release()
          @owner.emitAura()
        , 100
      @enter IdleState
    @owner.addForce @owner.maxForce
  return Navigating

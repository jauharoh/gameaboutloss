define ['../state'], (State) ->
  class Revolving extends State
    constructor: (@owner) ->
    update: =>
      @owner.updateRadialPosition()
  return Revolving


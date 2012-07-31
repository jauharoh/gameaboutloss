define ->
  class Pathway
  width: 10
  style: 'rgba(0,255,50,.5)'
  waypoints: []
  constructor: (director, @owner) ->
    @actor = new CAAT.Actor().setBounds(0,0,director.width,director.height)
    @actor.paint = @paint

  paint: (director, time) =>
    ctx = director.ctx
    ctx.strokeStyle = @style
    ctx.lineWidth = @width
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(@owner.getActorCenter()[0], @owner.getActorCenter()[1])
    if @owner.currentWaypoint
      @lineTo(ctx, @owner.currentWaypoint)
      for waypoint in @owner.waypoints
        @lineTo(ctx, waypoint)
    ctx.stroke()
  lineTo: (ctx, waypoint) ->
    ctx.lineTo(waypoint.x, waypoint.y)
  return Pathway

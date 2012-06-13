ig.module(
    'game.entities.vignette'
)

    .requires(
    'impact.entity',
    'color'
)

    .defines(function () {
        EntityVignette = ig.Entity.extend({
            size:{x:25, y:25},
            rgb: [0,0,0],
            radius: 600,
            alpha: 0,
            width: 400,
            blur: 500,

            init:function (x, y, settings) {
                this.parent(x,y,settings);
                this.color = new EntityColor(this.rgb);
                this.color.alpha(this.alpha);
                this.parent();
                this.mask = new Image();
                this.mask.src="media/vignetteMask.png";
                this.el = $('#vignette');
                var _this = this;
//                setInterval(function(){_this.redraw(_this)}, 100)
                var backgroundCtx = this.ctx = $('#vignette')[0].getContext('2d');
                backgroundCtx.canvas.height = window.innerHeight;
                backgroundCtx.canvas.width =  window.innerWidth;
            },

            update: function(){
                this.parent();
                if(this.ctx.canvas.height != window.innerHeight || this.ctx.canvas.width != window.innerWidth){
                    this.ctx.canvas.height = window.innerHeight;
                    this.ctx.canvas.width = window.innerWidth;
                }
            },

            draw: function(){

                var scale = {x: 1, y: 1}
                var ctx = this.ctx;
                ctx.save();
//                ctx.scale(scale.x, scale.y)
                ctx.clearRect(0,0,window.innerWidth, window.innerHeight)
                ctx.lineWidth = 0;
                this.color.rgb(this.rgb);
                this.color.alpha(this.alpha);
                ctx.fillStyle = this.color.rgbaString();
                ctx.fillRect(0,0, window.innerWidth, window.innerHeight);
                ctx.fill();
                ctx.globalCompositeOperation = 'destination-out';
                ctx.drawImage(this.mask, window.innerWidth/2 - ((this.mask.width*scale.x)/2), window.innerHeight/2 - this.mask.height/2);
                ctx.globalCompositeOperation = 'source-over';
                ctx.restore();
//                var ctx = $('#vignette')[0].getContext('2d');
//                ctx.save()
//                var s = ig.system.scale;
//                var x = this.pos.x*s - ig.game.screen.x*s;
//                var y = this.pos.y*s - ig.game.screen.y*s;
//                ctx.save();
//                ctx.fillStyle = 'rgba(0,0,0, 1)';
//                this.drawEllipse(ctx, window.innerWidth/2 - this.radius, window.innerHeight/2 - this.radius*.75 - 10000, this.radius*2, this.radius*1.5);
//                this.drawShadow(ctx, this.rgba);
//                ctx.lineWidth = this.width;
//                ctx.fill();
//                ctx.stroke();
//                ctx.restore();
            },
            drawEllipse: function(ctx, x, y, w, h){
                var kappa = .5522848;
                ox = (w / 2) * kappa, // control point offset horizontal
                    oy = (h / 2) * kappa, // control point offset vertical
                    xe = x + w,           // x-end
                    ye = y + h,           // y-end
                    xm = x + w / 2,       // x-middle
                    ym = y + h / 2;       // y-middle

                ctx.beginPath();
                ctx.moveTo(x, ym);
                ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
                ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
                ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
                ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
                ctx.closePath();
            },
//            draw:function () {
//                if(this.alpha > .02){
//    //                ctx.restore();
//                    var ctx = $('#background')[0].getContext('2d');
//                    var s = ig.system.scale;
//                    var x = this.pos.x*s - ig.game.screen.x*s;
//                    var y = this.pos.y*s - ig.game.screen.y*s;
//                    ctx.save();
//                    this.color.rgb(this.rgb);
//                    this.color.alpha(this.alpha);
//                    console.log(this.color.rgbaString())
//                    ctx.fillStyle = this.color.rgbaString();
//                    ctx.beginPath();
//                    this.drawPath(ctx, this.radius, x, y,s);
//                    ctx.closePath();
//                    this.drawShadow(ctx);
//                    ctx.lineWidth = this.width;
////                ctx.fill();
//                    ctx.stroke();
//                }
//            },

            drawShadow: function(ctx, rgba){
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 10000;
                this.color.alpha = 0;
                var rgba = 'rgba('+this.rgb[0]+','+this.rgb[1]+','+this.rgb[2]+','+this.alpha+')';
                ctx.shadowColor = rgba;
                ctx.shadowBlur = this.blur;
            },

            drawPath: function(ctx, radius,x, y,s) {
                ctx.arc(x,y, radius,0,2*Math.PI,false);
            },
        })
    })
            
        
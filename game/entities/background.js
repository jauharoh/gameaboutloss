ig.module (
    'game.entities.background'
)

.requires(
    'impact.entity',
    'color'
)

.defines(function(){
        EntityBackground = ig.Entity.extend({
            rgba: 'rgba(255,255,255, 1)',
            color: null,
            size:{x: 100, y: 100},
            innerRgba: 'rgba(255,0,0,1)',
            outerRgba: 'rgba(255,255,255,1)',
            innerColor: null,
            outerColor: null,
            grad: null,

            init: function(x,y, settings){
                this.parent(x,y,settings);
                this.color = new EntityColor(this.rgba);
                this.innerColor = new EntityColor(this.innerRgba);
                this.innerColor.rotate(45);
                this.innerColor.lightness(99);
                this.outerColor = new EntityColor(this.outerRgba);
                this.setGrad();

            },


            draw: function(){
//                this.drawShape();
                color.rgb(this.rgb);
                color.alpha(this.alpha);
                $('#background').css({'background-color': color.hexString(), 'width': window.innerWidth, 'height':window.innerHeight })
            },

            setGrad: function(){
                var width = ig.system.width;
                var height = ig.system.height;
                this.grad = ig.system.context.createRadialGradient(width/2, height/2, 100,
                    width/2, height/2, 300);
                this.grad.addColorStop(0, this.innerColor.rgbaString());
                this.grad.addColorStop(1, this.outerColor.rgbaString());
            },

            drawShape: function(){
                var ctx = ig.system.context;
                var s = ig.system.scale;
                var x = this.pos.x*s - ig.game.screen.x*s;
                var y = this.pos.y*s - ig.game.screen.y*s;
                var size = {x: this.size.x*s, y: this.size.y*s};


                ctx.beginPath();
                ctx.rect( x, y, size.x, size.y);
                ctx.fillStyle = this.color.rgbaString();
                ctx.closePath();
                ctx.fill();
            }
        })
    })
ig.module (
    'game.entities.circle'
)

.requires (
    'impact.entity',
    'color'
)

.defines(function(){
        EntityCircle = ig.Entity.extend({
            rgb: [255,255,255],
            color:      null,
            timer:      null,
            lifetime:   1,
            radius: 10,
            alpha:      1.0,
            force:      0.0,
            maxForce:   8.0,
            friction:   30,
            accuracy:   0.0,
            offset: null,
            width: 5,

            init: function(x,y,settings){
                this.parent(x,y,settings);
                this.timer = new ig.Timer();
                this.color = new Color();
                this.color.rgb(this.rgb);
                this.color.alpha(this.alpha);
                this.force = 5;
            },
            draw: function(){
//                this.parent();
                this.drawShape();

            },
            drawShape: function(){
                var ctx = ig.system.context;
                this.color.alpha(this.alpha);
                ctx.beginPath();
                ctx.arc(this.pos.x,this.pos.y, this.radius,0,2*Math.PI,false);
                ctx.closePath();
                ctx.lineWidth = this.width;
                ctx.strokeStyle = this.color.rgbaString();
                ctx.stroke();
                ctx.restore();
                this.radius += this.force;

            },

            update: function(){
                this.parent();
                if(this.timer.delta() >= this.lifetime){
                    this.kill();
                }
                this.alpha = 1-(this.timer.delta()/this.lifetime)
                this.force -= this.force/this.friction;
            }

        })
    })
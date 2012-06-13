ig.module (
    'game.entities.aura'
)

.requires (
    'impact.entity',
    'color'
)

.defines(function(){
        EntityAura = ig.Entity.extend({
            points:     [],
            rgba:       'rgba(0,0,255,.8)',
            color:      null,
            timer:      null,
            lifetime:   1,
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
                this.color = new EntityColor(this.rgba);
                this.color.alpha(this.alpha);
                this.force = this.maxForce*(this.accuracy*this.accuracy);
                if(this.offset){
                    this.points[0].x -= this.offset;
                    this.points[0].y -= this.offset;
                    this.points[1].x += this.offset;
                    this.points[1].y -= this.offset;
                    this.points[2].y += this.offset;
                }
            },
            draw: function(){
//                this.parent();
                this.drawShape();

            },
            drawShape: function(){
                var ctx = ig.system.context;
                this.color.alpha(this.alpha);
                ctx.beginPath();
                ctx.moveTo(this.points[0].x, this.points[0].y);
                ctx.lineTo(this.points[1].x, this.points[1].y);
                ctx.lineTo(this.points[2].x, this.points[2].y);
                ctx.closePath();
                ctx.lineWidth = this.width;
                ctx.strokeStyle = this.color.rgbaString();
                ctx.stroke();
                ctx.restore();

                this.points[0].x -= this.force;
                this.points[0].y -= this.force;
                this.points[1].x += this.force;
                this.points[1].y -= this.force;
                this.points[2].y += this.force;
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
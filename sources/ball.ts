class Ball implements IGameComponent{

    protected position : Vector; 
    protected velocity : Vector;
    protected radius : number;
    protected color : string;
    protected accelerate : Vector;

    constructor(position : Vector, velocity : Vector, radius : number, color: string){
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.accelerate = new Vector();
    }

    static CreateRandom(bounds: Vector, minRadius: number, maxRadius: number, minVelocity: Vector, maxVelocity: Vector)
    {
        let radius = Math.random() * (maxRadius - minRadius) + minRadius;
        let position = new Vector(Math.random() * (bounds.x - radius) + radius, Math.random() * (bounds.y - radius) + radius);
        let velocity = new Vector((Math.random() * (maxVelocity.x - minVelocity.x) + minVelocity.x) * (Math.random() > 0.5 ? 1 : -1 ), (Math.random() * (maxVelocity.y - minVelocity.y) + minVelocity.y) * (Math.random() > 0.5 ? 1 : -1 ));

        return new Ball(position, velocity, radius, Helpers.RandomColor());
    }

    update(context : UpdateContext) : boolean{

        this.velocity = this.velocity.add(this.accelerate);
        this.accelerate = new Vector()

        if(this.position.x - this.radius <= 0 || this.position.x + this.radius >= context.width){
            this.velocity.x *= -1;
        }

        if(this.position.y - this.radius <= 0 || this.position.y + this.radius >= context.height){
            this.velocity.y *= -1;
        }

        // Update the movement
        this.position = this.position.add(this.velocity.scale(context.deltaMilliseconds / 1000));
        return false;
    }

    draw(context : DrawContext){

        context.graphics.beginPath();
        context.graphics.fillStyle = this.color;
        context.graphics.ellipse(
            this.position.x,
            this.position.y,
            this.radius,
            this.radius,
            0,
            0,
            Math.PI * 2);
        context.graphics.fill();
        context.graphics.closePath();
    }

    getBounds() : BoundingCircle{
        return new BoundingCircle(this.position, this.radius);
    }

    collisionNotify(distance : number, component : IGameComponent){
        return;
    }

    applyForce(force : Vector){
        this.accelerate = this.accelerate.add(force);
    }
}
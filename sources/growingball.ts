class GrowingBall extends Ball{

    protected radiusVelocity : number;
    protected maxRadius : number;

    private isGrowing : boolean;
    private isDoneGrowing : boolean;
    private originalHitter : IGameComponent;

    constructor(position : Vector, velocity : Vector, radius : number, maxRadius : number, color: string){
        super(position, velocity, radius, color);
        this.radiusVelocity = 0;
        this.isGrowing = false;
        this.isDoneGrowing = false;
        this.originalHitter = null;
        this.maxRadius = maxRadius;
    }

    static CreateRandom(bounds: Vector, minRadius: number, maxRadius: number, minVelocity: Vector, maxVelocity: Vector)
    {
        let radius = Math.random() * (maxRadius - minRadius) + minRadius;
        let position = new Vector(Math.random() * (bounds.x - radius) + radius, Math.random() * (bounds.y - radius) + radius);
        let velocity = new Vector((Math.random() * (maxVelocity.x - minVelocity.x) + minVelocity.x) * (Math.random() > 0.5 ? 1 : -1 ), (Math.random() * (maxVelocity.y - minVelocity.y) + minVelocity.y) * (Math.random() > 0.5 ? 1 : -1 ));

        let color = 'rgba(0, 0, 255, 0.2)'
        // let color = Helpers.RandomColor();

        return new GrowingBall(position, velocity, radius, radius * 3, color);
    }

    update(context : UpdateContext) : boolean{
        this.radius += ((this.maxRadius - this.radius) * this.radiusVelocity * context.deltaMilliseconds / 1000)

        if(this.isDoneGrowing || this.isGrowing){
            this.velocity = new Vector();
        }

        super.update(context);
        return false;
    }

    collisionNotify(distance : number, component : IGameComponent){

        if(this.isDoneGrowing){
            return;
        }
        else if(this.isGrowing){
            this.stopGrowing(component);
        }
        else{
            this.startGrowing(component);
        }
    }

    private stopGrowing(impactor : IGameComponent){
        if(this.originalHitter === impactor){
            return;
        }

        this.color = 'rgba(0, 255, 0, 0.2)'
        this.isDoneGrowing = true;
        this.radiusVelocity = 0;
    }

    private startGrowing(impactor : IGameComponent){

        if(impactor instanceof GrowingBall){
            let gb = impactor as GrowingBall;
            if(!gb.isDoneGrowing || !gb.isGrowing){
                return;
            }
        }

        this.color = 'rgba(255, 0, 0, 0.2)'
        this.originalHitter = impactor;
        this.isDoneGrowing = false;
        this.radiusVelocity = 0.4;
        this.isGrowing = true;
        this.velocity = new Vector();
    }

    applyForce(force : Vector){
        if(this.isGrowing || this.isDoneGrowing){
            // Dont apply force during growth
            return;
        }
        
        super.applyForce(force);
    }
}
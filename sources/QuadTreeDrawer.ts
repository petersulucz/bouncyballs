class QuadTreeDrawer implements IGameComponent{ 

    private tree : QuadTree;
    constructor(tree : QuadTree){
        this.tree = tree;
    }

    update(context : UpdateContext) : boolean{
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

    }

    collisionNotify(distance : number, component : IGameComponent){
    }

    applyForce(force : Vector){
    }
}
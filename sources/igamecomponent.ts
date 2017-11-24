interface IGameComponent{
    update(context : UpdateContext) : boolean;
    draw(context : DrawContext);
    getBounds() : BoundingCircle;
    collisionNotify(distance : number, component : IGameComponent);
    applyForce(force : Vector);
}
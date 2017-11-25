interface IPhysicsObject{
    getBounds() : BoundingCircle;
    collisionNotify(distance : number, component : IPhysicsObject);
    applyForce(force : Vector);
}
class PhysicsController{

    private static readonly G = 0.006;

    processCollisions(components : Array<IPhysicsObject>){
        for(let i = 0; i < components.length; i++){
            let a = components[i];
            for(let c = i+1; c < components.length; c++){
                let b = components[c];

                let aBounds = a.getBounds();
                let bbounds = b.getBounds();

                let dist = Vector.dist(aBounds.position, bbounds.position);
                
                // Accelerations
                let aToB = bbounds.position.subtract(aBounds.position).normalize().scale(PhysicsController.G * aBounds.mass * bbounds.mass / Math.max((dist * dist), (Math.pow(aBounds.radius + bbounds.radius, 2)))); 
                a.applyForce(aToB);
                b.applyForce(aToB.invert());

                if(dist <= aBounds.radius + bbounds.radius){
                    a.collisionNotify(dist, b);
                    b.collisionNotify(dist, a);
                }
            }
        }
    }
}
class BoundingCircle{
    readonly position : Vector;
    readonly radius : number;
    readonly mass : number;

    constructor(position : Vector, radius : number){
        this.position = position.clone();
        this.radius = radius;

        this.mass = Math.PI * this.radius * this.radius;
    }
}
class Vector{
    public x : number;
    public y : number;

    constructor(x : number = 0, y : number = 0){
        this.x = x;
        this.y = y;
    }

    static dist(a : Vector, b : Vector) : number{
        return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    }

    add(v : Vector) : Vector{
        return new Vector(v.x + this.x, v.y + this.y);
    }

    subtract(v : Vector) : Vector {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    scale(scale : number){
        return new Vector(this.x * scale, this.y * scale);
    }

    clone(){
        return new Vector(this.x, this.y);
    }

    invert(){
        return new Vector(-1 * this.x, -1 * this.y);
    }

    magnitude(){
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize(){
        var mag = this.magnitude();
        return new Vector(this.x / mag, this.y / mag);
    }
}
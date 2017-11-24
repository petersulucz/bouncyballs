class Helpers{
    static BoxContains(topleft: Vector, bottomRight: Vector, position: Vector, radius : number){
        return position.x - radius >= topleft.x && position.y - radius >= topleft.y && position.x + radius <= bottomRight.x && position.y + radius <= bottomRight.y;
    }

    static RandomColor() : string {
        let r = Math.random() * 256;
        let b = Math.random() * 256;
        let g = Math.random() * 256;
        let a = 0.4;

        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    }
}
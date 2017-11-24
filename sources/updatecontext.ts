class UpdateContext{
    public readonly deltaMilliseconds : number;
    public readonly width : number;
    public readonly height : number;
    public readonly currentTime : number;

    constructor(deltaMS : number, width : number, height : number, currentTime : number){
        this.deltaMilliseconds = deltaMS;
        this.width = width;
        this.height = height;
        this.currentTime = currentTime;
    }
}
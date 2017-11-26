class Main
{
    private canvas: HTMLCanvasElement;
    private controller : GameController;

    constructor() {
        this.initializeCanvas();
        this.controller = new GameController(this.canvas);
    }

    public run(){
        this.controller.run();
    }

    public stop(){
        this.controller.stop();
    }

    public initializeTest()
    {
        for(let i = 0; i < 250; i++){
            
        }

        window.onkeydown = (event) => {
            if(event.charCode === 0){
                // Spacebar
                this.AddRandomBall();
            }
        }

        this.canvas.onclick = (event) => {
            let ball = new Ball(new Vector(event.offsetX - 15, event.offsetY - 15), new Vector(), 15, 'red')
            this.controller.addComponent(ball);
        }
    }

    public AddRandomBall(){
        var ball = Ball.CreateRandom(new Vector(this.canvas.width, this.canvas.height), 10, 25, new Vector(30, 30), new Vector(180, 180));
        this.controller.addComponent(ball);
    }

    private initializeCanvas(){
        this.canvas = document.createElement('canvas') as HTMLCanvasElement;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        document.body.appendChild(this.canvas);
    }
}

function Run(){
    let m = new Main();
    m.initializeTest()
    m.run();
}

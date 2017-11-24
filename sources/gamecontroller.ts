class GameController
{
    private drawInterval: number;
    private updateInterval: number;

    private graphics : CanvasRenderingContext2D;
    private canvas : HTMLCanvasElement;

    private components : Array<IGameComponent>;
    private phsyicsController : PhysicsController;

    private previousContext : UpdateContext;

    constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas;
        this.graphics = canvas.getContext("2d");

        this.components = new Array<IGameComponent>();
        this.phsyicsController = new PhysicsController();
    }

    public run(){
        // The default update context
        this.previousContext = new UpdateContext(0, this.canvas.width, this.canvas.height, Date.now());
        if(!this.drawInterval){
            this.drawInterval = window.setInterval(() => this.draw(), 10);
        }
        if(!this.updateInterval){
            this.updateInterval = window.setInterval(() => this.update(), 10);
        }
    }

    public stop(){
        if(this.drawInterval){
            window.clearInterval(this.drawInterval);
            this.drawInterval = null;
        }
        if(this.updateInterval){
            window.clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    public addComponent(component : IGameComponent){
        this.components.push(component);
    }

    public clear(){
        for(let i = 0; i < this.components.length; i++){
            this.components.pop();
        }
    }

    private update(){

        this.phsyicsController.processCollisions(this.components);

        let now = Date.now();
        let updateContext = new UpdateContext(now - this.previousContext.currentTime, this.canvas.width, this.canvas.height, now);
        this.previousContext = updateContext;

        for(let i = this.components.length - 1; i >= 0; i--){
            if(this.components[i].update(updateContext)){
                this.components.splice(i, 1);
            }
        }
    }

    private draw(){

        let drawContenxt = new DrawContext(this.graphics);
        this.graphics.fillStyle = 'rgba(100, 100, 100, 0.2)';
        this.graphics.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for(let i = this.components.length - 1; i >= 0; i--){
            this.components[i].draw(drawContenxt);
        }
    }
}
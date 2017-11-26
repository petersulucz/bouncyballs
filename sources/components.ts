class Helpers{
    static BoxContains(topleft: Vector, bottomRight: Vector, position: Vector, radius : number){
        return position.x - radius >= topleft.x && position.y - radius >= topleft.y && position.x + radius <= bottomRight.x && position.y + radius <= bottomRight.y;
    }

    static RandomColor(red : number = undefined, green : number = undefined, blue : number = undefined) : string {
        let r = red != undefined ? red : Math.random() * 256;
        let b = blue != undefined ? blue : Math.random() * 256;
        let g = green != undefined ? green : Math.random() * 256;
        let a = 0.4;

        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    }

    static Remove<T>(array : Array<T>, item : T){
        let index = array.indexOf(item);
        if(index == -1){
            throw "Element does not exist";
        }
        array.splice(index, 1);
    }
}

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

    static dot(a : Vector, b : Vector) : number{
        return a.x * b.x + a.y * b.y;
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

class BoundingCircle{
    readonly position : Vector;
    readonly radius : number;
    readonly mass : number;

    constructor(position : Vector, radius : number){
        this.position = position.clone();
        this.radius = radius;

        this.mass = Math.PI * this.radius * this.radius;
    }

    topLeft() : Vector{
        return new Vector(this.position.x - this.radius, this.position.y - this.radius);
    }

    bottomRight() : Vector{
        return new Vector(this.position.x + this.radius, this.position.y + this.radius);
    }
}

class PhysicsProperties{
    position : Vector;
    velocity : Vector;
    acceleration : Vector;
    radius : number;
    mass : number;

    constructor(){
        this.position = new Vector();
        this.velocity = new Vector();
        this.radius = 0;
        this.mass = 100000;
        this.acceleration = new Vector();
    }
    
    getBounds() : BoundingCircle{
        let circle = new BoundingCircle(this.position, this.radius);
        return circle;
    }

    processColission(other : PhysicsProperties)
    {
        let mcalc = this.mass * 2 / (this.mass + other.mass);

        let postDiff = this.position.subtract(other.position);
        let velocityDiff = this.velocity.subtract(other.velocity);
        let dot = Vector.dot(velocityDiff, postDiff);
        let magnitude = postDiff.magnitude();

        let scalar = mcalc * dot / (magnitude * magnitude);

        let v1 = this.velocity.subtract(postDiff.scale(scalar));
    
        postDiff = other.position.subtract(this.position);
        velocityDiff = other.velocity.subtract(this.velocity);
        dot = Vector.dot(velocityDiff, postDiff);
        magnitude = postDiff.magnitude();
        scalar = mcalc * dot / (magnitude * magnitude);

        let v2 = other.velocity.subtract(postDiff.scale(scalar));

        this.velocity = v1;
        other.velocity = v2;
    }
}

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

class DrawContext{
    public readonly graphics : CanvasRenderingContext2D;

    constructor(context : CanvasRenderingContext2D){
        this.graphics = context;
    }
}

abstract class GameComponent{
    abstract update(context : UpdateContext) : boolean; 
    
    public physics : PhysicsProperties;
}

abstract class DrawableGameComponent extends GameComponent{
    abstract draw(context : DrawContext);
}

class PhysicsController extends GameComponent{
    
    readonly quadTree : QuadTree;
    readonly compontents : Array<PhysicsProperties>

    constructor(worldSize : Vector){
        super();
        this.quadTree = new QuadTree(10, worldSize);
        this.compontents = new Array<PhysicsProperties>();
    }

    update(context : UpdateContext) : boolean{

        this.quadTree.Update();

        return false;
    }

    add(item : PhysicsProperties){
        this.compontents.push(item);
        this.quadTree.add(item);
    }
}

class Ball extends DrawableGameComponent{
    
    physics : PhysicsProperties;
    protected color : string;

    constructor(position : Vector, velocity : Vector, radius : number, color: string){
        super();
        this.physics = new PhysicsProperties();
        this.physics.position = position;
        this.physics.velocity = velocity;
        this.physics.radius = radius;
        this.color = color;
    }

    static CreateRandom(bounds: Vector, minRadius: number, maxRadius: number, minVelocity: Vector, maxVelocity: Vector)
    {
        let radius = Math.random() * (maxRadius - minRadius) + minRadius;
        let position = new Vector(Math.random() * (bounds.x - radius) + radius, Math.random() * (bounds.y - radius) + radius);
        let velocity = new Vector((Math.random() * (maxVelocity.x - minVelocity.x) + minVelocity.x) * (Math.random() > 0.5 ? 1 : -1 ), (Math.random() * (maxVelocity.y - minVelocity.y) + minVelocity.y) * (Math.random() > 0.5 ? 1 : -1 ));

        return new Ball(position, velocity, radius, Helpers.RandomColor(0, 0));
    }

    update(context : UpdateContext) : boolean{

        this.physics.velocity = this.physics.velocity.add(this.physics.acceleration);
        this.physics.acceleration = new Vector()

        if(this.physics.position.x - this.physics.radius <= 0 || this.physics.position.x + this.physics.radius >= context.width){
            this.physics.velocity.x *= -1;
        }

        if(this.physics.position.y - this.physics.radius <= 0 || this.physics.position.y + this.physics.radius >= context.height){
            this.physics.velocity.y *= -1;
        }

        // Update the movement
        this.physics.position = this.physics.position.add(this.physics.velocity.scale(context.deltaMilliseconds / 1000));
        return false;
    }

    draw(context : DrawContext){

        context.graphics.beginPath();
        context.graphics.fillStyle = this.color;
        context.graphics.ellipse(
            this.physics.position.x,
            this.physics.position.y,
            this.physics.radius,
            this.physics.radius,
            0,
            0,
            Math.PI * 2);
        context.graphics.fill();
        context.graphics.closePath();
    }
}

class QuadTree
{
    private maxLevels : number;
    readonly size : Vector;

    private root : QuadTreeNode;

    private components : Array<ComponentWrapper>

    constructor(maxLevels : number, size : Vector){
        this.maxLevels = maxLevels;
        this.root = new QuadTreeNode(1, null, new Vector(), size.clone());

        this.components = new Array<ComponentWrapper>();
    }

    getRoot() : QuadTreeNode{
        return this.root;
    }

    add(component : PhysicsProperties){
        let wrapper = new ComponentWrapper(component, null);
        this.components.push(wrapper);
        this.getFittingNode(wrapper);
    }

    Update(){
        for(let i = 0; i < this.components.length; i++){
            let component = this.components[i];

            this.root.GetNode(component);
        }

        this.UpdateRecursive(this.root, new Array<PhysicsProperties>());
    }

    private UpdateRecursive(node : QuadTreeNode, list : Array<PhysicsProperties>){

        if(node == null){
            return;
        }

        for(let i = 0; i < node.components.length; i++){
            for(let c = i + 1; c < node.components.length; c++){
                this.TestCollision(node.components[i].component, node.components[c].component);
            }

            for(let c = 0; c < list.length; c++){
                this.TestCollision(node.components[i].component, list[c]);
            }
        }

        for(let i = 0; i < node.components.length; i++){
            list.push(node.components[i].component);
        }

        this.UpdateRecursive(node.TopLeft, list);
        this.UpdateRecursive(node.BottomLeft, list);
        this.UpdateRecursive(node.TopRight, list);
        this.UpdateRecursive(node.BottomRight, list);

        for(let i = 0; i < node.components.length; i++){
            list.pop();
        }
    }

    private TestCollision(a : PhysicsProperties, b : PhysicsProperties)
    {
        let boundsA = a.getBounds();
        let boundsB = b.getBounds();

        let dist = Vector.dist(boundsA.position, boundsB.position);

        if(dist > boundsA.radius + boundsB.radius){
            return;
        }

        b.processColission(a);
    }

    private getFittingNode(component : ComponentWrapper) : QuadTreeNode{
        let node = this.root.GetNode(component);
        return node;
    }
}

class QuadTreeNode
{
    private topLeft : QuadTreeNode;
    private topRight : QuadTreeNode;
    private bottomLeft : QuadTreeNode;
    private bottomRight : QuadTreeNode;
    private cells : Array<QuadTreeNode>;

    public readonly depth : number;
    public readonly topLeftBound : Vector;
    public readonly bottomRightBound : Vector;
    public readonly centerBound : Vector;
    public readonly components : Array<ComponentWrapper>
    public readonly parent : QuadTreeNode;

    constructor(depth : number, parent : QuadTreeNode, topLeftBound : Vector, bottomRightBound : Vector){
        this.depth = depth;
        this.cells = new Array(4);
        this.topLeftBound = topLeftBound;
        this.bottomRightBound = bottomRightBound;
        this.centerBound = new Vector((this.topLeftBound.x + this.bottomRightBound.x) / 2, (this.topLeftBound.y + this.bottomRightBound.y) / 2);
        this.components = new Array<ComponentWrapper>();
        this.parent = parent;
    }

    get TopLeft():QuadTreeNode{
        return this.cells[0];
    }

    get BottomLeft():QuadTreeNode{
        return this.cells[1];
    }

    get TopRight():QuadTreeNode{
        return this.cells[2];
    }

    get BottomRight():QuadTreeNode{
        return this.cells[3];
    }

    GetNode(wrapper : ComponentWrapper) : QuadTreeNode{
        let bounds = wrapper.component.getBounds();
        let tlNode = this.GetCellIndex(bounds.topLeft());
        let brNode = this.GetCellIndex(bounds.bottomRight());
        if(tlNode == brNode){
            return this.GetCell(tlNode).GetNode(wrapper);
        }

        this.components.push(wrapper);

        if(wrapper.node != null){
            Helpers.Remove(wrapper.node.components, wrapper);
            wrapper.node.Prune();
        }

        wrapper.node = this;
        return this;
    }

    private GetCellIndex(point : Vector){
        let left = point.x < this.centerBound.x;
        let top = point.y < this.centerBound.y;

        // 0 2
        // 1 3
        return (top ? 0 : 1) + (left ? 0 : 2);
    }

    private Prune(){
        if(this.components.length > 0 || this.parent == null){
            return;
        }

        this.parent.PruneChild(this);
    }

    private PruneChild(child : QuadTreeNode){
        let index = this.cells.indexOf(child);
        this.cells[index] = null;
        this.Prune();
    }

    private GetCell(index : number) : QuadTreeNode{
        if(this.cells[index] == null){
            this.cells[index] = new QuadTreeNode(
                this.depth + 1,
                this,
                new Vector(
                    index < 2 ? this.topLeftBound.x : this.centerBound.x,
                    index % 2 == 0 ? this.topLeftBound.y : this.centerBound.y),
                new Vector(
                    index < 2 ? this.centerBound.x : this.bottomRightBound.x,
                    index % 2 == 0 ? this.centerBound.y : this.bottomRightBound.y
                ));
        }

        return this.cells[index];
    }
}

class ComponentWrapper{
    public component : PhysicsProperties;
    public node : QuadTreeNode;
    
    constructor(component : PhysicsProperties, node : QuadTreeNode){
        this.component = component;
        this.node = node;
    }
}

class QuadTreeDrawer extends DrawableGameComponent{ 
    physics : PhysicsProperties;

    private tree : QuadTree;
    constructor(tree : QuadTree){
        super();
        this.tree = tree;
        this.physics = null;
    }

    update(context : UpdateContext) : boolean{
        return false;
    }

    draw(context : DrawContext){
        context.graphics.beginPath();
        context.graphics.strokeStyle = 'red';
        this.drawRecursive(this.tree.getRoot(), context.graphics);
        context.graphics.closePath();
    }

    private drawRecursive(node : QuadTreeNode, graphics : CanvasRenderingContext2D){
        if(node == null){
            return;
        }

        this.drawRecursive(node.TopLeft, graphics);
        this.drawRecursive(node.BottomLeft, graphics);

        graphics.strokeRect(node.topLeftBound.x, node.topLeftBound.y, (node.bottomRightBound.x - node.topLeftBound.x), (node.bottomRightBound.y - node.topLeftBound.y));

        this.drawRecursive(node.TopRight, graphics);
        this.drawRecursive(node.BottomRight, graphics);
    }
}
        
class GameController
{
    private drawInterval: number;
    private updateInterval: number;

    private graphics : CanvasRenderingContext2D;
    private canvas : HTMLCanvasElement;

    private components : Array<GameComponent>;
    private drawables : Array<DrawableGameComponent>
    private phsyicsController : PhysicsController;

    private previousContext : UpdateContext;

    constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas;
        this.graphics = canvas.getContext("2d");

        this.components = new Array<GameComponent>();
        this.phsyicsController = new PhysicsController(new Vector(this.canvas.width, this.canvas.height));
        this.drawables = new Array<DrawableGameComponent>();

        this.drawables.push(new QuadTreeDrawer(this.phsyicsController.quadTree));
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

    public addComponent(component : GameComponent){
        this.components.push(component);

        if(component instanceof DrawableGameComponent){
            this.drawables.push(component);
        }

        if(component.physics != null){
            this.phsyicsController.add(component.physics);
        }
    }

    public clear(){
        for(let i = 0; i < this.components.length; i++){
            this.components.pop();
        }
    }

    private update(){
        let now = Date.now();
        let updateContext = new UpdateContext(now - this.previousContext.currentTime, this.canvas.width, this.canvas.height, now);
        this.previousContext = updateContext;

        this.phsyicsController.update(updateContext);

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

        for(let i = this.drawables.length - 1; i >= 0; i--){
            this.drawables[i].draw(drawContenxt);
        }
    }
}
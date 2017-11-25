class Main {
    constructor() {
        this.initializeCanvas();
        this.controller = new GameController(this.canvas);
    }
    run() {
        this.controller.run();
    }
    stop() {
        this.controller.stop();
    }
    initializeTest() {
        for (let i = 0; i < 250; i++) {
        }
        window.onkeydown = (event) => {
            if (event.charCode === 0) {
                // Spacebar
                this.AddRandomBall();
            }
        };
        this.canvas.onclick = (event) => {
            let ball = new GrowingBall(new Vector(event.offsetX - 15, event.offsetY - 15), new Vector(), 15, 90, 'red');
            ball.collisionNotify(0, null);
            this.controller.addComponent(ball);
        };
    }
    AddRandomBall() {
        var ball = GrowingBall.CreateRandom(new Vector(this.canvas.width, this.canvas.height), 10, 25, new Vector(30, 30), new Vector(180, 180));
        this.controller.addComponent(ball);
    }
    initializeCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        document.body.appendChild(this.canvas);
    }
}
function Run() {
    let m = new Main();
    m.initializeTest();
    m.run();
}
class Ball {
    constructor(position, velocity, radius, color) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.accelerate = new Vector();
    }
    static CreateRandom(bounds, minRadius, maxRadius, minVelocity, maxVelocity) {
        let radius = Math.random() * (maxRadius - minRadius) + minRadius;
        let position = new Vector(Math.random() * (bounds.x - radius) + radius, Math.random() * (bounds.y - radius) + radius);
        let velocity = new Vector((Math.random() * (maxVelocity.x - minVelocity.x) + minVelocity.x) * (Math.random() > 0.5 ? 1 : -1), (Math.random() * (maxVelocity.y - minVelocity.y) + minVelocity.y) * (Math.random() > 0.5 ? 1 : -1));
        return new Ball(position, velocity, radius, Helpers.RandomColor());
    }
    update(context) {
        this.velocity = this.velocity.add(this.accelerate);
        this.accelerate = new Vector();
        if (this.position.x - this.radius <= 0 || this.position.x + this.radius >= context.width) {
            this.velocity.x *= -1;
        }
        if (this.position.y - this.radius <= 0 || this.position.y + this.radius >= context.height) {
            this.velocity.y *= -1;
        }
        // Update the movement
        this.position = this.position.add(this.velocity.scale(context.deltaMilliseconds / 1000));
        return false;
    }
    draw(context) {
        context.graphics.beginPath();
        context.graphics.fillStyle = this.color;
        context.graphics.ellipse(this.position.x, this.position.y, this.radius, this.radius, 0, 0, Math.PI * 2);
        context.graphics.fill();
        context.graphics.closePath();
    }
    getBounds() {
        return new BoundingCircle(this.position, this.radius);
    }
    collisionNotify(distance, component) {
        return;
    }
    applyForce(force) {
        this.accelerate = this.accelerate.add(force);
    }
}
class BoundingCircle {
    constructor(position, radius) {
        this.position = position.clone();
        this.radius = radius;
        this.mass = Math.PI * this.radius * this.radius;
    }
}
class DrawContext {
    constructor(context) {
        this.graphics = context;
    }
}
class GameController {
    constructor(canvas) {
        this.canvas = canvas;
        this.graphics = canvas.getContext("2d");
        this.components = new Array();
        this.phsyicsController = new PhysicsController();
    }
    run() {
        // The default update context
        this.previousContext = new UpdateContext(0, this.canvas.width, this.canvas.height, Date.now());
        if (!this.drawInterval) {
            this.drawInterval = window.setInterval(() => this.draw(), 10);
        }
        if (!this.updateInterval) {
            this.updateInterval = window.setInterval(() => this.update(), 10);
        }
    }
    stop() {
        if (this.drawInterval) {
            window.clearInterval(this.drawInterval);
            this.drawInterval = null;
        }
        if (this.updateInterval) {
            window.clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    addComponent(component) {
        this.components.push(component);
    }
    clear() {
        for (let i = 0; i < this.components.length; i++) {
            this.components.pop();
        }
    }
    update() {
        this.phsyicsController.processCollisions(this.components);
        let now = Date.now();
        let updateContext = new UpdateContext(now - this.previousContext.currentTime, this.canvas.width, this.canvas.height, now);
        this.previousContext = updateContext;
        for (let i = this.components.length - 1; i >= 0; i--) {
            if (this.components[i].update(updateContext)) {
                this.components.splice(i, 1);
            }
        }
    }
    draw() {
        let drawContenxt = new DrawContext(this.graphics);
        this.graphics.fillStyle = 'rgba(100, 100, 100, 0.2)';
        this.graphics.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = this.components.length - 1; i >= 0; i--) {
            this.components[i].draw(drawContenxt);
        }
    }
}
class GrowingBall extends Ball {
    constructor(position, velocity, radius, maxRadius, color) {
        super(position, velocity, radius, color);
        this.radiusVelocity = 0;
        this.isGrowing = false;
        this.isDoneGrowing = false;
        this.originalHitter = null;
        this.maxRadius = maxRadius;
    }
    static CreateRandom(bounds, minRadius, maxRadius, minVelocity, maxVelocity) {
        let radius = Math.random() * (maxRadius - minRadius) + minRadius;
        let position = new Vector(Math.random() * (bounds.x - radius) + radius, Math.random() * (bounds.y - radius) + radius);
        let velocity = new Vector((Math.random() * (maxVelocity.x - minVelocity.x) + minVelocity.x) * (Math.random() > 0.5 ? 1 : -1), (Math.random() * (maxVelocity.y - minVelocity.y) + minVelocity.y) * (Math.random() > 0.5 ? 1 : -1));
        let color = 'rgba(0, 0, 255, 0.2)';
        // let color = Helpers.RandomColor();
        return new GrowingBall(position, velocity, radius, radius * 3, color);
    }
    update(context) {
        this.radius += ((this.maxRadius - this.radius) * this.radiusVelocity * context.deltaMilliseconds / 1000);
        if (this.isDoneGrowing || this.isGrowing) {
            this.velocity = new Vector();
        }
        super.update(context);
        return false;
    }
    collisionNotify(distance, component) {
        if (this.isDoneGrowing) {
            return;
        }
        else if (this.isGrowing) {
            this.stopGrowing(component);
        }
        else {
            this.startGrowing(component);
        }
    }
    stopGrowing(impactor) {
        if (this.originalHitter === impactor) {
            return;
        }
        this.color = 'rgba(0, 255, 0, 0.2)';
        this.isDoneGrowing = true;
        this.radiusVelocity = 0;
    }
    startGrowing(impactor) {
        if (impactor instanceof GrowingBall) {
            let gb = impactor;
            if (!gb.isDoneGrowing || !gb.isGrowing) {
                return;
            }
        }
        this.color = 'rgba(255, 0, 0, 0.2)';
        this.originalHitter = impactor;
        this.isDoneGrowing = false;
        this.radiusVelocity = 0.4;
        this.isGrowing = true;
        this.velocity = new Vector();
    }
    applyForce(force) {
        if (this.isGrowing || this.isDoneGrowing) {
            // Dont apply force during growth
            return;
        }
        super.applyForce(force);
    }
}
class Helpers {
    static BoxContains(topleft, bottomRight, position, radius) {
        return position.x - radius >= topleft.x && position.y - radius >= topleft.y && position.x + radius <= bottomRight.x && position.y + radius <= bottomRight.y;
    }
    static RandomColor() {
        let r = Math.random() * 256;
        let b = Math.random() * 256;
        let g = Math.random() * 256;
        let a = 0.4;
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    }
}
class PhysicsController {
    processCollisions(components) {
        for (let i = 0; i < components.length; i++) {
            let a = components[i];
            for (let c = i + 1; c < components.length; c++) {
                let b = components[c];
                let aBounds = a.getBounds();
                let bbounds = b.getBounds();
                let dist = Vector.dist(aBounds.position, bbounds.position);
                // Accelerations
                let aToB = bbounds.position.subtract(aBounds.position).normalize().scale(PhysicsController.G * aBounds.mass * bbounds.mass / Math.max((dist * dist), (Math.pow(aBounds.radius + bbounds.radius, 2))));
                a.applyForce(aToB);
                b.applyForce(aToB.invert());
                if (dist <= aBounds.radius + bbounds.radius) {
                    a.collisionNotify(dist, b);
                    b.collisionNotify(dist, a);
                }
            }
        }
    }
}
PhysicsController.G = 0.006;
class QuadTree {
    constructor(maxLevels, size) {
        this.maxLevels = maxLevels;
        this.root = new QuadTreeNode(new Vector(), size.clone());
        this.components = new Array();
    }
    getRoot() {
        return this.root;
    }
    add(component) {
    }
    getFittingNode(component) {
        let bounds = component.getBounds();
        return null;
    }
}
class QuadTreeNode {
    constructor(topLeftBound, topRightBound) {
        this.topLeftBound = topLeftBound;
        this.topRightBound = topRightBound;
    }
}
class ComponentWrapper {
    constructor(component, node) {
        this.component = component;
        this.node = node;
    }
}
class QuadTreeDrawer {
    constructor(tree) {
        this.tree = tree;
    }
    update(context) {
        return false;
    }
    draw(context) {
        context.graphics.beginPath();
        context.graphics.fillStyle = this.color;
        context.graphics.ellipse(this.position.x, this.position.y, this.radius, this.radius, 0, 0, Math.PI * 2);
        context.graphics.fill();
        context.graphics.closePath();
    }
    getBounds() {
    }
    collisionNotify(distance, component) {
    }
    applyForce(force) {
    }
}
class UpdateContext {
    constructor(deltaMS, width, height, currentTime) {
        this.deltaMilliseconds = deltaMS;
        this.width = width;
        this.height = height;
        this.currentTime = currentTime;
    }
}
class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    static dist(a, b) {
        return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    }
    add(v) {
        return new Vector(v.x + this.x, v.y + this.y);
    }
    subtract(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }
    scale(scale) {
        return new Vector(this.x * scale, this.y * scale);
    }
    clone() {
        return new Vector(this.x, this.y);
    }
    invert() {
        return new Vector(-1 * this.x, -1 * this.y);
    }
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalize() {
        var mag = this.magnitude();
        return new Vector(this.x / mag, this.y / mag);
    }
}

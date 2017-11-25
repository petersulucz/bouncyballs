class QuadTree
{
    private maxLevels : number;
    readonly size : Vector;

    private root : QuadTreeNode;

    private components : Array<ComponentWrapper>

    constructor(maxLevels : number, size : Vector){
        this.maxLevels = maxLevels;
        this.root = new QuadTreeNode(new Vector(), size.clone());

        this.components = new Array<ComponentWrapper>();
    }

    getRoot() : QuadTreeNode{
        return this.root;
    }

    add(component : IPhysicsObject){
        
    }

    private getFittingNode(component : IPhysicsObject) : QuadTreeNode{
        let bounds = component.getBounds()
        return null;
    }
}

class QuadTreeNode
{
    private topLeft : QuadTreeNode;
    private topRight : QuadTreeNode;
    private bottomLeft : QuadTreeNode;
    private bottomRight : QuadTreeNode;
    private cells : Array<QuadTreeNode>;

    public readonly topLeftBound : Vector;
    public readonly bottomRightBound : Vector;
    public readonly centerBound : Vector;

    constructor(topLeftBound : Vector, bottomRightBound : Vector){
        this.cells = new Array(4);
        this.topLeftBound = topLeftBound;
        this.bottomRightBound = bottomRightBound;
        this.centerBound = new Vector((this.topLeftBound.x + this.bottomRightBound.x) / 2, (this.topLeftBound.y + this.bottomRightBound.y) / 2);
    }

    GetNode(point : Vector) : QuadTreeNode{
        let left = point.x < this.centerBound.x;
        let top = point.y < this.centerBound.y;

        // 0 2
        // 1 3
        let index = (top ? 0 : 1) + (left ? 0 : 2);
        return this.GetCell(index);
    }

    private GetCell(index : number) : QuadTreeNode{
        if(this.cells[index] == null){
            this.cells[index] = new QuadTreeNode(
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
    public component : IPhysicsObject;
    public node : QuadTreeNode;
    
    constructor(component : IPhysicsObject, node : QuadTreeNode){
        this.component = component;
        this.node = node;
    }
}
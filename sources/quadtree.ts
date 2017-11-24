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

    add(component : IGameComponent){

    }

    private getFittingNode(component : IGameComponent) : QuadTreeNode{
        let bounds = component.getBounds()
        return null;
    }
}

class QuadTreeNode
{
    public topLeft : QuadTreeNode;
    public topRight : QuadTreeNode;
    public bottomLeft : QuadTreeNode;
    public bottomRight : QuadTreeNode;
    public readonly topLeftBound : Vector;
    public readonly topRightBound : Vector;

    constructor(topLeftBound : Vector, topRightBound : Vector){
        this.topLeftBound = topLeftBound;
        this.topRightBound = topRightBound;
    }

    
}

class ComponentWrapper{
    public component : IGameComponent;
    public node : QuadTreeNode;
    
    constructor(component : IGameComponent, node : QuadTreeNode){
        this.component = component;
        this.node = node;
    }
}
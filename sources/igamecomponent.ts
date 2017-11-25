interface IGameComponent{
    update(context : UpdateContext) : boolean;
    draw(context : DrawContext);
}
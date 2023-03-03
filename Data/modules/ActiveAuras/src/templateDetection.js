
function getTemplateShape(template) {
    let d = canvas.dimensions;

    // Extract and prepare data
    let {direction, distance, angle, width} = template.document;
    distance *= (d.size / d.distance);
    width *= (d.size / d.distance);
    direction = Math.toRadians(direction);
    let shape;
    switch (template.document.t) {
        case "circle":
            shape = template._getCircleShape( distance);
            break;
        case "cone":
            shape = template._getConeShape( direction, angle, distance);
            break;
        case "rect":
            shape = template._getRectShape(direction, distance);
            break;
        case "ray":
            shape = template._getRayShape( direction, distance, width);
            break;
    }
    shape.x = template.x;
    shape.y = template.y;
    return shape;
}

function getAuraShape(source, radius) {
    const gs = canvas.dimensions.size;
    const gd = gs / canvas.dimensions.distance;
    if (["dnd5e","dnd4e"].includes(game.system.id) && game.settings.get(game.system.id, "diagonalMovement") === "555") {
        return new PIXI.Rectangle(
            source.x - (radius * gd),
            source.y - (radius * gd),
            (radius * gd)*2 + source.document.width *gs,
            (radius * gd)*2 + source.document.height *gs,
        );
    } 
    return new PIXI.Circle(source.center.x, source.center.y, ((radius * gd) + (source.document.width / 2 * gs)));
}

function PixiFromPolygon(data) {
    const pixiPoints = data.points.map(p => new PIXI.Point(p[0] + data.x, p[1] + data.y));
    return new PIXI.Polygon(pixiPoints);
}

function PixiFromEllipse(data) {
    const { x, y, width, height } = data
    return new PIXI.Ellipse(x + width / 2, y + height / 2, width / 2, height / 2)
}

function PixiFromRect(data) {
    const { x, y, width, height } = data
    return new PIXI.Rectangle(x, y, width, height)
}

function getDrawingShape(data) {
    let shape;
    switch (data.type) {
        case CONST.DRAWING_TYPES.RECTANGLE: 
            shape = PixiFromRect(data);
            break;
        case CONST.DRAWING_TYPES.ELLIPSE:
            shape = PixiFromEllipse(data);
            break;
        case CONST.DRAWING_TYPES.POLYGON:
            shape = PixiFromPolygon(data);
            break;
    }
    return shape;
}

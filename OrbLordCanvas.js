class Group {
  constructor() {

  }

  addShape(shape) {

  }
}

class Shape {
  constructor({
    fillColor = [255, 255, 255],
    points = [],
    position = [0, 0],
    rotation = 0 * (-1),
    rotationOrigin = 'MASS_CENTER',
  }) {
    this.points = points;
    this.fillColor = fillColor;
    this.rotation = rotation;
    this.position = position;
    this.rotationOrigin = rotationOrigin;

    this.intersectsPosition = this.intersectsPosition.bind(this);
    this.containsPoint = this.containsPoint.bind(this);
    this.getIntersectionPosition = this.getIntersectionPosition.bind(this);
    this.containsPosition = this.containsPosition.bind(this);
  }

  indexOfPoint(point) {
    return this.points.map(p => `${p[0]}-${p[1]}`).indexOf(`${point[0]}-${point[1]}`);
  }

  containsPoint(point) {
    return this.indexOfPoint(point) !== -1;
  }

  setPoints(points) {
    this.points = points;
  }

  set(options) {
    Object.assign(this, options);
  }

  containsPosition(position) {
    const point = this.unTransformPosition(position);
    return this.containsPoint(point);
  }

  move(x, y) {
    this.position[0] = this.position[0] + x;
    this.position[1] = this.position[1] + y;
  }

  moveUp(y) {
    this.move(0, y * -1);
  }

  moveDown(y) {
    this.move(0, y);
  }

  moveLeft(x) {
    this.move(x * -1, 0);
  }

  moveRight(x) {
    this.move(x, 0);
  }

  rotate(r) {
    // rotate clockwise
    this.rotation = this.rotation + (r * -1);
  }

  getBoundingBox() {
    const xs = this.points.map(point => point[0]);
    const ys = this.points.map(point => point[1]);
    return {
      xMin: Math.min(...xs),
      xMax: Math.max(...xs),
      yMin: Math.min(...ys),
      yMax: Math.min(...ys),
    };
  }

  getBoxCenter() {
    const boundingBox = this.getBoundingBox();
    const x = (boundingBox.xMin + boundingBox.xMax) / 2;
    const y = (boundingBox.yMin + boundingBox.yMin) / 2;
    return [x, y];
  }

  getMassCenter() {
    const totals = this.points.reduce((total, point) => [total[0] + point[0], total[1] + point[1]], [0, 0]);
    const count = this.points.length;
    return [totals[0] / count, totals[1] / count];
  }

  getRotationOrigin() {
    if (Array.isArray(this.rotationOrigin)) {
      return this.rotationOrigin;
    }
    let center;
    switch (this.rotationOrigin) {
      case 'BOX_CENTER':
        center = this.getBoxCenter();
        break;
      case 'MASS_CENTER':
        center = this.getMassCenter();
        break;
      default:
        center = this.getMassCenter();
        break;
    }
    return [Math.round(center[0]), Math.round(center[1])];
  }

  addPoint(point) {
    if (!this.containsPoint(point)) {
      this.points.push(point);
    }
  }

  removePoint(point) {
    const index = this.indexOfPoint(point);
    if (index > -1) {
      this.points.splice(index, 1);
    }
  }

  addPointAtPosition(position) {
    const point = this.unTransformPosition(position);
    this.addPoint(point);
  }

  removePointAtPosition(position) {
    const point = this.unTransformPosition(position);
    this.removePoint(point);
  }

  // takes an absolution point and converts it to a canvas position
  transformPoint(point) {
    const origin = this.getRotationOrigin();
    const [rx, ry] = rotatePoint(point, this.rotation, origin);
    const x = rx + this.position[0];
    const y = ry + this.position[1];
    return [x, y];
  }

  // takes a canvas position and returns the absolution point position
  //  (even if the shape doesn't contain that point)
  unTransformPosition(position) {
    const tx = position[0] - this.position[0];
    const ty = position[1] - this.position[1];
    const origin = this.getRotationOrigin();
    const [x, y] = rotatePoint([tx, ty], this.rotation * -1, origin);
    return [Math.floor(x), Math.floor(y)];
  }

  intersectsPosition(positionPositionsOrShape) {
    const positions = multiPointTypeToArray(positionPositionsOrShape);
    console.log(positions);
    return Boolean(positions.find(this.containsPosition));
  }

  getIntersectionPosition(positionPositionsOrShape) {
    const positions = multiPointTypeToArray(positionPositionsOrShape);
    return positions.filter(this.containsPosition);
  }

  getPoints() {
    return this.points.map((point) => {
      const position = this.transformPoint(point);
      // TODO: change color handling to handle gradients
      const color = this.fillColor;
      return [position, color];
    });
  }
}

class Gradient {
  constructor({ fromColor, toColor, angle }) {

  }
}

class Rectangle extends Shape {
  constructor({
    topLeft,
    bottomRight,
    fillColor,
    rotation,
    rotationOrigin = 'MASS_CENTER',
  }) {
    super({
      fillColor, rotation, rotationOrigin, position: topLeft,
    });
    const points = [];
    const width = bottomRight[0] - topLeft[0];
    const height = bottomRight[1] - topLeft[1];
    for (let x = 0; x <= width; x += 1) {
      for (let y = 0; y <= height; y += 1) {
        points.push([x, y]);
      }
    }
    this.set({ points });
  }
}

// Helpers
function multiPointTypeToArray(pointPointsOrShape) {
  if (pointPointsOrShape instanceof Shape) {
    return pointPointsOrShape.getPoints().map(p => p[0]);
  }
  if (pointPointsOrShape[0] instanceof Shape) {
    return pointPointsOrShape.reduce((r, s) => r.concat(s.getPoints()), []).map(p => p[0]);
  }
  if (Array.isArray(pointPointsOrShape[0])) {
    return pointPointsOrShape;
  }
  return [pointPointsOrShape];
}

function rotatePoint(point, angle, origin) {
  const angleRadians = angle * (Math.PI / 180);

  const originX = origin[0];
  const originY = origin[1] * -1; // inverting y's

  const pointX = point[0];
  const pointY = point[1] * -1;

  const relX = pointX - originX;
  const relY = pointY - originY;

  const radius = ((relX ** 2) + (relY ** 2)) ** 0.5;
  const theta = Math.atan2(relY, relX);

  const totalRotation = theta + angleRadians;

  const y = ((radius * Math.sin(totalRotation)) + originY) * (-1);
  const x = (radius * Math.cos(totalRotation)) + originX;

  return [Math.round(x), Math.round(y)];
}


module.exports = {
  Group,
  Shape,
  Gradient,
  Rectangle,
};

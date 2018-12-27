
function translateController(controller, [originX = 0, originY = 0]) {
  const proxyHandler = {
    get: (target, key, receiver) => {
      if (key === 'point') {
        return function point([x, y], [r, g, b]) {
          target.point([x + originX, y + originY], [r, g, b]);
        };
      }
      return target[key];
    },
  };
  return new Proxy(controller, proxyHandler);
}


module.exports = translateController;

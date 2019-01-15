const Controller = require('../OrbLordController');

const lord = new Controller({
  width: 26,
  height: 19,
  controls: [],
});

for (let t = 0; t < 494; t++) {
  if (t % 2) {
    lord.absolutePoint(t, [0, 255, 255]);
  } else {
    lord.absolutePoint(t, [0, 255, 255]);
  }
}
lord.draw();

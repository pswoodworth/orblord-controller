const Gamecontroller = require('gamecontroller');

const HID = require('node-hid');

const allDevices = HID.devices();
console.log(allDevices);

const controllerPaths = allDevices.reduce((result, device) => {
  if (device.vendorId === 121 && device.productId === 17) {
    return result.concat([device.path]);
  }
  return result;
}, []);

console.log(controllerPaths);

const ctrl1 = new Gamecontroller('snes-retrolink');
const ctrl2 = new Gamecontroller('snes-retrolink');

ctrl1.connect(() => {
  console.log('Game On!');
}, controllerPaths[0]);

ctrl1.on('A:press', () => {
  console.log('A was pressed on 1');
});

ctrl1.on('A:release', () => {
  console.log('A was released on 1');
});


// ctrl2.connect(() => {
//   console.log('Game On!');
// }, controllerPaths[1]);
//
// ctrl2.on('A:press', () => {
//   console.log('A was pressed on 2');
// });
//
// ctrl2.on('A:release', () => {
//   console.log('A was released on 2');
// });

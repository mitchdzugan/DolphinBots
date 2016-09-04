var dpadLeft = 1;
var dpadRight = 2;
var dpadDown = 4;
var dpadUp = 8;
var z = 16;
var r = 32;
var l = 64;
var a = 256;
var b = 512;
var x = 1024;
var y = 2048;
var start = 4096;

function ledgedashActions(frameStart, controller) {

	function action(relativeFrame, controls) {
		controls.frame = frameStart + relativeFrame;
		controls.controller = controller
		return controls
	}

	return [
		action(1 , { stickX: 0 }),
		action(2 , { stickX: 0, button: x }),
		action(3 , { button: x }),
		action(4 , { stickX: 255 , button: x}),
		action(5 , { stickX: 255 , button: x}),
		action(6 , { stickX: 255 }),
		action(7 , { stickX: 255 }),
		action(8 , { stickX: 255 }),
		action(9 , { stickX: 255 }),
		action(10, { stickX: 255 }),
		action(11, { stickX: 255 }),
		action(12, { stickX: 255 }),
		action(13, { stickX: 255 }),
		action(14, { stickX: 255, stickY: 0, button: r }),
		action(15, { stickX: 255, stickY: 0, button: r }),
		action(16, { stickX: 0 }),
		action(17, { stickY: 0 }),
		action(18, { button: b })
	]
}

exports.actions = function(writeActions, client, frame) {
		// have the inputs start a few frames after the one where dpad was pushed
		// this gives both this script and dolphin time to process.
		// if you are getting dropped inputs, try increasing this number.
		waitFrames = 25
		screenshotActions = []
		console.log(frame)
		/** 
		// uncomment this and you can get a screnshot of every frame of the ledge dash
		for (i = c1.frame + waitFrames; i < c1.frame + waitFrames + 60; i++) {
			screenshotActions.push({frame: i, filename: "" + (i - waitFrames - curr.frame)})
		}
		*/
		writeActions(client, {PadManipActions: ledgedashActions(frame + waitFrames, 0), TakeScreenshotActions: screenshotActions})
}
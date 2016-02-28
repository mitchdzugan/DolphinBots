var net = require('net');

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

function isPushed(buttonVal, button) {
	return (buttonVal & button) != 0;
}

function writeActions(client, actions) {
	client.write("@");
	client.write(JSON.stringify(actions))
	client.write("@");
}

function ldpsActions(frameStart, controller) {

	function action1(relativeFrame, controls) {
		controls.frame = frameStart + relativeFrame;
		controls.controller = 1;
		return controls
	}

	function action(relativeFrame, controls) {
		controls.frame = frameStart + relativeFrame;
		controls.controller = controller
		return controls
	}

	return [
		action(1, { stickX: 255 }),
		action(2, { stickY: 255 }),
		action(3, { stickY: 255, button: b }),
		action(38, { stickX: 255 }),
		action(39, { stickX: 0, button: y }),
		action(40, { stickX: 0 }),
		action(41, { stickX: 0 }),
		action(42, { stickX: 0 }),
		action(43, { stickX: 0, stickY: 100, button: r }),
		action(57, { button: r }),
		action(58, { button: r }),
		action(59, { button: r }),
		action(60, { button: r }),
		action(73, { substickX: 0 }),
		action(74, { substickX: 0 }),
		action(75, { substickX: 0 }),
		action(77, { substickX: 0, button: r }),
		action(78, { substickX: 0, button: r }),
		action(79, { substickX: 0, button: r }),
		action(61, { button: r }),
		action(62, { button: r }),
		action(63, { button: r }),
		action(64, { button: r }),
		action(72, { substickX: 0 }),
		action1(45, { button: y }),
		action1(51, { substickX: 255 })
		//action1(38, { button: y }),
		//action1(58, { substickX: 255 }),
		//action1(61, { button: l }),
		//action1(81, { button: b, stickY: 0 }),
		//action1(85, { button: y }),
		//action1(89, { button: l, stickY: 0 })
	]
}

var client = new net.Socket();
client.connect(3490, '127.0.0.1', function() {
	console.log('Connected');
});

var prev = null
var curr = null

inJson = false
jsonString = ""

client.on('data', function(data) {
	dataString = "" + data

	while(true) {
		if (inJson) {
			closedBrack = dataString.indexOf("}");
			if (closedBrack == -1) {
				jsonString += dataString;
				break;
			} else {
				jsonString += dataString.slice(0, closedBrack + 1)
				dataString = dataString.slice(closedBrack + 1)
				inJson = false;

				currP = JSON.parse(jsonString);
				if (currP.controller == 0) {
					prev = curr;
					curr = currP
					if (prev == null) {
						prev = curr;
					}
					if ((curr.button & dpadDown) != 0 && (prev.button & dpadDown) == 0) {
						screenshotActions = []
						for (i = curr.frame + 75; i < curr.frame + 75 + 100; i++) {
							screenshotActions.push({frame: i, filename: "" + (i - 75 - curr.frame)})
						}
						writeActions(client, {PadManipActions: ldpsActions(curr.frame + 60, 0), TakeScreenshotActions: screenshotActions})
					}
				}

				jsonString = ""

			}
		} else {
			openBrack = dataString.indexOf("{");
			if (openBrack == -1) {
				break;
			} else {
				dataString = dataString.slice(openBrack);
				inJson = true;
			}
		}
	}
});

client.on('close', function() {
	console.log('Connection closed');
});
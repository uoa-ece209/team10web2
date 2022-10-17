/**
 * Frontend application main script
 */

var s;
var c;

function begin() {

	console.log("Beginning connection attempt")

	let params = {
		// filters: [{
		// 	'services': ['battery_service', 0x1234],
		// 	'name': 'Bob'
		// }],
		acceptAllDevices: true,
		optionalServices: [
			0x181A,
			0xFFE0
		]
	}


	navigator.bluetooth.requestDevice(params)
		.then(device => {
			console.log("%cUser selected a device", 'color: cadetblue')
			console.log('> Name:             ' + device.name);
			console.log('> ID:               ' + device.id);
			console.log('> Connected:        ' + device.gatt.connected);

			console.log(`%cAttempting to connect to ${device.name}`, 'color: cadetblue')
			return device.gatt.connect();
		})
		.then(server => {
			console.log('%cConnection established successfully', 'color: mediumseagreen')
			console.log('%cQuerying for available services', 'color: cadetblue')
			s = server;
			return server.getPrimaryServices();
		})
		.then(servicesList => {
			console.log('%cRecieved a list of available services', 'color: cadetblue')
			console.log(servicesList)
			let uuid = servicesList[0].uuid;
			console.log(`%cQuerying service with uuid ${uuid}`, 'color: cadetblue')
			return s.getPrimaryService(uuid)
		})
		.then(service => {
			console.log(`%cEnumerating service for characteristics`, 'color: cadetblue')
			return service.getCharacteristics()
		})
		.then(characteristics => {
			console.log(`%cRecieved list of characteristics`, 'color: cadetblue')
			console.dir(characteristics)
			return characteristics[0]
		})
		.then(characteristic => {
			return characteristic.startNotifications()
		})
		.then(characteristic => {
			characteristic.addEventListener('characteristicvaluechanged', handleChanged)
			c = characteristic;
			return characteristic;
		})
		.then(characteristic => {
			let data = Uint8Array.of(69);
			characteristic.writeValueWithoutResponse(data)
		})
		.catch(err => {
			console.error(err);
		})
		// .then(() => {
		// 	console.log(`%cDisconnecting`, 'color: cadetblue')
		// 	s.disconnect()
		// 	console.log('Connection closed.')
		// })

}

function handleChanged(event) {
	console.log(`%cCharacteristic value changed:`, 'color: cadetblue')
	let data = event.target.value // as DataView
	for(var i = 0; i < data.byteLength; ++i) {
		console.log(data.getUint8(i))
	}
}

function write(value) {
	if(c) {
		let data = (value instanceof Array) ? Uint8Array.from(value) : Uint8Array.of(value)
		c.writeValueWithoutResponse(data)
	} else {
		// TODO handle was-connected-but-now-disconnected errors
		console.error('Cannot write: no device connected')
	}
}
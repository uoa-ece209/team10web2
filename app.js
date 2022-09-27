function bt() {
	
	console.log("Beginning connection attempt")

	navigator.bluetooth.requestDevice({acceptAllDevices: true})
		.then(device => {
			console.log('> Name:             ' + device.name);
			console.log('> ID:               ' + device.id);
			console.log('> Connected:        ' + device.gatt.connected);
		})
		.catch(error => {
			console.log('Failed. ' + error);
		});

}

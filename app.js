async function inform() {
	
	console.log("Beginning connection attempt")

	navigator.bluetooth.requestDevice()
		.then(device => {
			log('> Name:             ' + device.name);
			log('> ID:               ' + device.id);
			log('> Connected:        ' + device.gatt.connected);
		})
		.catch(error => {
			log('Failed. ' + error);
		});

	console.log(available);

}

inform();

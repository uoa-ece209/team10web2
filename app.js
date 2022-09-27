async function inform() {
	
	console.log("Beginning avalability check")

	var available = await Bluetooth.getAvailability();

	console.log(available);

}

inform();

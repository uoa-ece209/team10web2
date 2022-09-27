async function inform() {

	var available = await Bluetooth.getAvailability();

	console.log(available);

}

inform();

async function inform() {
	
	console.log("Beginning availability check")

	var available = await navigator.bluetooth.getAvailability();

	console.log(available);

}

inform();

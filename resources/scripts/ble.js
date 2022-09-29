
class BLEConnection {

	constructor({ serviceUUID, characteristicUUID }) {
		this.connectedDevice = null
		this.dataEventHandler = null
		this.serviceUUID = serviceUUID
		this.characteristicUUID = characteristicUUID
	}

	/**
	 * Begins a connection attempt
	 */
	open() {

		let params = {
			// filters: [{
			// 	'services': ['battery_service', 0x1234],
			// 	'name': 'Bob'
			// }],
			acceptAllDevices: true,
			optionalServices: [this.serviceUUID]
		}

		return navigator.bluetooth.requestDevice(params)
			.then(device => {
				this.connectedDevice = device
				return device.gatt.connect()
			})
			.then(server => {
				return server.getPrimaryService(this.serviceUUID)
			})
			.then(service => {
				return service.getCharacteristic(this.characteristicUUID)
					.then(s => s.startNotifications())
					.then(s => s.addEventListener('characteristicvaluechanged', event => {
						this._receiveData(event, this)
					}))
			})
			.then(() => {
				return this
			})
	}

	/**
	 * Terminates a connection
	 */
	close() {
		if (this.device) this.device.gatt.disconnect();
	}

	_receiveData(event, _self) {
		let data = event.target.value	// type DataView
		if(this.dataEventHandler) this.dataEventHandler(data)
	}

	/**
	 * Send raw values
	 * 
	 * @param {integer} rawValues the raw value(s) to send
	 * @returns promise
	 */
	write(rawValues) {

		if (!this.connectedDevice?.gatt?.connected) return

		let data = (rawValues instanceof Array) ? Uint8Array.from(rawValues) : Uint8Array.of(rawValues)

		return this.connectedDevice.gatt.getPrimaryService(this.serviceUUID)
			.then(service => service.getCharacteristic(this.characteristicUUID))
			.then(characteristic => characteristic.writeValueWithoutResponse(data))

	}

	print(str) {

		if (!this.connectedDevice?.gatt?.connected) return
	
		var data = new Array()
	
		for(var i in str)
				data.push(str.charCodeAt(i))
	
		this.write(data)
	}

	println(str) {
		this.print(str + '\n')
	}

	/**
	 * SerialParser-style callbacks. Should make code more portable.
	 * @param {} eventType the type of event
	 * @param {*} handler a handler function to be called
	 */
	on(eventType, handler) {
		switch (eventType) {
			case 'data':
				this.dataEventHandler = handler
				break;
		}
	}

}

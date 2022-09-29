var connection = new BLEConnection({
	serviceUUID: 0x181A,
	characteristicUUID: 0x2A6E
})

function begin() {

	connection.on('data', receive)

	connection.open()
		.then(() => {
			connection.write([0x68, 0x69])
		})

}

function receive(data) {
	console.log('%cbegin packet', 'color:cadetblue')
	console.log('%cuint8\tchar', 'color:grey')
	for(var i = 0; i < data.byteLength; ++i) {
		console.log(`${data.getUint8(i)}\t\t${String.fromCharCode(data.getUint8(i))}`)
	}
	console.log('%cend packet', 'color:cadetblue')
}

function print(str) {

	if(!connection) {
		console.err('Cannot send; no open connection.')
		return
	}

	var data = new Array()

	for(i in str)
			data.push(str.charCodeAt(i))

	connection.write(data)

}
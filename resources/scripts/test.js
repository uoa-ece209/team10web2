var connection = new BLEConnection({
	serviceUUID: 0xFFE0,
	characteristicUUID: 0xFFE1
})

function begin() {

	document.getElementById('connection-msg').innerText = 'To begin, make sure your Team 10 Energy Monitor is plugged in and nearby.'

	connection.on('data', parse)
	connection.on('disconnected', () => {
		document.getElementById("connection-msg").innerHTML = `You've disconnected from your energy monitor. You can connect to another now if you wish. <span class="less-important">Didn't mean to disconnect? You may have gone out of range.</span>`
		$('body').removeClass('connected')
	})

	connection.open()
		.then(() => {
			connection.print('r')	// recall fresh data from MCU
			$('#container').highcharts().series[0].setData([])
		})
		.then(() => {
			document.getElementById("connection-msg").innerText = "You're connected to your Energy Monitor."
			$('body').addClass('connected')
		})
		.catch(err => {
			console.log(err)
			document.getElementById("connection-msg").innerHTML = `There was a problem connecting to your monitor. <span style="color:#ccc">${err}</span>`
			$('body').removeClass('connected')
		})
		
}

var str = "";
var buf = [];

function parse(data) {


	// console.log('%cbegin packet', 'color:cadetblue')
	// console.log('%cuint8\tchar', 'color:grey')
	// for(var i = 0; i < data.byteLength; ++i) {

	// 	const ch = String.fromCharCode(data.getUint8(i));
	// 	console.log(`${data.getUint8(i)}\t\t${ch}`)
	// 	str += ch
		
	// }
	// console.log('%cend packet', 'color:cadetblue')

	// document.getElementById('output').innerHTML += str

	for(var i = 0; i < data.byteLength; ++i) {

		const ch = String.fromCharCode(data.getUint8(i));
		if(ch == '\n') {
			gotLine(buf.join(''))
			buf = [];
		} else {
			buf.push(ch)
		}
		
	}

}

function gotLine(line) {

	console.log(line)

	// array buffers for all values, and those that we find to be numbers
	let allValues = line.split(/(\s+)/)
	let values = [];
	
	// grab the numbers
	for(var i in allValues) {
		const n = parseInt(allValues[i]);
		if(!isNaN(n))
			values.push(n)
	}

	if(values.length != 4)
		// only a debug message, don't emit
		return;

	let set = {
		voltage: values[0] / 100,	// was cV, now V
		current: values[1],			// was mA, still mA
		power: values[2] / 100, 	// was cW, now W
	}

	gotSet(set)

}

let energyCounter = 0				// energy in J

function gotSet(set) {
	// console.log(set)
	document.getElementById('voltage').getElementsByClassName('value')[0].innerText = set.voltage.toFixed(1)
	document.getElementById('current').getElementsByClassName('value')[0].innerText = set.current.toFixed(0)
	document.getElementById('power').getElementsByClassName('value')[0].innerText = set.power.toFixed(2)

	const numberOfSecondsBetweenSamples = 1
	energyCounter += set.power * numberOfSecondsBetweenSamples
	set.energy = energyCounter / 3.600	// to mWh

	document.getElementById('energy').getElementsByClassName('value')[0].innerText = set.energy.toFixed(2)
	addPower(set.power)
}

function disconnect() {
	connection.close();
}
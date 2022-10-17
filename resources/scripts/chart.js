//---------------------------FUnction Declaration
//Insert Voltage
function addVoltage(voltage){
    console.log("DEBUG-FUNCTION-TEST");
    let chart = $('#container').highcharts();
    chart.series[0].addPoint(voltage);
  }
//Insert Power
function addPower(power){
    let chart = $('#container').highcharts();
    chart.series[0].addPoint(power);
  }
//insert current
function addCurrent(current){
    console.log("DEBUG-FUNCTION-TEST");
    let chart = $('#container').highcharts();
    chart.series[1].addPoint(current);
}  

//---------------------------
$(document).ready(function () {
    console.log("DOCument LOADED");

	Highcharts.setOptions({
		chart: {
			style: {
				fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
			}
		}
	});

    const chart = Highcharts.chart('container', {
            chart: {
                zoomType: 'x'
            },
            title: {
                text: ' '
            },
            xAxis: {
                type: 'category',
                //startOnTick: true,
                endOnTick: true,
                dateTimeLabelFormats: { // don't display the dummy year\
                    year:  '',
                    month:  '',
                    day: '',
                    second: '%M:%S'

                }
            },
            yAxis: {
                title: {
                    text: 'power, W'
                }
            },
            legend: {
                enabled: true,
                borderWidth: 1,
                backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
            },
            tooltip: {
                valueSuffix: ' W'
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            
            series: [{
                type: 'area',
                name: 'power',
                opacity: 0.8,
                data: [], //populate with 12 zero values,
            }],
        });
    
});
d3.csv("testCSV.csv", function(error, data){

createMap(data);

});
var projectionMain = d3.geo.equirectangular()
	.center([0, -100])
	.rotate([0, 0])
	.scale(150)
	.translate([document.getElementById('container').offsetWidth / 2, document.getElementById('container').offsetWidth / 2]);
var pathMain = d3.geo.path()
	.projection(projectionMain);

var bombMap;
var europeColor = '#9467bd';
var africaColor = '#ffa500';
var southAmericaColor = '#008000';
var northAmericaColor = '#800080';
var asiaColor = '#ff0000';
var oceaniaColor = '#0000ff';
var centralAmericaColor = '#ffff00';

function createMap(data){
	data.forEach(function(d){
		d.Africa;
	});
	redrawMap(0,0,0,0,150);
	bubbles();
	console.log(bombMap);
	
	bombMap.svg.selectAll('.datamaps-bubble')
		.on('click', function() {
			//redrawMap(0,0,0,0,400);
				
				projectionMain.transition()
				.center([this.cx, this.cy])
				.rotate([0, 0])
				.scale(400)
				//need to find a way to update the scale correctly
				.translate([document.getElementById('container').offsetWidth / 2,  document.getElementById('container').offsetHeight / 2]);
				pathMain.transition()
				.projection(projectionMain)
				.duration(100);
			
			}
			);
			
		
	};	
		
	

	

	
	function redrawMap(center1,center2,rotate1,rotate2,scale){
		document.getElementById('container').innerHTML="";
		bombMap = new Datamap({
			
			element: document.getElementById('container'),
			scope: 'world',
			geographyConfig: {
				popupOnHover: true,
				highlightOnHover: true
			},
			
			setProjection: function(element) {
				return {path: pathMain, projection: projectionMain}; 
			},
		
			fills: {
				'AUT': europeColor,
				'HUN': europeColor,
				'BEL': europeColor,
				'BGR': europeColor,
				'CZE': europeColor,
				'DNK': europeColor,
				'FIN': europeColor,
				'FRA': europeColor,
				'DEU': europeColor,
				'GRC': europeColor,
				'IRL': europeColor,
				'ITA': europeColor,
				'NLD': europeColor,
				'NOR': europeColor,
				'SWE': europeColor,
				'POL': europeColor,
				'PRT': europeColor,
				'ROU': europeColor,
				'RUS': europeColor,
				'ESP': europeColor,
				'CHE': europeColor,
				'GBR': europeColor,
				'MKD': europeColor,
				'CHN': asiaColor,
				'HKG': asiaColor,
				'IND': asiaColor,
				'IRN': asiaColor,
				'ISR': asiaColor,
				'JPN': asiaColor,
				'JOR': asiaColor,
				'KOR': asiaColor,
				'PHL': asiaColor,
				'SYR': asiaColor,
				'TWN': asiaColor,
				'TUR': asiaColor,
				'VNM': asiaColor,
				'EGY': africaColor,
				'ETH': africaColor,
				'LBR': africaColor,
				'MAR': africaColor,
				'ZAF': africaColor,
				'AUS': oceaniaColor,
				'NZL': oceaniaColor,
				'CAN': northAmericaColor,
				'USA': northAmericaColor,
				'MEX': northAmericaColor,
				'CUB': northAmericaColor,
				'DOM': northAmericaColor,
				'HTI': northAmericaColor,
				'JAM': northAmericaColor,
				'BLZ': centralAmericaColor,
				'CRI': centralAmericaColor,
				'SLV': centralAmericaColor,
				'GCA': centralAmericaColor,
				'HND': centralAmericaColor,
				'NIC': centralAmericaColor,
				'PAN': centralAmericaColor,
				'ARG': southAmericaColor,
				'BOL': southAmericaColor,
				'BRA': southAmericaColor,
				'CHL': southAmericaColor,
				'COL': southAmericaColor,
				'ECU': southAmericaColor,
				'GUY': southAmericaColor,
				'PRY': southAmericaColor,
				'PER': southAmericaColor,
				'SUR': southAmericaColor,
				'URY': southAmericaColor,
				'VEN': southAmericaColor,
				
				
				defaultFill: '#000000'
			},
			data: {
				'AUT': {fillKey: 'AUT'},
				'HUN': {fillKey: 'HUN'},
				'BEL': {fillKey: 'BEL'},
				'BGR': {fillKey: 'BGR'},
				'CZE': {fillKey: 'CZE'},
				'DNK': {fillKey: 'DNK'},
				'FIN': {fillKey: 'FIN'},
				'FRA': {fillKey: 'FRA'},
				'DEU': {fillKey: 'DEU'},
				'GRC': {fillKey: 'GRC'},
				'IRL': {fillKey: 'IRL'},
				'ITA': {fillKey: 'ITA'},
				'NLD': {fillKey: 'NLD'},
				'NOR': {fillKey: 'NOR'},
				'SWE': {fillKey: 'SWE'},
				'POL': {fillKey: 'POL'},
				'PRT': {fillKey: 'PRT'},
				'ROU': {fillKey: 'ROU'},
				'RUS': {fillKey: 'RUS'},
				'ESP': {fillKey: 'ESP'},
				'CHE': {fillKey: 'CHE'},
				'GBR': {fillKey: 'GBR'},
				'MKD': {fillKey: 'MKD'},
				'CHN': {fillKey: 'CHN'},
				'HKG': {fillKey: 'HKG'},
				'IND': {fillKey: 'IND'},
				'IRN': {fillKey: 'IRN'},
				'ISR': {fillKey: 'ISR'},
				'JPN': {fillKey: 'JPN'},
				'JOR': {fillKey: 'JOR'},
				'KOR': {fillKey: 'KOR'},
				'PHL': {fillKey: 'PHL'},
				'SYR': {fillKey: 'SYR'},
				'TWN': {fillKey: 'TWN'},
				'TUR': {fillKey: 'TUR'},
				'VNM': {fillKey: 'VNM'},
				'EGY': {fillKey: 'EGY'},
				'ETH': {fillKey: 'ETH'},
				'LBR': {fillKey: 'LBR'},
				'MAR': {fillKey: 'MAR'},
				'ZAF': {fillKey: 'ZAF'},
				'AUS': {fillKey: 'AUS'},
				'NZL': {fillKey: 'NZL'},
				'USA': {fillKey: 'USA'},
				'CAN': {fillKey: 'CAN'},
				'MEX': {fillKey: 'MEX'},
				'CUB': {fillKey: 'CUB'},
				'DOM': {fillKey: 'DOM'},
				'HTI': {fillKey: 'HTI'},
				'JAM': {fillKey: 'JAM'},
				'BLZ': {fillKey: 'BLZ'},
				'CRI': {fillKey: 'CRI'},
				'SLV': {fillKey: 'SLV'},
				'GCA': {fillKey: 'GCA'},
				'HND': {fillKey: 'HND'},
				'NIC': {fillKey: 'NIC'},
				'PAN': {fillKey: 'PAN'},
				'ARG': {fillKey: 'ARG'},
				'BOL': {fillKey: 'BOL'},
				'BRA': {fillKey: 'BRA'},
				'CHL': {fillKey: 'CHL'},
				'COL': {fillKey: 'COL'},
				'ECU': {fillKey: 'ECU'},
				'GUY': {fillKey: 'GUY'},
				'PRY': {fillKey: 'PRY'},
				'PER': {fillKey: 'PER'},
				'SUR': {fillKey: 'SUR'},
				'URY': {fillKey: 'URY'},
				'VEN': {fillKey: 'VEN'},
				
				
			}
        
		});

	};
function bubbles() {
	//draw bubbles for bombs
	var bombs = [{
        name: 'Joe 4',
        radius: 25,
        yeild: 400,
        country: 'USSR',
        fillKey: 'RUS',
        significance: 'First fusion weapon test by the USSR (not "staged")',
        date: '1953-08-12',
        latitude: 50.07,
        longitude: 78.43
      },{
        name: 'RDS-37',
        radius: 40,
        yeild: 1600,
        country: 'USSR',
        fillKey: 'RUS',
        significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
        date: '1955-11-22',
        latitude: 50.07,
        longitude: 200
      }
    ];
	
	
	bombMap.bubbles(bombs, {
		popupTemplate: function (geo, data) { 	
				return ['<div class="hoverinfo">' +  data.name,
				'<br/>Payload: ' +  data.yeild + ' kilotons',
				'<br/>Country: ' +  data.country + '',
				'<br/>Date: ' +  data.date + '',
				'</div>'].join('');
		}
		
	
	});
};

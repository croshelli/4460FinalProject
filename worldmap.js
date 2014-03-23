var theMap;
var europeColor = '#9467bd';
var africaColor = '';
var southAmericaColor = '';
var northAmericaColor = '';
var asiaColor = '#ff0000';
var austrailaColor = '';

var worldMapPos = [500,300,600];
var northAmericaPos = [255,200,200];
var southAmericaPos = [300,350,200];
var centralAmericaPos = [280,265,70];
var europePos = [550,180,150];
var asiaPos = [725,225,200];
var africaPos = [550,300,200];
var oceaniaPos = [850,350,150];


var p0 = worldMapPos;
var p1 = northAmericaPos;
var temp;

var location1 = "World";


d3.csv("testCSV.csv", function(error, data){

createMap(data);

}); 


function createMap(data){
	data.forEach(function(d){
		d.Africa;
	});
	redrawMap(0,0,0,0,150);	
	bubbles();
};	

function transition(svg, start, end) {
  var center = [1000 / 2, 600 / 2],
      i = d3.interpolateZoom(start, end);

  svg
      .attr("transform", transform(start))
      .transition()
      .delay(250)
      .duration(i.duration * 2)
      .attrTween("transform", function() { return function(t) { return transform(i(t)); }; })
      .each("end", function() { bubbles(); });
		
	temp = p0;
	p0=p1;
	p1=temp;
  function transform(p) {
    var k = 600 / p[2];
    return "translate(" + (center[0] - p[0] * k) + "," + (center[1] - p[1] * k) + ")scale(" + k + ")";
  }
};

	
	function redrawMap(center1,center2,rotate1,rotate2,scale){
		document.getElementById('container').innerHTML="";
		theMap = new Datamap({
			
			element: document.getElementById('container'),
			scope: 'world',
			geographyConfig: {
				popupOnHover: true,
				highlightOnHover: true
			},
			
			setProjection: function(element) {
				var projection = d3.geo.equirectangular()
				.center([center1, center2])
				.rotate([rotate1, rotate2])
				.scale(scale)
				.translate([element.offsetWidth / 2, element.offsetHeight / 2]);
				var path = d3.geo.path()
				.projection(projection);
				return {path: path, projection: projection}; 
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
				
				'CAN': northAmericaColor,
				'MEX': northAmericaColor,
				'CUB': northAmericaColor,
				'DOM': northAmericaColor,
				
				
				
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
				
			}
        
		});

	};
function bubbles() {
	//draw bubbles for thes
	var bubbs = mapSelect(location1);
	
	
	
	
	theMap.bubbles(bubbs, {
		popupTemplate: function (geo, data) { 	
				return ['<div class="hoverinfo">' +  data.name,
				'<br/>Payload: ' +  data.yeild + ' kilotons',
				'<br/>Country: ' +  data.country + '',
				'<br/>Date: ' +  data.date + '',
				'</div>'].join('');
		}
		
	
	});

	theMap.svg.selectAll('.datamaps-bubble').on('click', function() {
		location1 = this.__data__.country;
		
			theMap.svg.selectAll('circle').forEach(function(d) {
				d.forEach(function(d1) {
					d1.remove();
				});
			
			});		
		
		
		locationSelect();
		theMap.svg.select('.datamaps-subunits').call(transition, p0, p1);
		
	
	});
	
	};

function locationSelect() {
	if (location1=="World") {
		p1 = worldMapPos;
	}
	else if (location1=="North America") {
		p1 = northAmericaPos
	}
	else if (location1=="Asia") {
		p1 = asiaPos
	}
	else if (location1=="Europe") {
		p1 = europePos
	}
	else if (location1=="Africa") {
		p1 = africaPos
	}
	else if (location1=="Oceania") {
		p1 = oceaniaPos
	}
	else if (location1=="Central America") {
		p1 = centralAmericaPos
	}
	else if (location1=="South America") {
		p1 = southAmericaPos
	}
};	
	
function mapSelect() {
	var bubbs;
	if (location1=="World") {
		bubbs = [{
			name: 'Asia',
			radius: 25,
			yeild: 400,
			country: 'Asia',
			fillKey: 'JPN',
			significance: 'First fusion weapon test by the USSR (not "staged")',
			date: '1953-08-12',
			latitude: 35.07,
			longitude: 78.43
		  },{
			name: 'North America',
			radius: 25,
			yeild: 1600,
			country: 'North America',
			fillKey: 'CAN',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 40,
			longitude: -100
		  },{
			name: 'South America',
			radius: 25,
			yeild: 1600,
			country: 'South America',
			fillKey: 'BRA',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: -20,
			longitude: -60
		  },{
			name: 'Central America',
			radius: 25,
			yeild: 1600,
			country: 'Central America',
			fillKey: 'CRI',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 10,
			longitude: -85
		  },{
			name: 'Europe',
			radius: 25,
			yeild: 1600,
			country: 'Europe',
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 50,
			longitude: 0
		  },{
			name: 'Africa',
			radius: 25,
			yeild: 1600,
			country: 'Africa',
			fillKey: 'EGY',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 0,
			longitude: 20
		  },{
			name: 'Oceania',
			radius: 25,
			yeild: 1600,
			country: 'Oceania',
			fillKey: 'AUS',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: -30,
			longitude: 140
		  }
		];
	}
	else if (location1) {
		bubbs = [{
			name: 'North America',
			radius: 40,
			yeild: 1600,
			country: 'World',
			fillKey: 'RUS',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 0,
			longitude: -100
			}
		];
	}
	return bubbs;
};
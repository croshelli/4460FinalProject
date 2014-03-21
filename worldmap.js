d3.csv("testCSV.csv", function(error, data){

createMap(data);

}); 
var bombMap;
var europeColor = '#9467bd';
var africaColor = '';
var southAmericaColor = '';
var northAmericaColor = '';
var asiaColor = '#ff0000';
var austrailaColor = '';
var p0 = [500,300,600]

function createMap(data){
	data.forEach(function(d){
		d.Africa;
	});
	redrawMap(0,0,0,0,150);
	bubbles();
	console.log(bombMap);
	bombMap.svg.selectAll('.datamaps-bubble').on('click', function() {
		//redrawMap(0,0,0,0,400);
		p1 = [100,100,250];
		bombMap.svg.select('.datamaps-subunits').call(transition, p0, p1);
		p0 = p1;
		
		bombMap.svg.select('.datamaps-bubble').selectAll("circle")
		.transition()
		.attr("opacity",0)
		.delay(0)
		.duraction(1000)

	});

	
	
	
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
      //.each("end", function() { d3.select(this).call(transition, end, start); });

  function transform(p) {
    var k = 600 / p[2];
    return "translate(" + (center[0] - p[0] * k) + "," + (center[1] - p[1] * k) + ")scale(" + k + ")";
  }
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
				
				'CDN': northAmericaColor,
				'MEX': northAmericaColor,
				'CUBA': northAmericaColor,
				
				
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

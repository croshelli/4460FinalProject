

//create constant buffers for margin, as well as variables for height, width
// bottom edge and right edge of frame
var margin = {top:40, right:20, bottom: 100, left:90};
var margin2 = {top: 430, right: 20, bottom: 20, left: 90};
var width = 1000-margin.left-margin.right;
var height = 500-margin.top-margin.bottom;
var height2 = 500 - margin2.top - margin2.bottom;
var frameBase = 500-margin.bottom;
var frameRight = 1000-margin.right;
var countrySelection = "all";
var cache = {};
var tooltipsArray = [];
//create x and y scales and axis
var xScale = d3.time.scale().range([0, width]);
var yScale = d3.scale.linear().range([height, 0]);
var xScale2 = d3.time.scale().range([0, width]);
var yScale2 = d3.scale.linear().range([height2, 0]);
var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("bottom");
var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left");
var xAxis2 = d3.svg.axis()
			.scale(xScale2)
			.orient("bottom");
//color scale
var color = d3.scale.category20();	
//this creates a stack layout with the array stored in d.values
var stack = d3.layout.stack()
				.values(function(d) {return d.values;});			 
//this is the svg canvas we will draw to
var canvas = d3.select("#areaChart").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom);
//this is the group we will put the focused paths on				
var focus = canvas.append("g")
			.attr("class", "focus")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//this is the group we can use to select certain years of data
var context = canvas.append("g")
			  .attr("class", "context")
			  .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
			  
//this variable will be used as a function and applied
//to the data later in the code to create blocks of area with an
//x position of x, and a bottom y of y0 and a top y of y1				
var area = d3.svg.area()
	.x(function(d) {return xScale(gd(d.date)); })
	.y0(function(d) {return yScale(d.y0);})
	.y1(function(d) {return yScale(d.y0+d.y);});
	
var area2 = d3.svg.area()
	.x(function(d) {return xScale2(gd(d.date));})
	.y0(function(d) {return yScale2(d.y0);})
	.y1(function(d) {return yScale2(d.y0+d.y);});

//creates a new date object and returns it when passed a year.
function gd(year){
	yearN= +year;
	nDate= new Date(yearN, 1,15);			
	return nDate;
}

//add x1, x2 and y axis to vis
focus.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0,"+ height + ")")
		.call(xAxis);		
focus.append("g")
		.attr("class", "y axis")
		.call(yAxis);
context.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate( 0," + height2 + ")")
		.call(xAxis2);
		
//adding information for the tooltip
var tooltip = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);
 
loadAllData();



function createGraphic(data, yScaleNum){

var brush = d3.svg.brush()
			.x(xScale2)
			.on("brush", brushed);
	
function brushed(){
	xScale.domain(brush.empty() ? xScale2.domain() : brush.extent());
	country.select(".area").attr("d", function(d) {return area(d.values);});
	focus.select(".x.axis").call(xAxis);
	updateTooltips();
	}
	
canvas.append("defs").append("clipPath")
		.attr("id", "clip")
		.append("rect")
			.attr("width", width)
			.attr("height", height);

//this takes the color variable made above and maps its domain to the 8 different
//headings in our .csv file (or the row called by data[0]), filtering out the first column, "date"				
color.domain(d3.keys(data[0]).filter(function(key) {return key !== "date";}));

//get domains for scales
xScale.domain(d3.extent(data.map(function(d) { return gd(d.date);})));
xScale2.domain(xScale.domain());
yScale.domain([0, yScaleNum]);
yScale2.domain(yScale.domain());

//need to write function to update yScale domain
focus.select('.x.axis').transition()
    .call(xAxis);
context.select('.x.axis').transition()
    .call(xAxis2);
focus.select('.y.axis').transition()
	.call(yAxis);


//take input data and format it into an array of countries objects
var countries = stack(color.domain().map(function(name) {
				return {
					name: name,
					values: data.map(function(d){
						return {date: d.date, y: parseFloat(d[name]), y0: 0, name: name};
						
						})
						};
					}));

//create a country object on the for every country in the array countries
var country = focus.selectAll(".country")
					.data(countries);
					
country.enter()
		.append("g")
		.attr("class", "country")
		.append("path")
		.attr("class", "area");
		
		
country.select(".area")
		.attr("d", function(d) { return area(d.values);})
		.style("fill", function(d) {return color(d.name);});
			
country.exit().remove();
			
var country2 = context.selectAll(".country2")
				.data(countries);

country2.enter()
		.append("g")
		.attr("class", "country2")
		.append("path")
		.attr("class", "area");
					
country2.select(".area")
		.attr("d", function(d){return area2(d.values);})
		.style("fill", function(d) {return color(d.name);});

country2.exit().remove();

		
context.append("g")
		.attr("class", "x brush")
		.call(brush)
		.selectAll("rect")
			.attr("y", -6)
			.attr("height", height2+7);
					
		

				
//adds the DoD lines and tooltips
countries.forEach(function(d){	
	tooltipsArray = d3.merge([tooltipsArray,d.values]);
		});
var tooltips = focus.selectAll(".tooltipGroup")
				.data(tooltipsArray);
tooltips.enter()
		.append("g")
		.attr("class", "tooltipGroup")
		.append("line")
		.attr("class", "tooltip")
		.on("click", function(d){
			console.log("clicked");
			updatePaths(d.name);});
tooltips.select(".tooltip")
			.attr("x1", function(d) {return xScale(gd(d.date));})
			.attr("x2", function(d) { return xScale(gd(d.date));})
			.attr("y1", function(d) { return yScale(d.y0);})
			.attr("y2", function(d) {
				if(d.y >0){
				return yScale(d.y + d.y0);
				}
				else{
					return yScale(d.y0);
					}})
			.attr("stroke", "black")
			.style("stroke-width", 5)
			.attr("stroke-opacity", 0)
			.on("mouseover", function(d){
				//changes stroke opacity of the line to make it show up while the user is exploring the map
				d3.select(this).transition()
							.attr("stroke-opacity", 1)
							.duration(10);
				//transition tooltip so that it appears where mouse is hovering
				tooltip.transition()        
					.duration(10)      
					.style("opacity", 1);     
					//prints out country, number of immigrants from that region and period of time over which immigration occured.
				tooltip.html(d.name + "<br/>"  + numFormat(d.y) + " Immigrants" + "<br/>" + "From "+(parseFloat(gd(d.date).getFullYear())-10) + " to " + gd(d.date).getFullYear())  
					.style("left", (d3.event.pageX+5) + "px")     
					.style("top", (d3.event.pageY - 28) + "px");			
							})
			//sets line and tooltip opacity to 0
			.on("mouseout", function(d){
				d3.select(this).transition()
							.attr("stroke-opacity", 0)
							.duration(300);
				tooltip.transition()
						.style("opacity", 0)
						.duration(100);
						});
tooltips.exit().remove();

				
//call this to redraw the tooltips after brushing.
function updateTooltips(){
		tooltips.selectAll(".tooltip")
				.transition()
					.attr("x1", function(d){ return xScale(gd(d.date));})
					.attr("x2", function(d) { return xScale(gd(d.date));});
			}


var numFormat = d3.format(",g");
	
	}
	
function updatePaths(name){
	tooltipsArray=[];
	if (name == "Africa"){
		createGraphic(cache["Africa"],800000);
		location1=name;
		locationSelect();
		theMap.svg.select('.datamaps-subunits').call(transition, p0, p1);
		}
	else if(name == "Asia"){
		createGraphic(cache["Asia"],3500000);
		theMap.svg.selectAll('circle').forEach(function(d) {
					d.forEach(function(d1) {
						d1.remove();
					});
				
				});
		location1=name;
		locationSelect();
		theMap.svg.select('.datamaps-subunits').call(transition, p0, p1);
		}
	else if(name == "Oceania"){
		createGraphic(cache["Oceania"],70000);
		theMap.svg.selectAll('circle').forEach(function(d) {
					d.forEach(function(d1) {
						d1.remove();
					});
				
				});
		location1=name;
		locationSelect();
		theMap.svg.select('.datamaps-subunits').call(transition, p0, p1);		}
	else if(name == "Europe"){
		createGraphic(cache["Europe"],9000000);
		theMap.svg.selectAll('circle').forEach(function(d) {
					d.forEach(function(d1) {
						d1.remove();
					});
				
				});
		location1=name;
		locationSelect();
		theMap.svg.select('.datamaps-subunits').call(transition, p0, p1);
		}
	else if(name == "Central America"){
		createGraphic(cache["Central America"],700000);
		theMap.svg.selectAll('circle').forEach(function(d) {
					d.forEach(function(d1) {
						d1.remove();
					});
				
				});
		location1=name;
		locationSelect();
		theMap.svg.select('.datamaps-subunits').call(transition, p0, p1);
		}
	else if(name == "South America"){
		createGraphic(cache["South America"],900000);
		theMap.svg.selectAll('circle').forEach(function(d) {
					d.forEach(function(d1) {
						d1.remove();
					});
				
				});
		location1=name;
		locationSelect();
		theMap.svg.select('.datamaps-subunits').call(transition, p0, p1);
		}
	else if(name == "America"){
		createGraphic(cache["America"],3000000);
		theMap.svg.selectAll('circle').forEach(function(d) {
					d.forEach(function(d1) {
						d1.remove();
					});
				
				});
		location1=name;
		locationSelect();
		theMap.svg.select('.datamaps-subunits').call(transition, p0, p1);
		}
	else{
		createGraphic(cache["All"],12000000);
		theMap.svg.selectAll('circle').forEach(function(d) {
					d.forEach(function(d1) {
						d1.remove();
					});
				
				});
		location1="World";
		locationSelect();
		theMap.svg.select('.datamaps-subunits').call(transition, p0, p1);
		}
		}
	
function loadAllData(){
		d3.csv("testAfrica.csv", function(error, data){
			cache["Africa"] = data;
		});
		d3.csv("testEurope.csv", function(error, data){
			cache["Europe"]=data;
			//createGraphic(data,9000000);
		});
		d3.csv("testAsia.csv", function(error, data){
			cache["Asia"]=data;;
		});
		d3.csv("testCSV.csv", function(error, data){
			cache["All"]=data;
			createGraphic(data, 12000000);
		});
		d3.csv("testCentralAmerica.csv", function(error, data){
			cache["Central America"]=data;
		});
		d3.csv("testOceania.csv", function(error, data){
			cache["Oceania"]=data;
		});
		d3.csv("testSouthAmerica.csv", function(error, data){
			cache["South America"]=data;
		});
		d3.csv("testAmerica.csv", function(error, data){
			cache["America"]=data;
		});
		
		
		
		}
		
	
///////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//////////////OMG ALL THE CODE////////////////////////////////////

var theMap;
var europeColor = '#9467bd';
var africaColor = '#00fff0';
var southAmericaColor = '#f000f0';
var northAmericaColor = '#fff000';
var asiaColor = '#ff0000';
var centralAmericaColor = '#0ff50f';
var oceaniaColor = '#0f0fff';
var defaultColor = '#000000';

var startYear = 1820;
var endYear = 2000;

var worldMapPos = [500,300,600];
var northAmericaPos = [255,200,200];
var southAmericaPos = [300,350,200];
var centralAmericaPos = [280,265,70];
var europePos = [550,180,150];
var asiaPos = [725,225,200];
var africaPos = [550,300,200];
var oceaniaPos = [850,350,150];

var data1;


var p0 = worldMapPos;
var p1 = northAmericaPos;
var temp;

var location1 = "World";

d3.csv("testCSV.csv", function(error, data){
	createMap(data);
});


function createMap(data){
	
	data1=data;
	
	redrawMap(0,0,0,0,150);	
	mapSelect();
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
      .each("end", function() { mapSelect(); });
		
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
			//'MKD': europeColor,
			
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
			'HTI': northAmericaColor,
			'JAM': northAmericaColor,
			
			
			'BLZ': centralAmericaColor,
			'CRI': centralAmericaColor,
			'SLV': centralAmericaColor,
			'GTM': centralAmericaColor,
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
			
			'EGY': africaColor,
			'ETH': africaColor,
			'LBR': africaColor,
			'MAR': africaColor,
			'ZAF': africaColor,
			
			'AUS': oceaniaColor,
			'NZL': oceaniaColor,
			
			defaultFill: defaultColor
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
			
			'CAN': {fillKey: 'CAN'},
			'MEX': {fillKey: 'MEX'},
			'CUB': {fillKey: 'CUB'},
			'DOM': {fillKey: 'DOM'},
			'HTI': {fillKey: 'HTI'},
			'JAM': {fillKey: 'JAM'},
			
			'BLZ': {fillKey: 'BLZ'},
			'CRI': {fillKey: 'CRI'},
			'SLV': {fillKey: 'SLV'},
			'GTM': {fillKey: 'GTM'},
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
			
			'EGY': {fillKey: 'EGY'},
			'ETH': {fillKey: 'ETH'},
			'LBR': {fillKey: 'LBR'},
			'MAR': {fillKey: 'MAR'},
			'ZAF': {fillKey: 'ZAF'},
			
			'AUS': {fillKey: 'AUS'},
			'NZL': {fillKey: 'NZL'},

		
		}

	});	
};



function bubbles(bubbs) {
	//draw bubbles for thes
	
	if (bubbs) {
		theMap.bubbles(bubbs, {
			popupTemplate: function (geo, data) { 	
					return ['<div class="hoverinfo">' +  data.name,
					'<br/>Immigrants: ' +  data.yeild + '',
					'<br/>Continent: ' +  data.continent + '',
					'<br/>Percentage: ' + data.percentage + '',
					'</div>'].join('');
			}
			
		
		});

		theMap.svg.selectAll('.datamaps-bubble').on('click', function() {
			location1 = this.__data__.country;
			
			
			updatePaths(location1);
			
		
		});
	}
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
	function radius (num1,num2) {
			return 5+70*(num1*1.0)/(num2*1.0);
	};
	
	function parser (d) {
		//console.log("begin");
		//console.log(d);
		var clean = {};
		//console.log("clean");
		for (var prop in d){
		    //console.log(prop);
			if(d.hasOwnProperty(prop)){
				//console.log("if statement");
			
				clean[prop] = parseInt(d[prop])
				
				
			}
			else {
				//console.log("else");
			}
		};
		//console.log("end");
		//console.log(clean);
		return clean;
	};

	
	if (location1=="World") {
		var asia = 0;
		var oceania = 0;
		var northAmerica = 0;
		var southAmerica = 0;
		var centralAmerica = 0;
		var africa = 0;
		var europe = 0;
		
		
		data1.forEach(function(d){
			if (+d.date>=startYear && +d.date<=endYear) {
				africa+= +d.Africa;
				oceania+= +d.Oceania;
				asia+= +d.Asia;
				northAmerica+= +d.America;
				southAmerica+= +d[ 'South America' ];
				centralAmerica+= +d[ 'Central America' ];
				europe+= +d.Europe;
			}
		});
	
		
		var total = asia+oceania+asia+northAmerica+southAmerica+centralAmerica+europe;
		
		
		
		bubbs = [{
			name: 'Asia',
			radius: radius(asia,total),
			yeild: asia,
			continent: 'Asia',
			percentage: (asia*1.0/total),
			country: 'Asia',
			fillKey: 'JPN',
			significance: 'First fusion weapon test by the USSR (not "staged")',
			date: '1953-08-12',
			latitude: 35.07,
			longitude: 78.43
		  },{
			name: 'America',
			radius: radius(northAmerica,total),
			yeild: northAmerica,
			continent: 'America',
			percentage: (northAmerica*1.0/total),
			country: 'America',
			fillKey: 'CAN',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 40,
			longitude: -100
		  },{
			name: 'South America',
			radius: radius(southAmerica,total),
			yeild: southAmerica,
			continent: 'South America',
			country: 'South America',
			percentage: (southAmerica*1.0/total),
			fillKey: 'BRA',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: -10,
			longitude: -60
		  },{
			name: 'Central America',
			radius: radius(centralAmerica,total),
			yeild: centralAmerica,
			continent: 'Central America',
			country: 'Central America',
			percentage: (centralAmerica*1.0/total),
			fillKey: 'CRI',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 10,
			longitude: -85
		  },{
			name: 'Europe',
			radius: radius(europe,total),
			yeild: europe,
			continent: 'Europe',
			country: 'Europe',
			percentage: (europe*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 50,
			longitude: 10
		  },{
			name: 'Africa',
			radius: radius(africa,total),
			yeild: africa,
			continent: 'Africa',
			country: 'Africa',
			percentage: (africa*1.0/total),
			fillKey: 'EGY',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 10,
			longitude: 25
		  },{
			name: 'Oceania',
			radius: radius(oceania,total),
			yeild: oceania,
			continent: 'Oceania',
			percentage: (oceania*1.0/total),
			country: 'Oceania',
			fillKey: 'AUS',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: -23,
			longitude: 133
		  }
		];
		bubbles(bubbs);
	
	}

	else if (location1=='America') {
		
		d3.csv("testAmerica.csv", parser, function(error, data){
		

		
		var canada = 0;
		var mexico = 0;
		var cuba = 0;
		var dominican = 0;
		var haiti = 0;
		var jamaica = 0;
		var total = 0;
		
		
		data.forEach(function(d){
			
			if (+d.date>=startYear && +d.date<=endYear) {
				canada+= d['Canada and Newfoundland 16, 17'];
				total+= d['Canada and Newfoundland 16, 17'];
				mexico+= d['Mexico 17,18'];
				total+= d['Mexico 17,18'];
				cuba+= d.Cuba;
				total+= d.Cuba;
				dominican+= d['Dominican Republic'];
				total+= d['Dominican Republic'];
				haiti+= d.Haiti;
				total+= d.Haiti;
				jamaica+= d['Jamaica 19'];
				total+= d['Jamaica 19'];
			}	
			
		});
		console.log(data);
	
	
		
		bubbs = [{
			name: 'Canada',
			radius: radius(canada,total),
			yeild: canada,
			continent: 'North America',
			country: 'World',
			percentage: (canada*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 60,
			longitude: -50
			},{
			name: 'Mexico',
			radius: radius(mexico,total),
			yeild: mexico,
			continent: 'North America',
			country: 'World',
			percentage: (mexico*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: -50,
			longitude: -22
			},{
			name: 'Jamaica',
			radius: radius(jamaica,total),
			yeild: jamaica,
			continent: 'North America',
			percentage: (jamaica*1.0/total),
			country: 'World',
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: -60,
			longitude: 45
			},{
			name: 'Cuba',
			radius: radius(cuba,total),
			yeild: cuba,
			continent: 'North America',
			country: 'World',
			percentage: (cuba*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: -50,
			longitude: 45
			},{
			name: 'Haiti',
			radius: radius(haiti,total),
			yeild: haiti,
			percentage: (haiti*1.0/total),
			continent: 'North America',
			country: 'World',
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: -57,
			longitude: 65
			},{
			name: 'Dominican Republic',
			radius: radius(dominican,total),
			yeild: dominican,
			continent: 'North America',
			country: 'World',
			percentage: (dominican*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: -57,
			longitude: 70
			}
		];
		console.log("am I getting here");
		bubbles(bubbs);
		});
	}
	else if (location1=='Europe') {
		
		d3.csv("testEurope.csv", parser, function(error, data){
		

		
		var austria = 0;
		var hungary = 0;
		var belgium = 0;
		var bulgaria = 0;
		var czechoslovakia = 0;
		var denmark = 0;
		var finland = 0;
		var france = 0;
		var germany = 0;
		var greece = 0;
		var ireland = 0;
		var italy = 0;
		var netherlands = 0;
		var norway = 0;
		var sweden = 0;
		var poland = 0;
		var portugal = 0;
		var romania = 0;
		var russia = 0;
		var spain = 0;
		var switzerland = 0;
		var uk = 0;
		var yugoslavia = 0;
		
		
		var total = 0;
		
		
		data.forEach(function(d){
			
			if (+d.date>=startYear && +d.date<=endYear) {
				austria += d['Austria 2, 4'];
				hungary += d['Hungary 2'];
				belgium += d['Belgium'];
				bulgaria += d['Bulgaria 5'];
				czechoslovakia += d['Czechoslovakia 6'];
				denmark += d['Denmark'];
				finland += d['Finland'];
				france += d['France 7'];
				germany += d['Germany 3, 4'];
				greece += d['Greece'];
				ireland += d['Ireland 8'];
				italy += d['Italy'];
				netherlands += d['Netherlands'];
				norway += d['Norway 9'];
				sweden += d['Sweden 9'];
				poland += d['Poland 3'];
				portugal += d['Portugal 10'];
				romania += d['Romania'];
				russia += d['Russia 3, 11'];
				spain += d['Spain 12'];
				switzerland += d['Switzerland'];
				uk += d['United Kingdom 8,13'];
				yugoslavia += d['Yugoslavia 14'];
			}	
			
		});
		console.log("wes we are here");
		console.log(uk);
		total = austria + hungary + belgium + bulgaria + czechoslovakia + denmark + finland + france + germany + greece + ireland +italy + netherlands +norway + sweden + poland + portugal + romania + russia + spain + switzerland + uk + yugoslavia;
	console.log(total);
		
		bubbs = [{
			name: 'Austria',
			radius: radius(austria,total),
			yeild: austria,
			continent: 'Europe',
			country: 'World',
			percentage: (austria*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 5,
			longitude: -18
			},{
			name: 'Hungary',
			radius: radius(hungary,total),
			yeild: hungary,
			continent: 'Europe',
			country: 'World',
			percentage: (hungary*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 5,
			longitude: 0
			},{
			name: 'Belgium',
			radius: radius(belgium,total),
			yeild: belgium,
			continent: 'Europe',
			country: 'World',
			percentage: (belgium*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 23,
			longitude: -55
			},{
			name: 'Bulgaria',
			radius: radius(bulgaria,total),
			yeild: bulgaria,
			continent: 'Europe',
			country: 'World',
			percentage: (bulgaria*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: -15,
			longitude: 30
			},{
			name: 'Czechoslovakia',
			radius: radius(czechoslovakia,total),
			yeild: czechoslovakia,
			continent: 'Europe',
			country: 'World',
			percentage: (czechoslovakia*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 15,
			longitude: -18
			},{
			name: 'Denmark',
			radius: radius(denmark,total),
			yeild: denmark,
			continent: 'Europe',
			country: 'World',
			percentage: (denmark*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 45,
			longitude: -40
			},{
			name: 'Finland',
			radius: radius(finland,total),
			yeild: finland,
			continent: 'Europe',
			country: 'World',
			percentage: (finland*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 60,
			longitude: -40
			},{
			name: 'France',
			radius: radius(france,total),
			yeild: france,
			continent: 'Europe',
			country: 'World',
			percentage: (france*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 5,
			longitude: -65
			},{
			name: 'Germany',
			radius: radius(germany,total),
			yeild: germany,
			continent: 'Europe',
			percentage: (germany*1.0/total),
			country: 'World',
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 20,
			longitude: -38
			},{
			name: 'Greece',
			radius: radius(greece,total),
			yeild: greece,
			continent: 'Europe',
			percentage: (greece*1.0/total),
			country: 'World',
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: -30,
			longitude: 15
			},{
			name: 'Ireland',
			radius: radius(ireland,total),
			yeild: ireland,
			continent: 'Europe',
			country: 'World',
			percentage: (ireland*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 32,
			longitude: -100
			},{
			name: 'Italy',
			radius: radius(italy,total),
			yeild: italy,
			continent: 'Europe',
			country: 'World',
			percentage: (italy*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: -15,
			longitude: -28
			},{
			name: 'Netherlands',
			radius: radius(netherlands,total),
			yeild: netherlands,
			continent: 'Europe',
			country: 'World',
			percentage: (netherlands*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 27,
			longitude: -55
			},{
			name: 'Norway',
			radius: radius(norway,total),
			yeild: norway,
			continent: 'Europe',
			country: 'World',
			percentage: (norway*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 60,
			longitude: -40
			},{
			name: 'Sweden',
			radius: radius(sweden,total),
			yeild: sweden,
			continent: 'Europe',
			percentage: (sweden*1.0/total),
			country: 'World',
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 60,
			longitude: -20
			},{
			name: 'Poland',
			radius: radius(poland,total),
			yeild: poland,
			continent: 'Europe',
			country: 'World',
			percentage: (poland*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 25,
			longitude: 0
			},{
			name: 'Portugal',
			radius: radius(portugal,total),
			yeild: portugal,
			continent: 'Europe',
			percentage: (portugal*1.0/total),
			country: 'World',
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: -25,
			longitude: -105
			},{
			name: 'Romania',
			radius: radius(romania,total),
			continent: 'Europe',
			yeild: romania,
			percentage: (romania*1.0/total),
			country: 'World',
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 0,
			longitude: 30
			},{
			name: 'Russia',
			radius: radius(russia,total),
			yeild: russia,
			percentage: (russia*1.0/total),
			continent: 'Europe',
			country: 'World',
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 32,
			longitude: 70
			},{
			name: 'Spain',
			radius: radius(spain,total),
			yeild: spain,
			continent: 'Europe',
			country: 'World',
			percentage: (spain*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: -25,
			longitude: -92
			},{
			name: 'Switzerland',
			radius: radius(switzerland,total),
			yeild: switzerland,
			continent: 'Europe',
			percentage: (switzerland*1.0/total),
			country: 'World',
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 5,
			longitude: -45
			},{
			name: 'United Kingdom',
			radius: radius(uk,total),
			yeild: uk,
			percentage: (uk*1.0/total),
			continent: 'Europe',
			country: 'World',
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 32,
			longitude: -85
			},{
			name: 'Yugoslavia',
			radius: radius(yugoslavia,total),
			yeild: yugoslavia,
			continent: 'Europe',
			country: 'World',
			percentage: (yugoslavia*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: -8,
			longitude: 0
			}
		];
		bubbles(bubbs);
		});
	}
	else if (location1=='Africa') {
		
		d3.csv("testAfrica.csv", parser, function(error, data){
		

		
		var egypt = 0;
		var ethiopia= 0;
		var liberia = 0;
		var morocco= 0;
		var southAfrica= 0;
		
		var total = 0;
		
		
		data.forEach(function(d){
			
			if (+d.date>=startYear && +d.date<=endYear) {
				egypt += d['Egypt'];
				ethiopia+= d['Ethiopia'];
				liberia += d['Liberia'];
				morocco += d['Morocco'];
				southAfrica+= d['South Africa'];
			}	
			
			
		});
		total = egypt + ethiopia + liberia + morocco + southAfrica;
		console.log(morocco);
		bubbs = [{
			name: 'Egypt',
			radius: radius(egypt,total),
			yeild: egypt,
			continent: 'Africa',
			percentage: (egypt*1.0/total),
			country: 'World',
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 85,
			longitude: 30
			},{
			name: 'Ethiopia',
			radius: radius(ethiopia,total),
			yeild: ethiopia,
			continent: 'Africa',
			percentage: (ethiopia*1.0/total),
			country: 'World',
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 30,
			longitude: 60
			},{
			name: 'Liberia',
			radius: radius(liberia,total),
			yeild: liberia,
			continent: 'Africa',
			percentage: (liberia*1.0/total),
			country: 'World',
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 20,
			longitude: -85
			},{
			name: 'Morocco',
			radius: radius(morocco,total),
			yeild: morocco,
			continent: 'Africa',
			country: 'World',
			percentage: (morocco*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 85,
			longitude: -90
			},{
			name: 'South Africa',
			radius: radius(southAfrica,total),
			yeild: southAfrica,
			continent: 'Africa',
			country: 'World',
			percentage: (southAfrica*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: -87,
			longitude: 15
			}
		];
		bubbles(bubbs);
		});
	}
	else if (location1=='Central America') {
		
		d3.csv("testCentralAmerica.csv", parser, function(error, data){
		
		
		
		var belize = 0;
		var costaRica= 0;
		var elSalvador = 0;
		var guatemala= 0;
		var honduras= 0;
		var nicaragua= 0;
		var panama= 0;
		
		var total = 0;
		
		
		data.forEach(function(d){
			
			if (+d.date>=startYear && +d.date<=endYear) {
				belize += d['Belize'];
				costaRica+= d['Costa Rica'];
				elSalvador += d['El Salvador'];
				guatemala += d['Guatemala'];
				honduras+= d['Honduras'];
				nicaragua+= d['Nicaragua'];
				panama+= d['Panama 20'];
			}	
			
			
		});
		total = belize+costaRica+elSalvador+guatemala+honduras+nicaragua+panama;
		
		bubbs = [{
			name: 'Belize',
			radius: radius(belize,total),
			yeild: belize,
			continent: 'Central America',
			country: 'World',
			percentage: (belize*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 35,
			longitude: -40
			},{
			name: 'Costa Rica',
			radius: radius(costaRica,total),
			yeild: costaRica,
			continent: 'Central America',
			percentage: (costaRica*1.0/total),
			country: 'World',
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: -30,
			longitude: 0
			},{
			name: 'El Salvador',
			radius: radius(elSalvador,total),
			yeild: elSalvador,
			continent: 'Central America',
			country: 'World',
			percentage: (elSalvador*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 3,
			longitude: -40
			},{
			name: 'Guatemala',
			radius: radius(guatemala,total),
			yeild: guatemala,
			continent: 'Central America',
			country: 'World',
			percentage: (guatemala*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 25,
			longitude: -50
			},{
			name: 'Honduras',
			radius: radius(honduras,total),
			yeild: honduras,
			continent: 'Central America',
			country: 'World',
			percentage: (honduras*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 12,
			longitude: -25
			},{
			name: 'Nicaragua',
			radius: radius(nicaragua,total),
			yeild: nicaragua,
			continent: 'Central America',
			country: 'World',
			percentage: (nicaragua*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: -5,
			longitude: -10
			},{
			name: 'Panama',
			radius: radius(panama,total),
			yeild: panama,
			continent: 'Central America',
			country: 'World',
			percentage: (panama*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: -40,
			longitude: 30
			}
		];
		bubbles(bubbs);
		});
	}
	else if (location1=='South America') {
		
		d3.csv("testSouthAmerica.csv", parser, function(error, data){
		
		
		
		var argentina = 0;
		var bolivia= 0;
		var brazil= 0;
		var chile= 0;
		var colombia= 0;
		var ecuador= 0;
		var guyana= 0;
		var paraguay= 0;
		var peru= 0;
		var suriname= 0;
		var uruguay= 0;
		var venezuela= 0;
		
		var total = 0;
		
		
		data.forEach(function(d){
			
			if (+d.date>=startYear && +d.date<=endYear) {
				argentina += d['Argentina'];
				bolivia+= d['Bolivia'];
				brazil += d['Brazil'];
				chile += d['Chile'];
				colombia+= d['Colombia'];
				ecuador+= d['Ecuador'];
				guyana+= d['Guyana'];
				paraguay+= d['Paraguay'];
				peru+= d['Peru'];
				suriname+= d['Suriname'];
				uruguay+= d['Uruguay'];
				venezuela+= d['Venezuela'];
				
			}	
			
			
		});
		total = argentina +bolivia+brazil +chile +colombia +ecuador+guyana+paraguay+peru+suriname+uruguay+venezuela;
		console.log("here I am");
		console.log(argentina);
		bubbs = [{
			name: 'Argentina',
			radius: radius(argentina,total),
			yeild: argentina,
			continent: 'South America',
			percentage: (argentina*1.0/total),
			country: 'World',
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: -50,
			longitude: 35
			},{
			name: 'Bolivia',
			radius: radius(bolivia,total),
			yeild: bolivia,
			percentage: (bolivia*1.0/total),
			continent: 'South America',
			country: 'World',
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 10,
			longitude: 30
			},{
			name: 'Brazil',
			radius: radius(brazil,total),
			yeild: brazil,
			percentage: (brazil*1.0/total),
			continent: 'South America',
			country: 'World',
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 20,
			longitude: 80
			},{
			name: 'Chile',
			radius: radius(chile,total),
			yeild: chile,
			continent: 'South America',
			country: 'World',
			percentage: (chile*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: -50,
			longitude: 10
			},{
			name: 'Colombia',
			radius: radius(colombia,total),
			yeild: colombia,
			continent: 'South America',
			country: 'World',
			percentage: (colombia*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 65,
			longitude: 10
			},{
			name: 'Ecuador',
			radius: radius(ecuador,total),
			yeild: ecuador,
			percentage: (ecuador*1.0/total),
			continent: 'South America',
			country: 'World',
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 55,
			longitude: -5
			},{
			name: 'Guyana',
			radius: radius(guyana,total),
			yeild: guyana,
			continent: 'South America',
			country: 'World',
			percentage: (guyana*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 75,
			longitude: 50	
			},{
			name: 'Paraguay',
			radius: radius(paraguay,total),
			yeild: paraguay,
			continent: 'South America',
			country: 'World',
			percentage: (paraguay*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: -10,
			longitude: 50
			},{
			name: 'Peru',
			radius: radius(peru,total),
			yeild: peru,
			continent: 'South America',
			country: 'World',
			percentage: (peru*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 30,
			longitude: 0
			},{
			name: 'Suriname',
			radius: radius(suriname,total),
			yeild: suriname,
			continent: 'South America',
			country: 'World',
			percentage: (suriname*1.0/total),
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 70,
			longitude: 60
			},{
			name: 'Uruguay',
			radius: radius(uruguay,total),
			yeild: uruguay,
			percentage: (uruguay*1.0/total),
			continent: 'South America',
			country: 'World',
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: -40,
			longitude: 60
			},{
			name: 'Venezuela',
			radius: radius(venezuela,total),
			yeild: venezuela,
			percentage: (venezuela*1.0/total),
			continent: 'South America',
			country: 'World',
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: 80,
			longitude: 36
			}
		];
		bubbles(bubbs);
		});
	}
		else if (location1=='Oceania') {
		
		d3.csv("testOceania.csv", parser, function(error, data){
		

		
		var australia = 0;
		var newZealand= 0;
		
		var total = 0;
		
		
		data.forEach(function(d){
			
			if (+d.date>=startYear && +d.date<=endYear) {
				australia += d['Australia'];
				newZealand += d['New Zealand'];
			}	
			
			
		});
		total = australia + newZealand;
		
		bubbs = [{
			name: 'Australia',
			radius: radius(australia,total),
			yeild: australia,
			percentage: (australia*1.0/total),
			continent: 'Oceania',
			country: 'World',
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: -20,
			longitude: 0
			},{
			name: 'New Zealand',
			radius: radius(newZealand,total),
			yeild: newZealand,
			percentage: (newZealand*1.0/total),
			continent: 'Oceania',
			country: 'World',
			fillKey: 'GBR',
			significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
			date: '1955-11-22',
			latitude: -80,
			longitude: 160
			}
		];
		bubbles(bubbs);
		});
	}
	else if (location1=="Asia") {
		
		
		

			d3.csv("testAsia.csv", parser, function(error, data){
				var bubbs;
				var china = 0;
				var hongKong= 0;
				var india = 0;
				var iran= 0;
				var israel= 0;
				var japan = 0;
				var jordan = 0;
				var korea = 0;
				var philippines = 0;
				var syria = 0;
				var taiwan = 0;
				var turkey = 0;
				var vietnam = 0;
			
				var total = 0;
			
			console.log(data);
			
			data.forEach(function(d){
				if (d.date>=startYear && d.date<=endYear) {
					china += d.China;
					hongKong+= d['Hong Kong'];
					india += d.India;
					iran+= d.Iran;
					israel+= d.Israel;
					japan += d.Japan;
					jordan += d.Jordan;
					korea += d['Korea 15'];
					philippines += d.Philippines;
					syria += d.Syria;
					taiwan += d.Taiwan;
					turkey += d.Turkey;
					vietnam += d.Vietnam;
					
						

				}
			
			
			});
			
			total = china+hongKong+ india+ iran+ israel +japan +jordan +korea +philippines +syria +taiwan +turkey +vietnam;
		
			bubbs = [{
				name: 'China',
				radius: radius(china,total),
				yeild: china,
				percentage: (china*1.0/total),
				continent: 'Asia',
				country: 'World',
				fillKey: 'JPN',
				significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
				date: '1955-11-22',
				latitude: 20,
				longitude: 40
				},{
				name: 'Hong Kong',
				radius: radius(hongKong,total),
				yeild: hongKong,
				percentage: (hongKong*1.0/total),
				continent: 'Asia',
				country: 'World',
				fillKey: 'JPN',
				significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
				date: '1955-11-22',
				latitude: -25,
				longitude: 70
				},{
				name: 'India',
				radius: radius(india,total),
				yeild: india,
				continent: 'Asia',
				country: 'World',
				percentage: (india*1.0/total),
				fillKey: 'JPN',
				significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
				date: '1955-11-22',
				latitude: -15,
				longitude: -22
				},{
				name: 'Iran',
				radius: radius(iran,total),
				yeild: iran,
				continent: 'Asia',
				percentage: (iran*1.0/total),
				country: 'World',
				fillKey: 'JPN',
				significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
				date: '1955-11-22',
				latitude: 14,
				longitude: -100
				},{
				name: 'Israel',
				radius: radius(israel,total),
				yeild: israel,
				continent: 'Asia',
				country: 'World',
				percentage: (israel*1.0/total),
				fillKey: 'JPN',
				significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
				date: '1955-11-22',
				latitude: 8,
				longitude: -150
				},{
				name: 'Japan',
				radius: radius(japan,total),
				yeild: japan,
				country: 'World',
				continent: 'Asia',
				percentage: (japan*1.0/total),
				fillKey: 'JPN',
				significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
				date: '1955-11-22',
				latitude: 30,
				longitude: 160
				},{
				name: 'Jordan',
				radius: radius(jordan,total),
				yeild: jordan,
				continent: 'Asia',
				percentage: (jordan*1.0/total),
				country: 'World',
				fillKey: 'JPN',
				significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
				date: '1955-11-22',
				latitude: 8,
				longitude: -147
				},{
				name: 'Korea',
				radius: radius(korea,total),
				yeild: korea,
				continent: 'Asia',
				country: 'World',
				percentage: (korea*1.0/total),
				fillKey: 'JPN',
				significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
				date: '1955-11-22',
				latitude: 25,
				longitude: 125
				},{
				name: 'Philippines',
				radius: radius(philippines,total),
				yeild: philippines,
				continent: 'Asia',
				percentage: (philippines*1.0/total),
				country: 'World',
				fillKey: 'JPN',
				significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
				date: '1955-11-22',
				latitude: -47,
				longitude: 107
				},{
				name: 'Syria',
				radius: radius(syria,total),
				yeild: syria,
				continent: 'Asia',
				percentage: (syria*1.0/total),
				country: 'World',
				fillKey: 'JPN',
				significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
				date: '1955-11-22',
				latitude: 18,
				longitude: -143
				},{
				name: 'Taiwan',
				radius: radius(taiwan,total),
				yeild: taiwan,
				continent: 'Asia',
				percentage: (taiwan*1.0/total),
				country: 'World',
				fillKey: 'JPN',
				significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
				date: '1955-11-22',
				latitude: -15,
				longitude: 107
				},{
				name: 'Turkey',
				radius: radius(turkey,total),
				yeild: turkey,
				continent: 'Asia',
				country: 'World',
				percentage: (turkey*1.0/total),
				fillKey: 'JPN',
				significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
				date: '1955-11-22',
				latitude: 32,
				longitude: -145
				},{
				name: 'Vietnam',
				radius: radius(vietnam,total),
				yeild: vietnam,
				continent: 'Asia',
				percentage: (vietnam*1.0/total),
				country: 'World',
				fillKey: 'JPN',
				significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
				date: '1955-11-22',
				latitude: -47,
				longitude: 70
				}
			];
		
			bubbles(bubbs);	
		});
			
		
		
		
		
		
	}

};
	
	
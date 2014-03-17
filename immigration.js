

//create constant buffers for margin, as well as variables for height, width
// bottom edge and right edge of frame
var margin = {top:40, right:20, bottom: 30, left:40};
var width = 1000-margin.left-margin.right;
var height = 500-margin.top-margin.bottom;
var frameBase = 500-margin.bottom;
var frameRight = 1000-margin.right;


d3.csv("testCSV.csv", function(data){
		createGraphic(data);
	});

function createGraphic(data){

console.log(data);
//load the data for the graphic
/*d3.csv("", function(data){
		data.forEach(function(d){
			//load in data
			d.Country = d.Country;
			d.Continent = d.Continent;
			d.Region = d.Region;
			d.yr_1990 = +d.yr_1990;
			d.yr_1980 = +d.yr_1980;
			d.yr_1970 = +d.yr_1970;
			d.yr_1960 = +d.yr_1960;
	});*/
	


//create scales for x axis (time) and y axis (dependent on variable)	
 var xScale = d3.time.scale()
				.range([0, width]);
				
 var yScale = d3.scale.linear()
				.range([height, 0]);
	
 //create x and y axis
 var xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottom");

//need to create a function to (re)format the y axis whenever we click
//so that the scale stays relevant to the number of immigrants being displayed			
 var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left");
				
var color = d3.scale.category20();
				
var area = d3.svg.area()
	.x(function(d) {return xScale(d.date); })
	.y0(function(d) {return yScale(d.y0);})
	.y(function(d) {return yScale(d.y0+d.y);});
	
var stack = d3.layout.stack()
				.values(function(d) {return d.values;});
	
var canvas = d3.select("body").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

canvas.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0,"+ height + ")")
		.call(xAxis);
canvas.append("g")
		.attr("class", "y axis")
		.call(yAxis);
	
	
	}
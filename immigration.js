

//create constant buffers for margin, as well as variables for height, width
// bottom edge and right edge of frame
var margin = {top:40, right:20, bottom: 30, left:90};
var width = 1000-margin.left-margin.right;
var height = 500-margin.top-margin.bottom;
var frameBase = 500-margin.bottom;
var frameRight = 1000-margin.right;


d3.csv("testCSV.csv", function(error, data){
	createGraphic(data);
	});
function createGraphic(data){

var currY0= 0;
var prevY0 = 0;


//create scales for x axis (time) and y axis (dependent on variable)	
 var xScale = d3.time.scale()
				.domain([new Date(1820, 0,1), new Date(2010, 11, 30)])
				.range([0, width]);
				
 var yScale = d3.scale.linear()
				.range([height, 0])
				.domain([0, 12000000]) ;
	
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
	.y1(function(d) {
		var y0= parseFloat(d.y0);
		var y= parseFloat(d.y);
		var sum= y0+y;
		return yScale(sum);});
	

var stack = d3.layout.stack()
				.values(function(d) {return d.values;});

var canvas = d3.select("body").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.attr("overflow", "visible")
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				
color.domain(d3.keys(data[0]).filter(function(key) {return key !== "date";}));
data.forEach(function(d){
	year= +d.date;
	nDate= new Date(year, 1,15);			
	d.date = nDate;

	});


var countries = stack(color.domain().map(function(name) {
				return {
					name: name,
					values: data.map(function(d){
						return {date: d.date, y: d[name], prevY: 0};
						
						})
						};
					}));
					
countries.forEach(function(d){
		d.values.forEach(function(d){
			d.y= parseFloat(d.y);
			d.y0= parseFloat(d.y0);
			d.prevY=d.y0;
			d.y0=d.y+d.prevY;
			})});
console.log(countries);
var country = canvas.selectAll(".country")
					.data(countries)
					.enter()
						.append("g")
						.attr("class", "country");

country.append("path")
		.attr("class", "area")
		.attr("d", function(d) { 
			return area(d.values);})
		.style("fill", function(d) {return color(d.name);});
		
country.append("text")
		.datum(function(d) {return {name: d.name, value: d.values[d.values.length - 1]};})
		.attr("transform", function(d) { return "translate(" + xScale(d.value.date) + "," + yScale(d.value.y0 +d.value.y/2)+ ")";})
		.attr("x", -6)
		.attr("dy", ".35em")
		.text(function(d) { return d.name;});
				
canvas.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0,"+ height + ")")
		.call(xAxis);
		
canvas.append("g")
		.attr("class", "y axis")
		.call(yAxis);

		
function getDate(d){
	return function(d){
		year = +d;
		console.log(year);
		return (new Date(year, 0,1));
		};}
		
	
	}
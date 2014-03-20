

//create constant buffers for margin, as well as variables for height, width
// bottom edge and right edge of frame
var margin = {top:40, right:20, bottom: 30, left:90};
var width = 1000-margin.left-margin.right;
var height = 500-margin.top-margin.bottom;
var frameBase = 500-margin.bottom;
var frameRight = 1000-margin.right;
var currLine=0;


d3.csv("testCSV.csv", function(error, data){
	createGraphic(data);
	});
function createGraphic(data){


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

//this variable will be used as a function and applied
//to the data later in the code to create blocks of area with an
//x position of x, and a bottom y of y0 and a top y of y1				
var area = d3.svg.area()
	.x(function(d) {return xScale(d.date); })
	.y0(function(d) {return yScale(d.y0);})
	.y1(function(d) {return yScale(d.y0+d.y);});
	

//this creates a stack layout with the array stored in d.values
var stack = d3.layout.stack()
				.values(function(d) {return d.values;});

//this is the svg canvas we will draw to
var canvas = d3.select("body").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.attr("overflow", "visible")
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//adding information for the tooltip
var tooltip = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

//this takes the color variable made above and maps its domain to the 8 different
//headings in our .csv file (or the row called by data[0]), filtering out the first column, "date"				
color.domain(d3.keys(data[0]).filter(function(key) {return key !== "date";}));

//this command runs through each element of data and creates a new Date() object to replace the year
//that was currently in the date variable.
data.forEach(function(d){
	year= +d.date;
	nDate= new Date(year, 1,15);			
	d.date = nDate;

	});


// here, we take the domain of color, set above to be each of our continent names and
// "total". We then map each of these names into an array called countries
// and give them a variable called name, and a second variable called values 
//in which we then map all of the data for the current country giving each object in
//the values array a date variable and a y variable.
var countries = stack(color.domain().map(function(name) {
				return {
					name: name,
					values: data.map(function(d){
						return {date: d.date, y: parseFloat(d[name]), y0: 0};
						
						})
						};
					}));

//this code here makes d.y and d.y0 floats, and introduces a third variable, prevY to keep track of what
//the d.y0 should be. d.y0 is now set as the top height					
countries.forEach(function(d){
		d.values.forEach(function(d){
			d.y= parseFloat(d.y);
			d.y0= parseFloat(d.y0);
			})});


				
			
//console.log(countries);

//create a country object for every country in the array countries
var country = canvas.selectAll(".country")
					.data(countries)
					.enter()
						.append("g")
						.attr("class", "country");
							
//append to each country a path that should create a line based off of 
//the values of data in that country and what the area function returns for it
// gives the path color based off of the color function
country.append("path")
		.attr("class", "area")
		.attr("d", function(d) { 
			return area(d.values);})
		.style("fill", function(d) {return color(d.name);})
			/*.on("mouseover",function(d){
				d3.select(this).attr("stroke", "black").attr("stroke-width", 1).style("fill", function(d) {return d3.rgb(color(d.name)).darker();});})
			.on("mouseout", function(d){
				d3.select(this).attr("stroke-width", 0).style("fill", function(d){return color(d.name);});})*/;
				



//adds the DoD lines and tooltips
countries.forEach(function(d, i){
	var lineClass= "line" + currLine;
	currLine++;
	var currCountry= d.name;
	console.log(lineClass);
	canvas.selectAll(lineClass)
			.data(d.values)
			.enter()
				.append("line")
				.attr("class", lineClass)
				.attr("x1", function(d) {return xScale(d.date);})
				.attr("x2", function(d) { return xScale(d.date);})
				.attr("y1", function(d) { return yScale(d.y0);})
				.attr("y2", function(d) {
					if(d.y >0){
					return yScale(d.y + d.y0);
					}
					else{
						return yScale(d.y0);
						}})
				//.attr("class", ".infoLine")
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
						.duration(200)      
						.style("opacity", 1);     
						//prints out country, number of immigrants from that region and period of time over which immigration occured.
					tooltip.html(currCountry + "<br/>"  + d.y + " Immigrants" + "<br/>" + "From "+(parseFloat(d.date.getFullYear())-10) + " to " + d.date.getFullYear())  
						.style("left", (d3.event.pageX+5) + "px")     
						.style("top", (d3.event.pageY - 28) + "px");			
								})
				//sets line and tooltip opacity to 0
				.on("mouseout", function(d){
					d3.select(this).transition()
								.attr("stroke-opacity", 0)
								.duration(10);
					tooltip.transition()
							.style("opacity", 0)
							.duration(100);
							});
				});
				
currLine=0;

// append the x and y axis to the canvas.		
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
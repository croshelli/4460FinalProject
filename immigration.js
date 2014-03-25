

//create constant buffers for margin, as well as variables for height, width
// bottom edge and right edge of frame
var margin = {top:40, right:20, bottom: 100, left:90};
var margin2 = {top: 430, right: 20, bottom: 20, left: 90};
var width = 1000-margin.left-margin.right;
var height = 500-margin.top-margin.bottom;
var height2 = 500 - margin2.top - margin2.bottom;
var frameBase = 500-margin.bottom;
var frameRight = 1000-margin.right;
var currLine=0;
var currLine2=0;
var currValue=0;
var countrySelection = "all";
var cache = {};
var tooltipsArray = [];
//create x and y scales and axis
var xScale = d3.time.scale().range([0, width]);
var yScale = d3.scale.linear().range([height, 0]).domain([0, 12000000]) ;
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
var canvas = d3.select("body").append("svg")
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



function createGraphic(data){

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
yScale2.domain(yScale.domain());
//need to write function to update yScale domain


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
		
		
country.selectAll("path").attr("d", function(d) { return area(d.values);})
		.style("fill", function(d) {return color(d.name);});
			
country.exit().remove();
			
var country2 = context.selectAll(".country2")
				.data(countries);

country2.enter()
		.append("g")
		.attr("class", "country2")
		.append("path")
		.attr("class", "area");
					
country2.selectAll("path")
		.attr("d", function(d){return area2(d.values);})
		.style("fill", function(d) {return color(d.name);});

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

		//console.log(tooltipsArray);

var tooltips = focus.selectAll(".tooltip")
				.data(tooltipsArray);
	
tooltips.enter()
		.append("g")
		.attr("class", "tooltipGroup")
		.append("line")
		.attr("class", "tooltip");

tooltips.selectAll("line")
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
				
//call this to redraw the tooltips after brushing.
function updateTooltips(){
		tooltips.selectAll("line")
				.transition()
					.attr("x1", function(d){ return xScale(gd(d.date));})
					.attr("x2", function(d) { return xScale(gd(d.date));});
			}


var numFormat = d3.format(",g");
	
	}
	
function loadAllData(){
		d3.csv("testAfrica.csv", function(error, data){
			cache["Africa"] = data;
		});
		d3.csv("testEurope.csv", function(error, data){
			cache["Europe"]=data;
			//createGraphic(data);
		});
		d3.csv("testAsia.csv", function(error, data){
			cache["Asia"]=data;;
		});
		d3.csv("testCSV.csv", function(error, data){
			cache["All"]=data;
			createGraphic(data);
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
		
		
		
		}
	
	
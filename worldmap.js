d3.csv("testCSV.csv", function(error, data){

createMap(data);

}); 


function createMap(data){
	data.forEach(function(d){
		console.log(d.Africa);
	});
	var bombMap = new Datamap({
		element: document.getElementById('container'),
		scope: 'world',
		geographyConfig: {
			popupOnHover: true,
			highlightOnHover: true
		},
  
		fills: {
			'USA': '#9467bd',
			'RUS': '#9467bd',
			'PRK': '#ff7f0e',
			'PRC': '#2ca02c',
			'IND': '#e377c2',
			'GBR': '#8c564b',
			'FRA': '#d62728',
			'PAK': '#7f7f7f',
			defaultFill: '#80397b'
		},
		data: {
			'RUS': {fillKey: 'RUS'},
			'PRK': {fillKey: 'PRK'},
			'PRC': {fillKey: 'PRC'},
			'IND': {fillKey: 'IND'},
			'GBR': {fillKey: 'GBR'},
			'FRA': {fillKey: 'FRA'},
			'PAK': {fillKey: 'PAK'},
			'USA': {fillKey: 'USA'}
		}
	});

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
			longitude: 78.43

		  },{
			name: 'Tsar Bomba',
			radius: 75,
			yeild: 50000,
			country: 'USSR',
			fillKey: 'RUS',
			significance: 'Largest thermonuclear weapon ever tested—scaled down from its initial 100 Mt design by 50%',
			date: '1961-10-31',
			latitude: 73.482,
			longitude: 54.5854
		  },{
			name: 'Big Bomba',
			radius: 75,
			yeild: 50000,
			country: 'USA',
			fillKey: 'USA',
			significance: 'Largest thermonuclear weapon ever tested—scaled down from its initial 100 Mt design by 50%',
			date: '1961-10-31',
			latitude: 37.482,
			longitude: 280.5854
		  }
		];
	//draw bubbles for bombs
	bombMap.bubbles(bombs, {
		popupTemplate: function (geo, data) { 	
				return ['<div class="hoverinfo">' +  data.name,
				'<br/>Payload: ' +  data.yeild + ' kilotons',
				'<br/>Country: ' +  data.country + '',
				'<br/>Date: ' +  data.date + '',
				'</div>'].join('');
		}
	});
	function redrawMap(element){
		var bombMap = new Datamap({
			element: document.getElementById('container'),
			scope: 'world',
			geographyConfig: {
				popupOnHover: true,
				highlightOnHover: true
			},
			setProjection: function(element) {
				var projection = d3.geo.equirectangular()
				.center([23, -3])
				.rotate([4.4, 0])
				.scale(400)
				.translate([element.offsetWidth / 2, element.offsetHeight / 2]);
				var path = d3.geo.path()
				.projection(projection);
				return {path: path, projection: projection}; 
			},
			fills: {
				'USA': '#9467bd',
				'RUS': '#9467bd',
				'PRK': '#ff7f0e',
				'PRC': '#2ca02c',
				'IND': '#e377c2',
				'GBR': '#8c564b',
				'FRA': '#d62728',
				'PAK': '#7f7f7f',
				defaultFill: '#80397b'
			},
			data: {
				'RUS': {fillKey: 'RUS'},
				'PRK': {fillKey: 'PRK'},
				'PRC': {fillKey: 'PRC'},
				'IND': {fillKey: 'IND'},
				'GBR': {fillKey: 'GBR'},
				'FRA': {fillKey: 'FRA'},
				'PAK': {fillKey: 'PAK'},
				'USA': {fillKey: 'USA'}
			}
		});

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
				longitude: 78.43

			  },{
				name: 'Tsar Bomba',
				radius: 75,
				yeild: 50000,
				country: 'USSR',
				fillKey: 'RUS',
				significance: 'Largest thermonuclear weapon ever tested—scaled down from its initial 100 Mt design by 50%',
				date: '1961-10-31',
				latitude: 73.482,
				longitude: 54.5854
			  },{
				name: 'Big Bomba',
				radius: 75,
				yeild: 50000,
				country: 'USA',
				fillKey: 'USA',
				significance: 'Largest thermonuclear weapon ever tested—scaled down from its initial 100 Mt design by 50%',
				date: '1961-10-31',
				latitude: 37.482,
				longitude: 280.5854
			  }
			];
		};
	};

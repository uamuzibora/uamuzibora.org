function table(data,location){
    html='<table class="table table-bordered table-hover"><tr><td></td> \
		<th colspan="2">Children (0&mdash;14yrs)</th><th colspan="2">Adults</th> \
		<th colspan="2">Totals</th><th>Grand Totals</th></tr> \
		<tr><td></td><th>M</th><th>F</th><th>M</th><th>F</th><th>M</th><th>F</th><td></td>';
    var sums = [0,0,0,0,0,0,0]
    keys = Object.keys(data);
    for (var k = 0; k < keys.length; k++){
	key = keys.sort()[k]
	html += '<tr><td>' + key + '</td>'
	var sum_m = 0;
	var sum_f = 0;
	for (var j = 0; j < 4; j++){
	    var sum = 0;
	    if(location){
		for(var loc in data[key]){
		    sum += data[key][loc][j]
		}
	    } else {
		sum = data[key][j];
	    }
	    if (j == 0 || j == 2){
		sum_m += sum
	    } else {
		sum_f += sum
	    }
	    sums[j] += sum;
	    html += '<td>' + sum + '</td>'
	}
	sums[4] += sum_m
	sums[5] += sum_f
	sums[6] += (sum_m + sum_f)
	html += '<td>' + sum_m + '</td><td>' + sum_f + '</td><td>' + (sum_m + sum_f) + '</tr>'
    }
    if(keys.length > 1){
	html += "<tr><td>Sub-total</td>"
	for (var i = 0; i < sums.length; i++){
	    html += '<td>' + sums[i] + '</td>'
	}
    }
    return html + '</tr></table>';
};

function scale(data,scaling,scale,level){
    // alert(JSON.stringify(data))
    //alert(JSON.stringify(scaling))
    return_data = {}
    for(key in data){
	if (level == 1){
	    return_data[key] = data[key] / scaling[key] * scale
	}
	if(level == 2){
	    return_data[key] = {}
	    for (key2 in data[key]){
		return_data[key][key2] = data[key][key2] / scaling[key] * scale
	    }
	}

    }
    return return_data
}

function percent_change(data,level,which){
    if(which == "ready"){
	var keys = Object.keys(data)
	keys.sort();
	return Math.round((data[keys[keys.length - 1]] - data[keys[0]]) / data[keys[0]] * 100)
    }

    if(which == "total"){
	data = total_time_data(data,level)
	var keys = Object.keys(data)
	return Math.round((data[keys[keys.length - 1]] - data[keys[0]]) / data[keys[0]] * 100)
    }
    if (which == "individual"){
	var keys = Object.keys(data)
	return_data = {}
	for(key in data[keys[0]]){
	    return_data[key] = Math.round((data[keys[keys.length - 1]][key] - data[keys[0]][key]) / data[keys[0]][key] * 100)
	}
	return return_data
    }
}

function fractional_change(data,level,which){
    if(which == "ready"){
	var keys = Object.keys(data)
	keys.sort();
	return (data[keys[keys.length - 1]] - data[keys[0]]) / data[keys[0]]
    }

    if(which == "total"){
	data = total_time_data(data,level)
	var keys = Object.keys(data)
	return (data[keys[keys.length - 1]] - data[keys[0]]) / data[keys[0]]
    }
    if (which == "individual"){
	var keys = Object.keys(data)
	return_data = {}
	for(key in data[keys[0]]){
	    return_data[key] = (data[keys[keys.length - 1]][key] - data[keys[0]][key]) / data[keys[0]][key]
	}
	return return_data
    }
}

function extractTimeData(data,key,group){
    var keys = Object.keys(data);
    keys.sort();
    var timedata = {}
    if (!group){
	for (var i = 0; i < keys.length; i++){
	    k = keys[i];
	    var date = new Date(k); 
	    var sum=0;
	    for (var j = 0; j < 4; j++){
		for(var loc in data[k][key]){
		    sum += data[k][key][loc][j];
		}
	    }
	    timedata[date.getTime()] = sum
	}
    }
    if (group == "location"){
	for (var i = 0; i < keys.length; i++){
	    k = keys[i];
	    var date = new Date(k); 
	    timedata[date.getTime()] = {}
	    for (var loc in data[k][key]){
		var sum = 0;
		for(var j = 0; j < 4; j++){
		    sum += data[k][key][loc][j];
		}
		timedata[date.getTime()][loc] = sum;
	    }
	}
    }
   if (group == "location_text"){
       for (var i=0; i < keys.length; i++){
	   k = keys[i];
	   var date = new Date(k);
	   timedata[date.getTime()] = {}
	   inner_keys=Object.keys(data[k])
	   for(loc in data[k][inner_keys[0]]){
	       for(var t in data[k]){
		   var sum = 0;
    		   for(var j = 0 ; j < 4 ; j++){
    		       sum += data[k][t][loc][j];
    		   }
    	       }
    	       timedata[date.getTime()][loc]=sum;	       
	   }
       }
    }
    if (group == "text"){
	for (var i=0; i < keys.length; i++){
	    k = keys[i];
	    var date = new Date(k);
	    timedata[date.getTime()] = {}
	    for(var t in data[k][key]){
		var sum = 0;
		for(var loc in data[k][key][t]){
    		    for(var j = 0 ; j < 4 ; j++){
    			sum += data[k][key][t][loc][j];
    		    }
    		}
    		timedata[date.getTime()][t]=sum;
    	    }
    	}
    }
    return timedata
}

function total_time_data(data,level){
    ret_data = {}
    for(k in data){
	sum = 0;
	for(l in data[k]){
	    if (level == 2){
		for(j in data[k][j]){
		    sum += data[k][l];
		}
	    } else {
		sum += data[k][l];
	    }
	}
	ret_data[k]=sum
    }
    return ret_data
}

function line_chart(data,chart_id,scaling,xAxisLabel,yAxisLabel){
    var timedata_t = {}
    keys = Object.keys(data)
    locations = Object.keys(data[keys[keys.length - 1]]);
    max = 0;
    max_number = 0;
    for (var i = 0; i < keys.length; i++){
	locs = Object.keys(data[keys[i]]);
	if (locs.length > max){
	    max = locs.length
	    max_number = i
	}
    }
    for (loc in data[keys[max_number]]){
	timedata_t[loc]=[]
    }
    for (var i = 0; i < keys.length; i++){
	for (loc in data[keys[i]]){
	    ar = data[keys[i]][loc]
	    if (scaling){
		scale = scaling[keys[i]]
	    } else {
		scale = 1
	    }
	    timedata_t[loc].push([parseInt(keys[i]),data[keys[i]][loc] / scale]);
	}
    }
    var timedata=[];
    for (loc in timedata_t){
	timedata.push({"key":loc,"values":timedata_t[loc]})
    }
    nv.addGraph(function() {
	var chart_line = nv.models.lineChart()
	    .x(function(d) { return d[0] })
	    .y(function(d) { return d[1] })
	    .forceY([0,1]);
	
	chart_line.xAxis
	    .showMaxMin(false)
	    .axisLabel(xAxisLabel)
	    .tickFormat(function(d) { return d3.time.format('%e %b %Y')(new Date(d)) });

	chart_line.yAxis
	    .axisLabel(yAxisLabel)
	    .showMaxMin(false)
	    .tickFormat(d3.format('p'));
	

	d3.select('#'+chart_id+' svg')
	    .datum(timedata)
	    .transition().duration(500)
	    .call(chart_line);
	
	nv.utils.windowResize(chart_line.update);

	return chart_line;
    });
}

function pie_chart(data,chart_id){
    var datum=[]
    for(text in data){
	datum.push({
	    "label":text,
	    "value":parseInt(data[text])
	})
	}
    nv.addGraph(function() {
	var chart = nv.models.pieChart()
		.x(function(d) { return d.label })
		.y(function(d) { return d.value })
		.values(function(d) { return d })
		.valueFormat(d3.format('n'))
		.showLabels(false);

	d3.select("#"+chart_id)
	    .datum([datum])
	    .transition().duration(1200)
	    .call(chart);

	nv.utils.windowResize(chart.update);
	
	return chart;
    });
}

function timeline_nv(data,chart_id,xAxisLabel,yAxisLabel){
    var timedata_t = {}
    var keys = Object.keys(data)
    var locations = Object.keys(data[keys[keys.length - 1]]);
    var max = 0;
    var max_number = 0;
    for (var i = 0; i < keys.length; i++){
		var locs = Object.keys(data[keys[i]]);
	if (locs.length > max){
			max = locs.length
	    max_number = i
	}	
    }
    for (loc in data[keys[max_number]]){
	timedata_t[loc] = []
    }
    for (var i = 0; i < keys.length; i++){
	for (loc in data[keys[max_number]]){
	    if (loc in data[keys[i]]){
		timedata_t[loc].push([parseInt(keys[i]),data[keys[i]][loc]]);
	    } else {
		timedata_t[loc].push([parseInt(keys[i]),0]);
			}
	}
    }
    var timedata = [];
    for (loc in timedata_t){
	timedata.push({"key":loc,"values":timedata_t[loc]})
    }
    
    nv.addGraph(function() {	
	var chart = nv.models.stackedAreaChart()
	    .x(function(d) { return d[0] })
	    .y(function(d) { return d[1] })
	    .clipEdge(true)
	    .showControls(false)
	    .color(d3.scale.category20().range());
	
	chart.xAxis
	    .showMaxMin(false)
	    .axisLabel(xAxisLabel)
	    .tickFormat(function(d) { return d3.time.format('%e %b %Y')(new Date(d)) });
	
	chart.yAxis
	    .axisLabel(yAxisLabel)
	    .showMaxMin(false)
	    .tickFormat(d3.format('n'));
	
	d3.select("#"+chart_id+' svg')
	    .datum(timedata)
	    .transition().duration(500).call(chart);
	
	nv.utils.windowResize(chart.update);
	return chart;
    });
}

function percentage_timeline_nv(data,chart_id,xAxisLabel,yAxisLabel){
    var timedata_t = {}
    var keys = Object.keys(data)
    var locations = Object.keys(data[keys[keys.length - 1]]);
    var max = 0;
    var max_number = 0;
    for (var i = 0; i < keys.length; i++){
		var locs = Object.keys(data[keys[i]]);
	if (locs.length > max){
			max = locs.length
	    max_number = i
	}	
    }
    for (loc in data[keys[max_number]]){
	timedata_t[loc] = []
    }
    for (var i = 0; i < keys.length; i++){
	for (loc in data[keys[max_number]]){
	    if (loc in data[keys[i]]){
		timedata_t[loc].push([parseInt(keys[i]),data[keys[i]][loc]]);
	    } else {
		timedata_t[loc].push([parseInt(keys[i]),0]);
			}
	}
    }
    var timedata = [];
    for (loc in timedata_t){
	timedata.push({"key":loc,"values":timedata_t[loc]})
    }
    
    nv.addGraph(function() {	
	var chart = nv.models.stackedAreaChart()
	    .x(function(d) { return d[0] })
	    .y(function(d) { return d[1] })
	    .clipEdge(true)
	    .tooltip(function(key, x, y, e, graph) {
		return '<h3>' + key + '</h3>' +
		    '<p>' + Math.round(parseFloat(y)) + '% on ' + x + '</p>'
	    })
	    .showControls(false);
	
	chart.xAxis
	    .showMaxMin(false)
	    .axisLabel(xAxisLabel)
	    .tickFormat(function(d) { return d3.time.format('%e %b %Y')(new Date(d)) });
	
	chart.yAxis
	    .axisLabel(yAxisLabel)
	    .showMaxMin(false)
	    .tickFormat(d3.format('p'));
	
	d3.select("#"+chart_id+' svg')
	    .datum(timedata)
	    .transition().duration(500).call(chart);
	
	nv.utils.windowResize(chart.update);
	return chart;
    });
}

function horizontal_bar_chart(data,chart_id,xAxisLabel,yAxisLabel){
    var datum=[{
	key:"Missing data",
	color: '#1f77b4',
	values:[]
    }]
    for(key in data){
	datum[0]["values"].push({"label":key,"value":data[key]})
    }
    var chart;
    
    nv.addGraph(function() {
	chart = nv.models.multiBarHorizontalChart()
	    .x(function(d) { return d.label })
			.y(function(d) { return d.value })
	    .margin({
		top: 30,
		right: 20,
		bottom: 50,
		left: 175
	    })
	    .showValues(false)
	    .tooltips(true)
	    .showControls(false)
	    .showLegend(false)
	    .tooltip(function(key, x, y, e, graph) {
		return '<h3>' + key + '</h3>' +
		    '<p>' + Math.round(parseFloat(y)) + '% on ' + x + '</p>'
	    })
	    .forceY([-1,1]);

	chart.yAxis
	    .axisLabel(yAxisLabel)
	    .tickFormat(d3.format('p'));
	
	d3.select('#'+chart_id+' svg')
	    .datum(datum)
	    .transition().duration(500)
	    .call(chart);
	
	nv.utils.windowResize(chart.update);
	
	return chart;
    });
}

function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
	x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function multi_bar_chart(data,chart_id){
    var datum=[]
    for(text in data){
	var tmp=[]
	for (value in data[text]){
	    tmp.push({"x":value,"y":data[text][value]})
	}
	datum.push({
	    "key":text,
	    "values":tmp
	})
    }
    nv.addGraph(function() {
	var chart = nv.models.multiBarChart()
	    .x(function(d) { return d.x })
	    .y(function(d) { return d.y })
	    .stacked(true)
	    .showControls(false)
	
//	chart.xAxis
  //          .tickFormat(d3.format(',f'));
	
	chart.yAxis
	    .tickFormat(d3.format('n'))
	    .showMaxMin(false);
	
	d3.select('#'+chart_id)
            .datum(datum)
	    .transition().duration(500).call(chart);
	
	nv.utils.windowResize(chart.update);
	
    return chart;
    });
}

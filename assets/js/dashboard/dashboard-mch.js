jdata=data();
load_numbers();
$(document).ready(function(){
	 //   	jdata=data();
   // load_numbers()
});
function load_numbers(){
    var keys = Object.keys(jdata);
    keys.sort();
    
    first_date = keys[0]
    first_date_d = new Date(first_date)
    
    keys.reverse()
    latest_date = keys[0]
    latest_date_d = new Date(latest_date);
    
    //Indicators
    //Mothers Enrolled
    mothers=total_time_data(timeData(jdata,"mothers",group="location"),1)
    mothers_total=mothers[latest_date_d.getTime()]
    three_or_more_visits=jdata[latest_date]["three_visits"]
    percent_three_or_more_visits=three_or_more_visits/mothers_total*100
    $('#enrolledWomen').html('<h1 class="dashnum">' + addCommas(mothers_total) + '</h1>');
    $('#enrolledWomenThreeVisits').html('<h2 class="dashnum">(' + Math.round(percent_three_or_more_visits) + '%)</h2>');

    //Deliveries
    deliveries=jdata[latest_date]["deliveries"]
    deliveries_percent=deliveries/mothers_total*100
    $('#deliveriesRecorded').html('<h1 class="dashnum">' + addCommas(deliveries) + '</h1>');
    $('#deliveriesPercent').html('<h2 class="dashnum">(' + Math.round(deliveries_percent) + '%)</h2>');
    //Children Enrolled
    children={}
    keys.sort();
    for (var i = 0; i < keys.length; i++){
	k = keys[i];
	var date = new Date(k); 
	children[date.getTime()] = jdata[k]["children"]
    }
    //alert(JSON.stringify(jdata))
    children_total=total_time_data(children)[latest_date_d.getTime()]
    percent_children_deliveries=children_total/deliveries*100
    $('#enrolledChildren').html('<h1 class="dashnum">' + addCommas(children_total) + '</h1>');
    $('#childrenPercentDeliveries').html('<h2 class="dashnum">(' + Math.round(percent_children_deliveries) + '%)</h2>');

    //HIV Positive and on HAART
    hiv_positive=jdata[latest_date]["hiv_positive"][0]+jdata[latest_date]["hiv_positive"][1]
    on_haart=jdata[latest_date]["on_hiv_treatment"]
    percent_positive_on_haart=on_haart/hiv_positive*100
    $('#positiveOnArt').html('<h1 class="dashnum">' + addCommas(hiv_positive) + '</h1>');
    $('#percentageOnArtOfPositive').html('<h2 class="dashnum">(' + Math.round(percent_positive_on_haart) + '%)</h2>');

    //IPT1-3
    ipt13=jdata[latest_date]["IPT1-3"][0]+jdata[latest_date]["IPT1-3"][1]
    percent_ipt13=ipt13/mothers_total*100
    $('#ipt13Completed').html('<h1 class="dashnum">' + addCommas(ipt13) + '</h1>');
    $('#ipt13Percent').html('<h2 class="dashnum">(' + Math.round(percent_ipt13) + '%)</h2>');

    //Complete Records
    complete_records=jdata[latest_date]["complete_records"]
    $('#completedRecords').html('<h1 class="dashnum">' + addCommas(complete_records) + '</h1>');
   

    //Overview

    //Pie chart HIV positive women
    hiv_positive_age={"< 18":jdata[latest_date]["hiv_positive"][0],"> 18":jdata[latest_date]["hiv_positive"][1]}
    //ITN pie chart
    itn_age={"< 18":jdata[latest_date]["ITN"][0],"> 18":jdata[latest_date]["ITN"][1]}
//    itn_age={"< 18":2,"> 18":1}

    //Data

    //Missing data timeline:
    missing_data={}
    for(time in jdata){
	d=new Date(time)
	missing_data[d.getTime()]={"Hiv Screening":jdata[time]["missing_hiv"],"TB Screening":jdata[time]["missing_tb"],"Malaria Screening":jdata[time]["missing_malaria"],"Hypertension":jdata[time]["missing_hypertension"]}
    }
    missing_data_scaled = scale(missing_data,mothers,100,2)
    missing_fractional_change = fractional_change(missing_data_scaled,1,"individual");

    //Clinical
    positive={}
    for(time in jdata){
	d=new Date(time)
	positive[d.getTime()]={"TB Positive":jdata[time]["tb_positive"],"Malaria Positive":jdata[time]["malaria_positive"],"VDRL Positive":jdata[time]["vdrl_positive"]}
    }

    positive_scaled = scale(positive,mothers,100,2)

    // Preventive
    preventive={}
    for(time in jdata){
	d=new Date(time)
	preventive[d.getTime()]={"TT1-5":jdata[time]["TT1-5"],"IPT1-3":jdata[time]["IPT1-3"],"Iron and Folate":jdata[time]["iron_folate"],"deworming":jdata[time]["deworming"],"ITN":jdata[time]["ITN"]}
    }
    preventive_scaled = scale(preventive,mothers,100,2)


    delivery_indicators={}
    for(time in jdata){
	d=new Date(time)
	delivery_indicators[d.getTime()]={"HIV+ on ART":jdata[time]["receiving_haart_postnatal"],"Vitamin A":jdata[time]["mother_vit_a"],"Child Immunisation":jdata[time]["child_immunisation"]}
    }

    delivery_indicators_scaled = scale(delivery_indicators,mothers,100,2)
    //
    child_art_age={"< 18":jdata[latest_date]["child_art"][0]/jdata[latest_date]["hiv_delivery"][0],"> 18":jdata[latest_date]["child_art"][1]/jdata[latest_date]["hiv_delivery"][1]}


    // Only render the chart when the tab is activated
    $('a[href="#overview"]').on('show', function () {
	// Enrollment Mothers timeline chart
	timeline_nv(timeData(jdata,"mothers",group="location"),"overview_timeline_chart",'Date','Women');
	// Enrollment Children timeline chart
	timeline_nv(children,"overview_children_timeline_chart",'Date','Women');
	// HIV age
	pie_chart(hiv_positive_age,"overview_hiv_age")
	// ITN age
	pie_chart(itn_age,"overview_itn_age");
    });	

	$('a[href="#data"]').on('show', function () {
	// Missing data over time chart
	line_chart(missing_data,"data_missing_chart",mothers,'Date','Incomplete Records');
	// Missing core parameters chart
	horizontal_bar_chart(missing_fractional_change,"data_missing_parameters_chart",'Parameter','Percentage Change')
    });

    $('a[href="#anc"]').on('show', function () {
	line_chart(positive_scaled,"anc_positive_screening_timeline_chart",mothers,'Date','Percentage');
	line_chart(preventive_scaled,"anc_preventive_timeline_chart",mothers,'Date','Percentage');
    });
    $('a[href="#delivery"]').on('show', function () {
	line_chart(delivery_indicators_scaled,"delivery_timeline_chart",mothers,'Date','Percentage');
	pie_chart(jdata[latest_date]["method_of_delivery"],"delivery_method_chart")
	pie_chart(jdata[latest_date]["place_of_delivery"],"delivery_place_chart")
	pie_chart(jdata[latest_date]["delivery_conducted_by"],"delivery_conducted_by_chart")
	bar_chart(child_art_age,"delivery_child_art_chart");
    });
}


function timeData(data,key,group){
    var keys = Object.keys(data);
    keys.sort();
    var timedata = {}
    if (group == "location"){
	for (var i = 0; i < keys.length; i++){
	    k = keys[i];
	    var date = new Date(k); 
	    timedata[date.getTime()] = {}
	    for (var loc in data[k][key]){
		var sum = 0;
		for(var j = 0; j < 2; j++){
		    sum += data[k][key][loc][j];
		}
		timedata[date.getTime()][loc] = sum;
	    }
	}
    }
    return timedata
}
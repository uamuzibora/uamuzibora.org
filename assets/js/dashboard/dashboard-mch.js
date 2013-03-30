jdata=data();
load_numbers();
$(document).ready(function(){
	 //   	jdata=data();
   // load_numbers()
});

function percent(then,now,percent){
    if(percent){
	return Math.round((now-then)/then *100)
    }else{
	return (now-then)/then
    }
}

function load_numbers(){
    var keys = Object.keys(jdata);
    keys.sort();

    first_date = keys[0]
    first_date_d = new Date(first_date)
    percent_date=first_date
    percent_date_d=first_date_d
    keys.reverse()
    latest_date = keys[0]
    latest_date_d = new Date(latest_date);

        // Last updated
    $('#lastDate').html(pretty_date(latest_date_d));
    
    //Indicators
    //Mothers Enrolled
    mothers=total_time_data(timeData(jdata,"mothers",group="location"),1)
    mothers_total=mothers[latest_date_d.getTime()]
    mothers_percent_date=mothers[percent_date_d.getTime()]
    $('#enrolledWomen').html('<h1 class="dashnum">' + addCommas(mothers_total) + '</h1>');
    enrolled_percent=percent(mothers_percent_date,mothers_total,true)
     if (enrolled_percent > 0) {
	$('#womenEnrolledPercent').html('<h2 class="dashnum text-success">(+' + enrolled_percent + '%)</h2>');
    } else {
	$('#womenEnrolledPercent').html('<h2 class="dashnum text-error">(' + enrolled_percent + '%)</h2>');
    }


    //Deliveries
    deliveries=jdata[latest_date]["deliveries"]
    delivery_percent=percent(jdata[percent_date]["deliveries"]/mothers_percent_date,deliveries/mothers_total,true)
    $('#deliveriesRecorded').html('<h1 class="dashnum">' + addCommas(deliveries) + '</h1>');
    if (delivery_percent > 0) {
	$('#deliveryPercent').html('<h2 class="dashnum text-success">(+' + delivery_percent + '%)</h2>');
    } else {
	$('#deliveryPercent').html('<h2 class="dashnum text-error">(' + delivery_percent + '%)</h2>');
    }
    //Children Enrolled
    children={}
    keys.sort();
    for (var i = 0; i < keys.length; i++){
	k = keys[i];
	var date = new Date(k); 
	children[date.getTime()] = jdata[k]["children"]
    }
    //alert(JSON.stringify(jdata))
    children_time=total_time_data(children)
    children_total=children_time[latest_date_d.getTime()]
    children_percent=percent(children_time[percent_date_d.getTime()],children_total,true)
    $('#enrolledChildren').html('<h1 class="dashnum">' + addCommas(children_total) + '</h1>');
    if (children_percent > 0) {
	$('#childrenPercent').html('<h2 class="dashnum text-success">(+' + children_percent + '%)</h2>');
    } else {
	$('#childrenPercent').html('<h2 class="dashnum text-error">(' + children_percent + '%)</h2>');
    }
			     
    //HIV Positive and on HAART
    hiv_positive=jdata[latest_date]["hiv_positive"][0]+jdata[latest_date]["hiv_positive"][1]
    hiv_positive_percent_date=jdata[percent_date]["hiv_positive"][0]+jdata[percent_date]["hiv_positive"][1]
    on_haart=jdata[latest_date]["on_hiv_treatment"]
    
    $('#positiveOnArt').html('<h1 class="dashnum">' + addCommas(on_haart) + '</h1>');
    haart_percent=percent(jdata[percent_date]["on_hiv_treatment"]/hiv_positive_percent_date,on_haart/hiv_positive,true)
     if (haart_percent > 0) {
	$('#haartPercent').html('<h2 class="dashnum text-success">(+' + haart_percent + '%)</h2>');
    } else {
	$('#haartPercent').html('<h2 class="dashnum text-error">(' + haart_percent + '%)</h2>');
    }




    //IPT1-3
    ipt13=jdata[latest_date]["IPT1-3"][0]+jdata[latest_date]["IPT1-3"][1]
    ipt13_percent_date=jdata[percent_date]["IPT1-3"][0]+jdata[percent_date]["IPT1-3"][1]
    $('#ipt13Completed').html('<h1 class="dashnum">' + addCommas(ipt13) + '</h1>');
    ipt13_percent=percent(ipt13_percent_date/mothers_percent_date,ipt13/mothers_total,true)
     if (ipt13_percent > 0) {
	$('#ipt13Percent').html('<h2 class="dashnum text-success">(+' + ipt13_percent + '%)</h2>');
    } else {
	$('#ipt13Percent').html('<h2 class="dashnum text-error">(' + ipt13_percent + '%)</h2>');
    }

    //Complete Records
    complete_records=jdata[latest_date]["complete_records"]
    $('#completedRecords').html('<h1 class="dashnum">' + addCommas(complete_records) + '</h1>');
    
    percent_change_complete_records = percent(jdata[percent_date]["complete_records"]/mothers_percent_date,complete_records/mothers_total,true);
    $('#completedRecords').html('<h1 class="dashnum">' + addCommas(complete_records) + '</h1>');
    if (percent_change_complete_records > 0) {
	$('#completedRecordsPercent').html('<h2 class="dashnum text-success">(+' + percent_change_complete_records + '%)</h2>');
    } else {
	$('#completedRecordsPercent').html('<h2 class="dashnum text-error">(+' + percent_change_complete_records + '%)</h2>');
    }

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

   //Number of visits
    visits=jdata[latest_date]["return_visits"]
    number_of_visits={"1":visits[1],"2":visits[2],"3":visits[3],"4 or more":visits[4]}

    positive_scaled = scale(positive,mothers,100,2)


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
	pie_chart(number_of_visits,"anc_number_of_visits")
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
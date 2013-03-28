jdata=data();
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
    
    
    // Enrollment chart data
    var enrolled_time = extractTimeData(jdata,
					"enrolled",
					group = "location")
    
    // Patient source chart data
    var ps = extractTimeData(jdata,
			     "patient_source",
			     group = "text")
    
    // Age & gender chart data
    
    
    // *** PROGRAMME INDICATORS ***
    
    // Enrolled
    total_enrolled = total_time_data(enrolled_time,1)[latest_date_d.getTime()]
    enrolled_percent_change=percent_change(enrolled_time,1,"total");
    $('#enrolledPatients').html('<h1 class="dashnum">' + addCommas(total_enrolled) + '</h1>');
    if (enrolled_percent_change > 0) {
	$('#enrolledPatientsPercent').html('<h2 class="dashnum text-success">(+' + enrolled_percent_change + '%)</h2>');
    } else {
	$('#enrolledPatientsPercent').html('<h2 class="dashnum text-error">(' + enrolled_percent_change + '%)</h2>');
    }
    
    // On ART
    var on_art_time = extractTimeData(jdata,
				      "on_art_who",
				      group = "text")
    total_on_art = total_time_data(on_art_time,1)[latest_date_d.getTime()]
    percent_change_on_art = percent_change(on_art_time,1,"total");
    $('#onArt').html('<h1 class="dashnum">' + addCommas(total_on_art) + '</h1>');
    if (percent_change_on_art > 0) {
	$('#onArtPercent').html('<h2 class="dashnum text-success">(+' + percent_change_on_art + '%)</h2>');
    } else {
	$('#onArtPercent').html('<h2 class="dashnum text-error">(' + percent_change_on_art + '%)</h2>');
    }
    
    // Eligible not on ART
    var eligible_not_on_art_time = extractTimeData(jdata,
						   "eligible_no_art",
						   group="location")
    total_eligible_not_on_art = total_time_data(eligible_not_on_art_time,1)[latest_date_d.getTime()]
    total_eligible_time=extractTimeData(jdata,
					"eligible_for_art",
					group="location")
    eligible_time=total_time_data(total_eligible_time,1)
    eligible_not_on_art_scaled=scale(total_time_data(eligible_not_on_art_time,1),eligible_time,100,1)
    percent_change_eligible_not_on_art = percent_change(eligible_not_on_art_scaled,1,"ready");
    
    $('#eligibleNotOnArt').html('<h1 class="dashnum">' + addCommas(total_eligible_not_on_art) + '</h1>');
    if (percent_change_eligible_not_on_art > 0) {
	$('#eligibleNotOnArtPercent').html('<h2 class="dashnum text-error">(+' + percent_change_eligible_not_on_art + '%)</h2>');
    } else {
	$('#eligibleNotOnArtPercent').html('<h2 class="dashnum text-success">(' + percent_change_eligible_not_on_art + '%)</h2>');
    }
    
    // Lost to followup
    var exit_care_time = extractTimeData(jdata,
					 "inactive_reason",
					 group="text")
    lost_to_followup_time = {}
    for (key in exit_care_time){
	lost_to_followup_time[key] = exit_care_time[key]["LOST TO FOLLOWUP"]
    }
    total_lost_to_followup = lost_to_followup_time[latest_date_d.getTime()];
    number_enrolled=total_time_data(enrolled_time,1)
    lost_to_followup_scaled = scale(lost_to_followup_time,number_enrolled,100,1)
    
    percent_change_lost_to_followup = percent_change(lost_to_followup_scaled,1,"ready")
    $('#lostToFollowup').html('<h1 class="dashnum">' + addCommas(total_lost_to_followup) + '</h1>');
    if (percent_change_lost_to_followup > 0) {
	$('#lostToFollowupPercent').html('<h2 class="dashnum text-error">(+' + percent_change_lost_to_followup + '%)</h2>');
    } else {
	$('#lostToFollowupPercent').html('<h2 class="dashnum text-success">(' + percent_change_lost_to_followup + '%)</h2>');
    }
    
    // Followed up
    var followed_up_time = extractTimeData(jdata,
					   "followed_up",
					   group="location")
    total_followed_up = total_time_data(followed_up_time,1)[latest_date_d.getTime()]
    $('#lostPatientsFollowedUp').html('<h1 class="dashnum">' + addCommas(total_followed_up) + '</h1>');
    
    // Complete Records
    complete_records_time=extractTimeData(jdata,
					  "complete_records",
					  group="location")
    
    complete_records_total=total_time_data(complete_records_time,1)[latest_date_d.getTime()];
    
    complete_records_scaled=scale(total_time_data(complete_records_time,1),number_enrolled,100,1)
    
    percent_change_complete_records = percent_change(complete_records_scaled,1,"ready");
    $('#completedRecords').html('<h1 class="dashnum">' + addCommas(complete_records_total) + '</h1>');
    if (percent_change_complete_records > 0) {
	$('#completedRecordsPercent').html('<h2 class="dashnum text-success">(+' + percent_change_complete_records + '%)</h2>');
    } else {
	$('#completedRecordsPercent').html('<h2 class="dashnum text-error">(+' + percent_change_complete_records + '%)</h2>');
    }
    
    // Last updated
    $('#lastDate').html(latest_date_d.getDate()+'/'+latest_date_d.getMonth()+'/'+latest_date_d.getFullYear());
    
    // *** CHARTS ***
    
    //Age and gender Chart
    current_enrolled=jdata[latest_date]["enrolled"]
    age_gender={"Male < 14":0,"Female < 14":0,"Male > 14":0,"Female > 14":0}
    
    for(loc in current_enrolled){
	age_gender["Male < 14"]+=current_enrolled[loc][0]
	age_gender["Female < 14"]+=current_enrolled[loc][1]
	age_gender["Male > 14"]+=current_enrolled[loc][2]
	age_gender["Female > 14"]+=current_enrolled[loc][3]
    }
    
    //First CD4
    cd4=jdata[latest_date]["first_cd4"]
    cd4_age_gender={"<350":{"Male < 14":0,"Female < 14":0,"Male > 14":0,"Female > 14":0},">350":{"Male < 14":0,"Female < 14":0,"Male > 14":0,"Female > 14":0}}
    
    for(key in cd4){
	if(key!="Missing"){
	    for(loc in cd4[key]){
		cd4_age_gender[key]["Male < 14"]+=cd4[key][loc][0]
		cd4_age_gender[key]["Female < 14"]+=cd4[key][loc][1]
		cd4_age_gender[key]["Male > 14"]+=cd4[key][loc][2]
		cd4_age_gender[key]["Female > 14"]+=cd4[key][loc][3]
	    }
	}
    }
    
    
    //First WHO Stage
    who=jdata[latest_date]["first_who"]
    first_who_age_gender={}
    for (key in who){
	if(key!="Missing" && key!="WHO STAGE MISSING"){
	    first_who_age_gender[key]={"Male < 14":0,"Female < 14":0,"Male > 14":0,"Female > 14":0}
	}
    }
    for(key in who){
	if(key!="Missing" && key!="WHO STAGE MISSING"){
	    for(loc in who[key]){
		first_who_age_gender[key]["Male < 14"]+=who[key][loc][0]
		first_who_age_gender[key]["Female < 14"]+=who[key][loc][1]
		first_who_age_gender[key]["Male > 14"]+=who[key][loc][2]
		first_who_age_gender[key]["Female > 14"]+=who[key][loc][3]
	    }
	}
    }
    
    //On ART TIMELINE
    on_art_who_stage_time=extractTimeData(jdata,"on_art_who",group="text")
    
    for(time in on_art_who_stage_time){
	if ("WHO STAGE MISSING" in on_art_who_stage_time[time]){
	    on_art_who_stage_time[time]["WHO STAGE MISSING"]+=on_art_who_stage_time[time]["Missing"]
	}else{
	    on_art_who_stage_time[time]["WHO STAGE MISSING"]=on_art_who_stage_time[time]["Missing"]
	}
	delete on_art_who_stage_time[time]["Missing"]
    }
    
    //Eligible not on art timeline
    eligible_no_art_time=extractTimeData(jdata,"eligible_no_art",group="location")
    eligible_no_art_percent_time=scale(eligible_no_art_time,eligible_time,1,2)
    
    //Charts for Follow-up 
    //Timeline for lost to follow-up
    
    //Pie chart Followed UP
    followed_up=jdata[latest_date]["followed_up"]
    
    followed_up_age_gender={"Male < 14":0,"Female < 14":0,"Male > 14":0,"Female > 14":0}
    
    for(loc in followed_up){
	followed_up_age_gender["Male < 14"]+=followed_up[loc][0]
	followed_up_age_gender["Female < 14"]+=followed_up[loc][1]
	followed_up_age_gender["Male > 14"]+=followed_up[loc][2]
	followed_up_age_gender["Female > 14"]+=followed_up[loc][3]
    }
    
    //Reason lost to follow-up pie chart
    reason_lost=extractTimeData(jdata,"reason_to_follow_up",group="text")[latest_date_d.getTime()]
    delete reason_lost["Missing"]
    
    //Willing to Return timline
    
    willing_to_return_time={}
    var dates=[]
    for(k in jdata){
	d = new Date(k);
	dates.push(d.getTime())
	willing_to_return_time[d.getTime()]=jdata[k]["willing_to_return"]
    }
    willing_to_return_age_gender={}
    dates.sort()
    for(var i=0;i<dates.length;i++){
	time=dates[i]
	var t={"Male < 14":0,"Female < 14":0,"Male > 14":0,"Female > 14":0}
	for(loc in willing_to_return_time[time]){
	    t["Male < 14"]+=willing_to_return_time[time][loc][0]
	    t["Female < 14"]+=willing_to_return_time[time][loc][1]
	    t["Male > 14"]+=willing_to_return_time[time][loc][2]
	    t["Female > 14"]+=willing_to_return_time[time][loc][3]
	}
	willing_to_return_age_gender[time]=t
    }
    // Timeline chart
    scaling=total_time_data(enrolled_time,1) // Get scaling for line chart
    
    // Only render the chart when the tab is activated
    $('a[href="#overview"]').on('show', function () {
	// Enrollment timeline chart
	timeline_nv(enrolled_time,"overview_timeline_chart",'Date','Patients');
	// Patient source pie chart
	pie_chart(ps[latest_date_d.getTime()],"overview_patient_source_chart")
	// Age & gender pie chart
	pie_chart(age_gender,"overview_age_gender_chart");
    });
    $('a[href="#data"]').on('show', function () {
	// Missing data over time chart
	line_chart(missing_data,"data_missing_chart",scaling,'Date','Incomplete Records');
	// Missing core parameters chart
	horizontal_bar_chart(missing_fractional_change,"data_missing_parameters_chart",'Parameter','Percentage Change')
    });
    $('a[href="#clinical"]').on('show', function () {
	console.log(on_art_who_stage_time);
	timeline_nv(on_art_who_stage_time,"clinical_on_art_by_who_stage_timeline_chart",'Date','Patients');
	percentage_timeline_nv(eligible_no_art_percent_time,"clinical_eligible_not_on_art_timeline_chart",'Date','Patients');
	multi_bar_chart(first_who_age_gender,"clinical_initial_who_multibar_chart");
	multi_bar_chart(cd4_age_gender,"clinical_initial_cd4_multibar_chart");
    });
    $('a[href="#followup"]').on('show', function () {
	timeline_nv(exit_care_time,"followup_exit_timeline_chart",'Date','Patients');
	timeline_nv(willing_to_return_age_gender,"followup_return_timeline_chart",'Date','Patients');
	pie_chart(followed_up_age_gender,"followup_age_gender_chart");
	pie_chart(reason_lost,"followup_reason_lost_chart");
    });
    // Missing data chart
    var missing_data = extractTimeData(jdata,"missing",group="text")
    missing_data_scaled = scale(missing_data,scaling,100,2)
    missing_fractional_change = fractional_change(missing_data_scaled,1,"individual");
}



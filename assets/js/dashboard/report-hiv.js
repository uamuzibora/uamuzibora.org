function generateReport(){
    var start=$("#startDate").val();
    var end=$("#endDate").val();
    var location=$("#location").val();
    jdata=getData(start,end,location);

}

function locations(){
    $.get("https://uamuzibora.org/api/locations/hiv",{},
       function(data,status){
	   options='<option value="all">All</option>'
	   data["locations"].sort()
	   for (i=0;i<data["locations"].length;i++){
	       loc=data["locations"][i]
	       if(loc!="Missing"){
		   options+='<option value="'+loc+'">'+loc+'</option>'
	       }
	   }
	   $("#location").html(options);
       })
}

function getData(start,end,location){
    $.get("https://uamuzibora.org/api/report/hiv/"+location,
	  {
	      start:start,end:end
	  },
	  function(data,status){
	      jdata=data;

	  }).done(function(){showData(jdata)});
}
function showData(jdata){
    $("#patient_source").html(table(jdata["patient_source"]));      
    $("#art_who").html(table(jdata["art_who"]));
    $("#on_cd4").html(table(jdata["on_cd4"]));
    $("#no_art_eligible").html(table({"Eligible, but not on ARV":jdata["eligible_no_art"]}));
    $("#exiting_care_table").html(table(jdata["exiting_care"]));
    $("#missing_data_table").html(table(jdata["missing_data"]));
}
function setForm(start,end,location){
    $("#startDate").val(start);
    $("#endDate").val(end);
    $("#location").val(location);
}

$(document).ready(function(){
    var d= new Date();
    locations()
    getData("01/01/1990",d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear(),"all");
    $("#startDate").val("01/01/1990");
    $("#endDate").val(d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear());
});

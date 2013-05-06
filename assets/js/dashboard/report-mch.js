function generateReport(){
    var start=$("#startDate").val();
    var end=$("#endDate").val();
    var location=$("#location").val();
    jdata=getData(start,end,location);

}

function locations(){
    $.get("https://uamuzibora.org/api/locations/mch",{},
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
    $.get("https://uamuzibora.org/api/report/mch/"+location,
	  {
	      start:start,end:end
	  },
	  function(data,status){
	      jdata=data;

	  }).done(function(){showData(jdata)});
}
function showData(jdata){
    $("#women_enrolled").html(table_mch({"Women Enrolled":jdata["women_enrolled"]},true,false));      
    $("#children_enrolled").html(table_mch({"Children Enrolled":jdata["children_enrolled"]},false,false));
    $("#clinical_table").html(table_mch({"Women HIV Positive":jdata["women_hiv"],"Women on ART":jdata["women_art"],"Women on Malaria Prophylaxis":jdata["women_malaria"]},true,false));
    $("#missing_data_table").html(table_mch(jdata["missing_data"],true,false));
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

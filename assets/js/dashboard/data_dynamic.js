
function data(){
    jdata=[]
    var request=$.post("https://uamuzibora.org/dashboard_backend",
	   {
	       data:"all",request_type:"dashboard"
	   },
	   function(data,status){
	       jdata=jQuery.parseJSON(data);
	   })
	.done(function(){load_numbers()});
    return jdata
}
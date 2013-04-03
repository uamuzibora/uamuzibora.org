
function data(){
    jdata=[]
    var request=$.get("https://uamuzibora.org/api/hiv/all",
	   {},
	   function(data,status){
	       jdata=data
	   })
	.done(function(){load_numbers()});
    return jdata
}
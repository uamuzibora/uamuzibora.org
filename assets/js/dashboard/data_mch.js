function data(){
    jdata=[]
    var request=$.post("https://uamuzibora.org/api/mch/all",
	   {},
	   function(data,status){
	       jdata=data
	   })
	.done(function(){load_numbers()});
    return jdata

}

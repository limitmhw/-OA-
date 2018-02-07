function $include(str,obj){
	$.get(str, function (data) {
		$(obj).html(data);
	});
}
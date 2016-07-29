$("[name=items]:checkbox").click(function(){
	var $tmp = $("[name=items]:checkbox");
	$("#checkedAll").attr(":checked",
		$tmp.length == $tmp.filter(":checked").length);
});

$("#checkedAll").click(function(){
	$("[name=items]:checked").attr("checked",this.checked);
})
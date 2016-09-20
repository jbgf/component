$(function(){
	setButton();
});
function setButton(){
    var btnRow = $('<div class="headRow clear"><span class="button btn-r-m bg-pink white float-l"><img style="margin-top: -3px;" src="/img/icon_w.png" class="icon">Get!</span></div>')	
	$(".box").prepend(btnRow );
}
<!-- 获取特定文件夹下的文件名 start-->
<?php
	$is_get = isset($_POST["get_file_type"]);
	$root=$_SERVER['DOCUMENT_ROOT'];
	$dir=$root."\img\\";
	if($is_get){
		if ($_POST["get_file_type"] == "img") {
		    $filesnames = scandir($dir);
			echo json_encode ($filesnames);
		}else{echo "nothing";}
	}
	
?>
<!-- 获取特定文件夹下的文件名 end-->


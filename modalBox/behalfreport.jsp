 <%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ include file="../includes/enterprisebase/top.jsp"%>
<html> 
<title>待填报表-福建省电子商务与服务外包统计公共平台</title>

<meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
<link rel="stylesheet" type="text/css" href="modalBox.css">

<script type="text/javascript" src="modalBox.js"></script>
<script type="text/javascript">
		var i = 0;
		if(i==0){
			$(function(){
				$(".modalBox").modalBox();
			})
			
		}
</script>

</head>
<body>
		  
 	<!-- 页头结束 -->
	<div class="gyp_main_area">
		<div class="gyp_right_area">
	    	<div class="gyp_right_con">
		    	<div class="gyp_right_modle_area">
			        <div class="gyp_right_modle_all">
						<div class="gyp_right_modle">
							<div class="gyp_right_modle_info">
								<div class="gyp_right_modle_title">
									<span class="gyp_rm_flag gyp_rm_flag01"></span>
									<span class="gyp_rm_name">待填报报表</span>
									<a href="<%=basePath%>/enterprisebase/morebehalfreport.htm" class="gyp_rm_more" title="更多"></a>
								</div>
								<div class="gyp_right_modle_con">
									<ul>
										<c:forEach items="${relist}" var="com" begin="0" end="3">
											<li><a 
											<c:if test="${com.type == '2' }">
											   href="<%=basePath%>/enterprisebase/toaddorupdateserviceout.htm?repotingyear=${com.year }&reprotperiod=${com.period }"
			                        		</c:if>
											<c:if test="${com.type == '1' }">
											   href="<%=basePath%>/enterprisebase/toaddorupdatethirdelectronic.htm?repotingyear=${com.year }&reprotperiod=${com.period }"
			                        		</c:if>
			                        		<c:if test="${com.type == '3' }">
											   href="<%=basePath%>/enterprisebase/toaddorupdatecommerce.htm?repotingyear=${com.year }&reprotperiod=${com.period }"
			                        		</c:if>
											>${com.typetitle }</a></li>
										</c:forEach>
										<div class="clear"></div>
									</ul>
								</div>
							</div>
							<div class="gyp_bottom_fill"></div>
						</div>
						<div class="clear"></div>
			        </div>
		        </div>
		    </div>
		</div>
	</div>
</body>
</html>
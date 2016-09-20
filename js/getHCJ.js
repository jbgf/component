//html
						console.log($("#float-r").prop("outerHTML"));
						//js
						console.log($("#float-r").next("script").text());
						
						function css(selector){

							function readCss(a){

							    var sheets = document.styleSheets, o = [];
							    a.matches = a.matches || a.webkitMatchesSelector || a.mozMatchesSelector || a.msMatchesSelector || a.oMatchesSelector;
							    for (var i in sheets) {
							        var rules = sheets[i].rules || sheets[i].cssRules;
							        for (var r in rules) {
							            if (a.matches(rules[r].selectorText)) {
							                o[rules[r].selectorText] = (rules[r].cssText);
							            }
							        }
							    }
							    return o;
							};
							
							function writeCss(){

							};

							var ele = $(selector)[0];
							var cssArray = readCss(ele);
							console.log(cssArray);
						};
						

						$(function(){
							css(".float-r");
							css(".heart");
						})
						
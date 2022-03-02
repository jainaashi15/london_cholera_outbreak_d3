
			var dialog = null;
			(function loadVideoDialog(){
			dialog = document.getElementById('videoDialog');
			
			document.getElementById('hide').onclick = function(){
				dialog.close();
				};
			})();
			
			function showEmbeddedVideo(){
				if(dialog != null){dialog.showModal();}
				else return true;
			};
            
			
			
			var popupDialog = document.getElementById('popupDialog');
			//var outputBox = document.querySelector('output');
			var selectval = document.querySelector('select');
			var okBtn = document.getElementById('okBtn');
			var btn = document.getElementById('btn1');

			
			btn1.addEventListener('click', function handleClick() {
			  const initialText = 'View Grid';

			  if (btn.textContent.toLowerCase().includes(initialText.toLowerCase())) {
				
						popupDialog.showModal();
					 
				
			  } else {
				d3.select("#main_map").select("svg").select("#grid").remove();
				flagdeaths=1;
				btn.textContent = initialText;
			  }
			});
			
			selectval.addEventListener('change', function onSelect(e) {
				  okBtn.value = selectval.value;
				});
		   
		   popupDialog.addEventListener('close', function onClose() {
			  //console.log(popupDialog.returnValue);
			  createGrid(popupDialog.returnValue);
				flagdeaths =0;
				btn.textContent = 'Remove';
			});
			
			btn2.addEventListener('click', function handleClick() {
			
			 
									  d3.select("#main_map").select("svg").select("#mapdeaths").selectAll("circle").remove();
								  createdeaths_gif(deaths_age_sex_array);
								 								  
			});
			
			const rangeInput = document.querySelectorAll(".sliderinput input");
			range = document.querySelector(".slider .progress");
            
			
			
			
			rangeInput.forEach(input =>{
				input.addEventListener("input", e =>{
					let minVal = parseInt(rangeInput[0].value),
					maxVal = parseInt(rangeInput[1].value);
					if((maxVal - minVal) < 1){
						if(e.target.className === "left"){
							rangeInput[0].value = maxVal - 1
						}else{
							rangeInput[1].value = minVal + 1;
						}
					}else{
						//priceInput[0].value = minVal;
						//priceInput[1].value = maxVal;
						range.style.left = ((minVal / rangeInput[0].max) * 100) + "%";
						range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
						//console.log("else");
						//console.log(minVal,maxVal);
						document.getElementById("llabel").innerHTML =death_days_array[minVal].date;
                        document.getElementById("rlabel").innerHTML =death_days_array[maxVal].date;
						var totaldeaths =0
						var totaldeaths1 =0
						 for (i=0;i<deaths_age_sex_array.length;i++)
													{
														count_death_array[i][3]=0;
													};
											for (count_i=0;count_i<minVal;count_i++){
												totaldeaths1 = totaldeaths1 + +death_days_array[count_i].deaths
												 
											};
											for (count_i=minVal;count_i<maxVal;count_i++){
												totaldeaths = totaldeaths + +death_days_array[count_i].deaths
												 
											};
							totaldeaths = totaldeaths +totaldeaths1
							//console.log(totaldeaths1,totaldeaths)											
						  var newdataarray =[];
												  
												  for (count_j=totaldeaths1;count_j<totaldeaths;count_j++){
													 newdataarray.push(deaths_age_sex_array[count_j]);
													 count_death_array[count_j][3]=1;};
						d3.select("#main_map").select("svg").select("#mapdeaths").selectAll("circle").remove();
							createdeaths(newdataarray);
					}
				});
			});
			
			
			
		   //Main_map
            var xscale_map =null;
            var yscale_map =null;
            var width_map = 600;
            var height_map = 600;
            var padding = 10;
            var barPadding = 2;
			var flagdeaths =1;
			var flag_mouse =0;
            var griddetails =[];    
			var count_death_array =[];
			
			var deaths_age_sex_array =[];
			var death_days_array =[];
			var totalMF = [[0,0,0,0,0,0,0,"M"],[0,0,0,0,0,0,0,"F"]];
			  var totals =[
                                   [0,0,0,"0-10",0],
                                   [0,0,0,"11-20",0],
                                   [0,0,0,"21-20",0],
                                   [0,0,0,"41-60",0],
                                   [0,0,0,"61-80",0],
                                   [0,0,0,">80",0]
                               ];
							   
			
			var div = d3.select("body").append("div")
				 .attr("class", "tooltip")
				 .style("opacity", 0);	
            var svg_map = d3.select("body").select("#full-page").select("#main").select("#main_map")
							.append("svg")
							.attr("width", width_map)
							.attr("height", height_map);
				
			function createGrid(num){		   

				var clusterRange = (width_map-100)/num;
				griddetails=[];
				var grid = svg_map.append('g')
					.attr("id","grid")
				   .attr('class', 'grid')
				   .attr("transform", "translate(0,0)");
   

				var id =0
				for (var x = 100; x <= width_map ; x += clusterRange) {
					for (var y = 0; y <= 499 ; y+= clusterRange) {
						griddetails.push([id,x,y,x+clusterRange,y+clusterRange]);
						grid.append('rect')
							.attr("id",id)
							.attr("x", x)
							 .attr("y",y)
							 .attr("width", clusterRange)
							 .attr("height",clusterRange)
							 .attr("opacity",0.1)
							 .attr("fill","white")
							 .attr("stroke","black")
							 .attr("stroke-width",2)
							 
						 
							 .attr("class","grid")
							 .on("mouseover", function() {
									d3.select(this)
									  .attr("fill", "#ec7014");
									  count_deaths_in_grid(this.id);
									  })
							.on("mouseout", function() {
									d3.select(this)
									  .attr("fill", "white");
									  div.transition()
											   .duration('50')
											   .style("opacity", 0);
											   });		  
							id = id+1
       
					}
				}
			}	
			
//Plotting the map streets
            d3.json("streets.json", function(d) {
                  
				var datasets = d
				var dataset_len =datasets.length
				
				xscale_map = d3.scale.linear()
						 .domain([0, d3.max(datasets, function(d) { return d[0].x; })])
						 .range([padding, width_map - padding]);
				//xscale_map = xScale;
			 
				yscale_map = d3.scale.linear()
						 .domain([0, d3.max(datasets, function(d) { return d[0].y; })])
						 .range([height_map - padding, padding]);
				//yscale_map =yScale;
				
				
				var linepathgenerator =d3.svg.line()
						.x(function (d) {return xscale_map(d.x) ;})
						.y(function (d) {return yscale_map(d.y) ;})
						.interpolate("linear");
				
				var svg_map_lines =svg_map.append("g")
										.attr("class", "maplines")
										.attr("transform", "translate(0,0)");
				
				for (count_i=0;count_i<dataset_len;count_i++){
					var dataset_step1 = datasets[count_i];
					svg_map_lines.append("path")
					   .attr("stroke", "#252525")
					   .attr("stroke-width", "2px")
					   .attr("fill","none")
					   .attr("d", linepathgenerator(dataset_step1));
				};
			});   
	
//createGrid(3);
 
//console.log(griddetails);
            
			
			
			function count_deaths_in_grid(gridnum){
				x1=griddetails[gridnum][1];
				x2=griddetails[gridnum][3];
				y1=griddetails[gridnum][2];
				y2=griddetails[gridnum][4];
				var t_deathsingrid =0;
		 
				for(i=0;i<count_death_array.length;i++)
				{
					dx=count_death_array[i][1];
					dy=count_death_array[i][2];
					//console.log(x1,dx);
					//console.log(x1>=dx);
					if(count_death_array[i][3]==1){
					if(x1<=dx & x2>=dx)
					{
						if(y1<=dy & y2>=dy)
						{
							t_deathsingrid =t_deathsingrid+1;
						};
					};
					}
				};
				//console.log(x1,y1,x2,y2,t_deathsingrid);
				div.transition()
					.duration(50)
					.style("opacity", 1);
											   
											   
				div.html("Deaths :"+t_deathsingrid)
					.style("left", (d3.event.pageX + 10) + "px")
					.style("top", (d3.event.pageY - 15) + "px");
		
			};
//Plotting the pumps on the map

            d3.csv("pumps.csv", function(data) {
				datasetp = data;    
				  
				var svg_map_pump =svg_map.append("g")
							.attr("class", "mappumps")
							.attr("transform", "translate(10,10)");
										
				 var circles = svg_map_pump.selectAll("circle")
								   .data(datasetp)
								   .enter()
								   .append("circle")
								   .attr("cx", function(d,i) {

										return xscale_map(datasetp[i].x);  //Returns scaled value
									})
									 .attr("cy", function(d,i) {
										return yscale_map(datasetp[i].y);  //Returns scaled value
									})
									 .attr("r", function(d) {
										return 6;
									})
								   .attr("fill", "#252525")
								   
								   .attr("stroke-width", 2);

								
				  
            });
			
			var map_legend_data =[ 
													["#252525","Pump"],
													["#67a9cf","Male"],
													["#ef8a62","Female"]
												];
								var g = svg_map
										  .append("g")
                                    .attr("class", "map_legend")
									;
									
										  g.selectAll("L_circle").data(map_legend_data)
										  .enter()
										  .append("circle")
										  .attr("id",function(d,i){return i;})
											.attr("cx", 20)
											.attr("cy", function(d,i){ return 40 + i*15}) // 100 is where the first dot appears. 25 is the distance between dots
											 .attr("r",function(d,i){ if (i==0){return 6;}
											 else {return 4;}})
											.attr("fill", function(d,i){ return map_legend_data[i][0];})
											.attr("opacity",1);
											
										g.selectAll("L_circle").data(map_legend_data)
										  .enter().
										  append("text")
											.attr("x", 35)
											.attr("y", function(d,i){ return 42 + i*15}) // 100 is where the first dot appears. 25 is the distance between dots
											.style("fill", "black")
											.text(function(d,i){ return map_legend_data[i][1];})
											.attr("text-anchor", "left")
											.attr("font-size", 15)
											.style("alignment-baseline", "middle");
											
											
			 d3.csv("deaths_age_sex.csv", function(data) {
					var temp
					datasetd = data; 
					for(i=0;i<datasetd.length;i++)
					{
						deaths_age_sex_array.push(datasetd[i]);
					}
					//console.log(deaths_age_sex_array);
//Plot deaths on main_map

					createdeaths(datasetd);
					
					
					
					for (i=0;i<datasetd.length;i++)
					{
						count_death_array.push([i,xscale_map(datasetd[i].x),yscale_map(datasetd[i].y),1]);
					};
					//console.log(count_death_array);
					
                  
                                                   
                    for (i=0;i<datasetd.length;i++){
                                //console.log(datasetd[i].age)
                                  var rangenum = +datasetd[i].age;
                                  totals[rangenum][0] = totals[rangenum][0] +1;
                                  var gen = +datasetd[i].gender;
                                  totals[rangenum][gen+1] = totals[rangenum][gen+1] +1;
                                        
                      };
                          
                    var total_death = 0;
                    for(i=0;i<totals.length;i++){
                            total_death =total_death + totals[i][0];
                          };
                    var    formatDecimal = d3.format(".2f");
                    for(i=0;i<totals.length;i++){
                            totals[i][4] = formatDecimal((totals[i][0]/total_death)*100) ;
                          };
                          //console.log(totals);
                          

                          //console.log(total_death);                          

                    
                    for (i=0;i<totals.length;i++){
                                  var M = totals[i][1];
                                  var F = totals[i][2];
                                  totalMF[0][i] = M;
                                  totalMF[1][i] = F;
                                  totalMF[0][6] = totalMF[0][6]+ M;
                                  totalMF[1][6] = totalMF[1][6]+ F;
                                  
                        }

                          console.log(totalMF);

                    var w_n1 = 350;
                    var h_n1 = 200;
                    var ypadding = 65;
					var padding = 100;
                    var barPadding = 1;

                       
                    var xScale = d3.scale.ordinal()
                              .domain(d3.range(totals.length))
                              .rangeRoundBands([padding, w_n1-padding], 0.09);
                    var yScale = d3.scale.linear()
                             .domain([0, d3.max(totals, function(d,i) { 
                              return totals[i][0]; })])
                             .range([h_n1- ypadding,ypadding ]);
               
					var myid;

               
//foot_bar
					var xAxis = d3.svg.axis().scale(xScale).tickFormat(function(d,i) { return totals[i][3]; });
				    var yAxis = d3.svg.axis()
					  .scale(yScale)
					  .orient("left")
					  .ticks(4);
                    var svg = d3.select("body").select("#full-page").select("#foot").select("#foot_MFpie")
                                .append("svg")
                                .attr("id", "#svg_bar")
                                .attr("width", w_n1)
                                .attr("height", h_n1);
                              svg.selectAll("rect")
                                 .data(totals)
                                 .enter()
                                 .append("rect")
                                 .attr("id", function(d, i) {
                                    return i;        
                                 })
                                 .attr("x", function(d, i) {
                                    return xScale(i);        
                                 })
                                 .attr("y",function(d,i) {
                                      return  yScale(totals[i][0]);  //Height minus data value
                                  })
                                 .attr("width", xScale.rangeBand())
                                 .attr("height",function(d,i) {
                                      return yScale(0)- yScale(totals[i][0])   ;
                                  })
                                 .attr("fill", function(d) {
                                      return "#993404";
                                  })
                                 .on("mouseover", function() {
										d3.select(this)
											.attr("fill", "#ec7014");

										myid =(this.id);
										d3.select("#foot_MFpie").select("#svgpie").remove();
										createpie(myid,totalMF);
										
										div.transition()
											.duration(50)
											.style("opacity", 1);
													   
													   
										div.html("\n Male:"+totalMF[0][myid]+"\n Female:"+totalMF[1][myid])
											.style("left", (d3.event.pageX + 10) + "px")
											.style("top", (d3.event.pageY - 15) + "px");
													 
									})
						
								.on("mouseout", function(d) {
										d3.select(this)
											.attr("fill", "#993404");
										var revove_id ="#" + myid;
							  
										d3.select("body").select("#full-page").select("#foot").select("#foot_MFpie").select("#svgpie").remove();
										createpie(6,totalMF);
																				
										div.transition()
											.duration(50)
											.style("opacity", 0);
									});
									
					svg.selectAll("text")
							   .data(totals)
							   .enter()
							   .append("text")
							   .text(function(d,i) {
									return totals[i][0];
							   })
							   .attr("x", function(d, i) {
								  return xScale(i) + xScale.rangeBand() / 2;        
							   })
							   .attr("y", function(d,i) {
									return  yScale(totals[i][0]) +10;
							   })
							.attr("font-family", "sans-serif")
							.attr("font-size", "9px")
							.attr("fill", "white")
							.attr("text-anchor", "middle");
									
					svg.append("text")
								.attr("x", (w_n1 / 2))             
								.attr("y", 20 )
								.attr("text-anchor", "middle") 
								.attr("font-family", "arial") 
								.style("font-size", "16px") 
								//.style("text-decoration", "underline")  
								.text("Deaths by Age Group");
					svg.append("g")
							.attr("class", "axis")
							.attr("transform", "translate(" + padding + ",0)")
							.call(yAxis);
					svg.append("g")
							.attr("class", "axis")
							.attr("transform", "translate(0,"+(h_n1 -ypadding)+")")
							.call(xAxis)
							.selectAll("text")	
							.style("text-anchor", "end")
							.attr("dx", "-.8em")
							.attr("dy", "-.4em")
							.attr("transform", function(d) {
									return "rotate(-90)" 
								});
								
					svg.append("text")             
							  .attr("transform",
									"translate(" + (w_n1/2) + " ," + 
												   (h_n1-10) + ")")
							  .style("text-anchor", "middle")
							  .text("Age Groups");
							  
						svg.append("text")
							  .attr("transform", "rotate(-90)")
							  .attr("y", 65  )
							  .attr("x",-95)
							  
							  .style("text-anchor", "middle")
							  .text("Deaths"); 
										
					createpie(6,totalMF);
                              // function type(d) {
                              //   d.population = +d.population;
                              //   return d;
                              // }
					var width = 250,
                                    height = 220,
                                    radius = 190 / 2;

                    var color = d3.scale.ordinal()
								.range(['#8c510a','#d8b365','#f6e8c3','#c7eae5','#5ab4ac','#01665e']);
                    var arc = d3.svg.arc()
                                 .outerRadius(radius - 10)
                                 .innerRadius(30);
					var arc2 = d3.svg.arc()
                                .outerRadius(radius - 5)
                                .innerRadius(30);
                    var pie = d3.layout.pie()
                                    .sort(null)
                                    .value(function(d,i) { return totals[i][0]; });

                  

                    var MF_svg = d3.select("body").select("#full-page").select("#foot").select("#foot_toatlpie")
                                .select("#svgtotal")
                                    .attr("width", width)
                                    .attr("height", height)
                                  .append("g")
                                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
                                 
					var title = d3.select("body").select("#full-page").select("#foot").select("#foot_toatlpie").select("#svgtotal")              
								title.append("text")
										.attr("x", (width / 2))             
										.attr("y", 12 )
										.attr("text-anchor", "middle")
										.attr("font-family", "arial") 										
										.style("font-size", "15px") 
										//.style("text-decoration", "underline")  
										.text("Cholera deaths in 1854");             

                    var g = MF_svg.selectAll(".arc")
                                    .data(pie(totals))
                                   // .transiton()
                                  .enter().append("g")
                                    .attr("class", "arc");

                    var pie = g.append("path")
								.attr("id",function(d,i) { return i; })
                                    .attr("d", arc)
                                    .style("fill", function(d,i) { return color(i); });
									
					pie.on("mouseover", function() {
								var myid = this.id;
								d3.select(this).attr("d", arc2)
                                    ;
									
                //tooltip.style("visibility", "visible");
											div.transition()
											   .duration(50)
											   .style("opacity", 1);
											   
											  // console.log(myid);
											   	div.html(totals[myid][4] + "%")
									.style("left", (d3.event.pageX + 10) + "px")
									.style("top", (d3.event.pageY - 15) + "px");
											  
								})
						.on("mouseout", function(d) {
										d3.select(this).attr("d", arc)
                                    .attr("opacity",1);
									   div.transition()
										   .duration('50')
										   .style("opacity", 0);});
/*
                                g.append("text")
                                    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
                                    .attr("dy", ".35em")
                                    .text(function(d,i) { return totals[i][4] + "%"; });*/



			});								

//Main_bar

                       
            d3.csv("deathdays.csv", function(d) {
                var w2 = 600;
                var h2 = 540;
                var padding = 60;
				var xpadding = 50;
                var barPadding = 1;
				
                dataset_d = d; 
				
				for(i=0;i<dataset_d.length;i++){
				
				death_days_array.push(dataset_d[i]);
				}
               var t_c =0;
			   var t_n =0;
			   var up_t =0;
			   for(i=0;i<dataset_d.length;i++)
			   {
			   //console.log("i",i);
			   t_c = t_n
			   up_t =t_c+ (+dataset_d[i].deaths);
			   t_n=up_t
			   //console.log(t_c,up_t);
					for(j=t_c;j< up_t ;j++)
					{
						//console.log("j",j);
						deaths_age_sex_array[j].date = death_days_array[i].date;
					}
			   }
			   //console.log("new",deaths_age_sex_array);
			   
                
                  var xScale = d3.scale.ordinal()
                      .domain(d3.range(dataset_d.length))
                      .rangeRoundBands([xpadding,w2], 0.09);
                  var yScale = d3.scale.linear()
                     .domain([0, d3.max(dataset_d, function(d) { 
                      return +d.deaths; })])
                     .range([h2 - padding,padding]);
					 
				  var xAxis = d3.svg.axis().scale(xScale).tickFormat(function(d,i) { return dataset_d[i].date; });
				  var yAxis = d3.svg.axis()
					  .scale(yScale)
					  .orient("left")
					  .ticks(8);
					  
                  var svg = d3.select("body").select("#full-page").select("#main").select("#main_bar")
							.append("svg")
							.attr("width", w2)
							.attr("height", h2);
                  svg.selectAll("rect")
                         .data(dataset_d)
                         .enter()
                         .append("rect")
                         .attr("id" ,function(d, i) {
                            return i;        
                         })
                         .attr("x", function(d, i) {
                            return xScale(i);        
                         })
                         .attr("y",function(d) {
                              return yScale(d.deaths);  
                          })
                         .attr("width", xScale.rangeBand())
                         .attr("height",function(d) {
                              return yScale(0) - yScale(d.deaths)   ;
                          })
                         .attr("fill", function(d) {
                              return "#993404";
                          })
                         .on("mouseover", function() {
						 if(flag_mouse == 0){
						 svg.selectAll("rect").attr("fill", function(d) {
                              return "#993404";
									});
						 
                                d3.select(this)
                                  .attr("fill", "#ec7014");
								  
								var myid =(this.id); 
								div.transition()
									.duration(50)
									.style("opacity", 1);
											   
											   
								div.html("Deaths :"+dataset_d[myid].deaths)
									.style("left", (d3.event.pageX + 10) + "px")
									.style("top", (d3.event.pageY - 15) + "px");
											 
								
                                
                                var totaldeaths =0
                                for (count_i=0;count_i<myid;count_i++){
                                    totaldeaths = totaldeaths + +dataset_d[count_i].deaths
                                };
                              
                                var myid2=+dataset_d[myid].deaths;
                              
                                var uptototal = totaldeaths+myid2
								
								//read deaths data
                                
								
                                     
                                     
                                      var newdataarray =[];
									  for (i=0;i<deaths_age_sex_array.length;i++)
										{
											count_death_array[i][3]=0;
										};
                                      for (count_j=totaldeaths;count_j<uptototal;count_j++){
                                         newdataarray.push(deaths_age_sex_array[count_j]);
										 count_death_array[count_j][3]=1;
                                         };
										//console.log(count_death_array)
									  d3.select("#main_map").select("svg").select("#mapdeaths").selectAll("circle").remove();
									  //createGrid(4);
									  createdeaths(newdataarray);
                                  
							}
						})
						.on("click", function() {
							if(flag_mouse ==0){flag_mouse = 1;}
							else{flag_mouse = 0;
							d3.select(this)
								  .attr("fill", "#993404");
								  
								  d3.select(this)
								  .attr("fill", "#993404");
								  
								  d3.select("#main_map").select("svg").select("#mapdeaths").selectAll("circle").remove();
								  
								  
								  for (i=0;i<deaths_age_sex_array.length;i++)
										{
											count_death_array[i][3]=1;
										};
									
								  createdeaths(deaths_age_sex_array);
								  }
							})
                        .on("mouseout", function(d) {
                                
							  div.transition()
										   .duration('50')
										   .style("opacity", 0);
							  if(flag_mouse ==0){
								  d3.select(this)
								  .attr("fill", "#993404");
								  
								  d3.select("#main_map").select("svg").select("#mapdeaths").selectAll("circle").remove();
								  
								
								  for (i=0;i<deaths_age_sex_array.length;i++)
										{
											count_death_array[i][3]=1;
										};
								//console.log(deaths_age_sex_array.length);
								  createdeaths(deaths_age_sex_array);
								  
							   };
							});
						
						svg.append("text")
								.attr("x", (w2 / 2))             
								.attr("y", 20 )
								.attr("text-anchor", "middle") 
								.attr("font-family", "arial")								
								.style("font-size", "20px") 
								.style("text-decoration", "underline")  
								.text("Timeline graph : Total Deaths by date");
						
						svg.append("g")
							.attr("class", "axis")
							.attr("transform", "translate(" + xpadding + ",0)")
							.call(yAxis);
						svg.append("g")
							.attr("class", "axis")
							.attr("transform", "translate(0,"+(h2-padding)+")")
							.call(xAxis)
							.selectAll("text")	
								.style("text-anchor", "end")
								.attr("dx", "-.8em")
								.attr("dy", ".15em")
								.attr("transform", function(d) {
									return "rotate(-65)" 
									});
						svg.append("text")             
							  .attr("transform",
									"translate(" + (w2/2) + " ," + 
												   (h2-8) + ")")
							  .style("text-anchor", "middle")
							  .text("Date");
							  
						svg.append("text")
							  .attr("transform", "rotate(-90)")
							  .attr("y", +20  )
							  .attr("x",-250 )
							  
							  .style("text-anchor", "middle")
							  .text("Deaths"); 
              
            },
            );
			  
			var svg_map_deaths =svg_map.append("g")
								.attr("class", "mapdeaths")
								.attr("id", "mapdeaths")
								.attr("transform", "translate(0,0)");
								
			
			
  
  

 
//function to plot deaths on map	 
			function createdeaths(dataarray){ 
					datasetd = dataarray; 
  
					var rectd = svg_map_deaths.selectAll("rectd")
                               .data(datasetd)
                               .enter()
                               //.append("rect")
							   .append("circle")
							   .attr("id",function(d,i) { return i;})
                               .attr("cx", function(d,i) {

                                    return xscale_map(datasetd[i].x);  
                                })
                                 .attr("cy", function(d,i) {
                                    return yscale_map(datasetd[i].y);  
                                })
								 .attr("r", function(d) {
                                    return 4;
                                })
                                 //.attr("width", 8)
                                 //.attr("height",8)
                                .attr("fill", function(d,i) {
                                                      if(datasetd[i].gender == 1){
														return "#d6604d";
                                                        }
                                                      else{
                                                        
														return "#4393c3";
														}
								})
								/*.attr("stroke", function(d,i) {
                                                      if(datasetd[i].gender == 1){
														return "#d6604d";
                                                        }
                                                      else{
                                                        
														return "#4393c3";
														}
                                 })*/
								 .attr("stroke-width",2)
								
								.attr("opacity","0.9")
								.on("mouseover", function() {
										if(flagdeaths ==1){
										  myid =(this.id);
										  div.transition()
											   .duration(50)
											   .style("opacity", 1);
											   function  getagegrp() {if(datasetd[myid].age == 0){ return "Age Group 0-10";}
														else if(datasetd[myid].age == 1){ return "Age Group 11-20";}
														else if(datasetd[myid].age == 2){ return "Age Group 21-40";}
														else if(datasetd[myid].age == 3){ return "Age Group 41-60";}
														else if(datasetd[myid].age == 4){ return "Age Group 61-80";}
														else { return "Age Group > 80";}};
											   
											   div.html(getagegrp())
											 .style("left", (d3.event.pageX + 10) + "px")
											 .style("top", (d3.event.pageY - 15) + "px");}})
								.on("mouseout", function(d) {
										
									   div.transition()
										   .duration('50')
										   .style("opacity", 0);});
										   
								
 
			}; 
			
			function createdeaths_gif(dataarray){ 
					datasetd = dataarray; 
  
					var rectd = svg_map_deaths.selectAll("rectd")
                               .data(datasetd)
                               .enter()
                               //.append("rect")
							   .append("circle")
							   .attr("id",function(d,i) { return i;})
                               .attr("cx", function(d,i) {

                                    return xscale_map(datasetd[i].x);  
                                })
                                 .attr("cy", function(d,i) {
                                    return yscale_map(datasetd[i].y);  
                                })
								 .attr("r", function(d) {
                                    return 4;
                                })
                                 //.attr("width", 8)
                                 //.attr("height",8)
                                 .attr("fill", function(d,i) {
                                                      if(datasetd[i].gender == 1){
														return "#d6604d";
                                                        }
                                                      else{
                                                        
														return "#4393c3";
														}
								})
								/*.attr("stroke", function(d,i) {
                                                      if(datasetd[i].gender == 1){
														return "#d6604d";
                                                        }
                                                      else{
                                                        
														return "#4393c3";
														}
                                 })*/
								 .attr("stroke-width",2)
								
								.attr("opacity","0")
								.on("mouseover", function() {
										if(flagdeaths ==1){
										  myid =(this.id);
										  div.transition()
											   .duration(50)
											   .style("opacity", 1);
											   function  getagegrp() {if(datasetd[myid].age == 0){ return "Age Group 0-10";}
														else if(datasetd[myid].age == 1){ return "Age Group 11-20";}
														else if(datasetd[myid].age == 2){ return "Age Group 21-40";}
														else if(datasetd[myid].age == 3){ return "Age Group 41-60";}
														else if(datasetd[myid].age == 4){ return "Age Group 61-80";}
														else { return "Age Group > 80";}};
											   
											   div.html(getagegrp())
											 .style("left", (d3.event.pageX + 10) + "px")
											 .style("top", (d3.event.pageY - 15) + "px");}})
								.on("mouseout", function(d) {
										
									   div.transition()
										   .duration('50')
										   .style("opacity", 0);});
										   
								 svg_map.select("#mapdeaths").selectAll("circle")
											.transition()
											.delay(function(d,i){return 40*i;})
											.duration(500)
											.each("start", function() {      // <-- Executes at start of transition
												   d3.select(this)
													 //.attr("fill", "blue")
													 .attr("r", 6);   })
											.each("end", function() {        // <-- Executes at end of transition
											var myid = this.id
												   d3.select(this)
													 .attr("fill", function(d,i) {
                                                      if(deaths_age_sex_array[myid].gender == 1){
														return "#d6604d";
                                                        }
                                                      else{
                                                        
														return "#4393c3";
														}
								})
													 .attr("r", 4);
											   })
											.ease("circle")
											.attr("opacity",0.9);
											
 
			}; 
			
			var div_tooptip = d3.select("body").append("div")
				.attr("class", "tooltip-donut")
				.style("opacity", 0);
				
//function to draw a pie chart				
			function createpie(data,dataarray){
							    var myid = data;
							    var svgnum = "svgpie" 
                                var width = 180,
                                    height = 200,
                                    radius = 80;

                                var color = d3.scale.ordinal()
									.range([ "#4393c3","#d6604d"]);
	
								
                                var arc = d3.svg.arc()
                                              .outerRadius(radius - 10)
                                              .innerRadius(0);

                                var pie = d3.layout.pie()
                                    .sort(null)
                                    .value(function(d,i) { return dataarray[i][myid]; });

                                var labelArc = d3.svg.arc()
                                      .outerRadius(radius - 40)
                                      .innerRadius(radius - 40);

                                var MF_svg = d3.select("body").select("#full-page").select("#foot")
                                .select("#foot_MFpie")
								
                                .append("svg")
                                    .attr("id",svgnum)
                                    .attr("width", width)
                                    .attr("height", height)
                                  .append("g")
                                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
									;
								svgnum = "#" + svgnum 	
								var title = d3.select("body").select("#full-page").select("#foot").select("#foot_MFpie").select(svgnum)           
								title.append("text")
										.attr("x", width/2)             
										.attr("y", 15 )
										.attr("text-anchor", "middle") 
										.attr("font-family", "arial") 										
										.style("font-size", "15px") 
										//.style("text-decoration", "underline")  
										.text("Males and Females deaths");											  

                                var g = MF_svg.selectAll(".arc")
                                    .data(pie(dataarray))
                                   // .transiton()
                                  .enter().append("g")
                                    .attr("class", "arc");

                                g.append("path")
                                    .attr("d", arc)
                                    .style("fill", function(d,i) { return color(i); })
									
									;

                                g.append("text")
                                    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
                                    .attr("dy", ".35em")
                                    .text(function(d,i) { return dataarray[i][7]; })
									.attr("fill", "white")  ;
                              };



           

			var censusarr =[
				  ["0-10",28],
				 ["11-20",25],
				 ["21-40",30],
				 ["41-60",13],
				 ["61-80",4],
				  ["> 80",1]
			];

				var width = 250,
                    height = 220,
                    radius = 190 / 2;

                var color = d3.scale.ordinal()
    .range(['#8c510a','#d8b365','#f6e8c3','#c7eae5','#5ab4ac','#01665e']);
                var arc = d3.svg.arc()
                                              .outerRadius(radius - 10)
                                              .innerRadius(30);
				var arc2 = d3.svg.arc()
                                              .outerRadius(radius - 5)
                                              .innerRadius(30);

                var pie = d3.layout.pie()
                                    .sort(null)
                                    .value(function(d,i) { return censusarr[i][1]; });


                var MF_svg = d3.select("body").select("#full-page").select("#foot").select("#foot_toatlpie")
                                .select("#svgcensus")
                                    .attr("width", width)
                                    .attr("height", height)
                                  .append("g")
                                    .attr("transform", "translate(" + width / 2 + "," + (height ) / 2 + ")");
									
                var title = d3.select("body").select("#full-page").select("#foot").select("#foot_toatlpie").select("#svgcensus")              
								title.append("text")
										.attr("x", (width / 2))             
										.attr("y", 12 )
										.attr("text-anchor", "middle")  
										.attr("font-family", "arial") 
										.style("font-size", "15px") 
										//.style("text-decoration", "underline")  
										.text("Census in 1850s");
                var g = MF_svg.selectAll(".arc")
                                    .data(pie(censusarr))
                                   // .transiton()
                                  .enter().append("g")
                                    .attr("class", "arc");

                var pie = g.append("path")
									.attr("id",function(d,i) { return i; })
                                    .attr("d", arc)
                                    .style("fill", function(d,i) { return color(i); });
									
				pie.on("mouseover", function() {
								var myid = this.id;
								d3.select(this).attr("d", arc2)
                                    ;
									
                //tooltip.style("visibility", "visible");
											div.transition()
											   .duration(50)
											   .style("opacity", 1);
											   
											  // console.log(myid);
											   	div.html(censusarr[myid][1] + "%")
									.style("left", (d3.event.pageX + 10) + "px")
									.style("top", (d3.event.pageY - 15) + "px");
											  
								})
								.on("mouseout", function(d) {
										d3.select(this).attr("d", arc)
                                    .attr("opacity",1);
									   div.transition()
										   .duration('50')
										   .style("opacity", 0);});
/*
                                g.append("text")
                                    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
                                    .attr("dy", ".35em")
                                    .text(function(d,i) { return censusarr[i][1] + "%"; });*/


							 var legend_svg = d3.select("body").select("#full-page").select("#foot").select("#foot_toatlpie")
                                .select("#legend_svg")
                                    .attr("width", 100)
                                    .attr("height", 190) 
									.append("g");
                                    //.attr("transform", "translate(" + 200 / 2 + "," + 190 / 2 + ")");
								
								var g = legend_svg.selectAll("legendrect")
										  .data(censusarr)
										  .enter().append("g")
                                    .attr("class", "legend");
									
										  g.append("rect")
										  .attr("id",function(d,i){return i;})
											.attr("x", 10)
											.attr("y", function(d,i){ return 10 + i*15}) // 100 is where the first dot appears. 25 is the distance between dots
											 .attr("width", 10)
											 .attr("height",10)
											.attr("fill", function(d,i){ return color(i);})
											.attr("opacity",1);
											
										g.append("text")
											.attr("x", 30)
											.attr("y", function(d,i){ return 17 + i*15}) // 100 is where the first dot appears. 25 is the distance between dots
											.style("fill", "black")
											.text(function(d,i){ return censusarr[i][0]})
											.attr("text-anchor", "left")
											.attr("font-size", 12)
											.style("alignment-baseline", "middle");

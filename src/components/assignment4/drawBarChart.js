
import * as d3 from "d3";
import ScatterPlot from "./ScatterPlot";

export let drawBarChart = (barChartLayer, data, xScale, yScale, barChartWidth, barChartHeight) => {

    //Task 7: Complete the code to draw the bars
    //Hint:
    //1. The bars are drawn as rectangles
    //2. Add a mouseover event to the bar
    //3. The mouseover event should also highlight the corresponding points in the scatter plot
    //4. The mouseout event should remove the highlight from the corresponding points in the scatter plot 
    //5. You can refer to the code in the drawScatterPlot function 
    barChartLayer.selectAll('.bar')
      .data(data)
      .enter() 
      .append('rect') 
      .attr('class', d=>`point ${d.station.replace(/[^a-zA-Z]/g, "")}`) //set the class names of the circle element to 'point' and the station name
      .attr('x', d => xScale(d.station))
      .attr('y', d => yScale(d.end))
      .attr('width', xScale.bandwidth())
      .attr('height', d => 260 - yScale(d.end))
      .style('fill', 'steelblue')
      .style('stroke', 'black')
      .style("stroke-width", 2)

    //Task 8: Connect the bar chart with the scatter plot
    //Hint:
    //1. Add a mouseover event to the bar
    //2. The mouseover event should also highlight the corresponding points in the scatter plot
    
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget)
                  .style("fill", "red");
        d3.selectAll(`.point.${d.station.replace(/[^a-zA-Z]/g, "")}`)
          .style("fill", "red")
          .attr('r', 10)
          .raise();
      })
      .on('mouseout',(event, d)=>{
        d3.select(event.currentTarget)
                  .style('fill', 'steelblue')
        d3.selectAll(`.point.${d.station.replace(/[^a-zA-Z]/g, "")}`)
          .style("fill", "steelblue")
          .attr('r', 5)
          .lower();      
      })


};
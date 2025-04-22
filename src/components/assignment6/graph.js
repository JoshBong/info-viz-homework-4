import {useEffect, useRef} from 'react'; 
import * as d3 from 'd3';
import { getNodes } from '../assignment6/utils/getNodes';
import { getLinks } from '../assignment6/utils/getLinks';   
import {drag} from '../assignment6/utils/drag';


export function Graph(props) {
        const { margin, svg_width, svg_height, data } = props;

        const nodes = getNodes({rawData: data});
        const links = getLinks({rawData: data});
    
        const width = svg_width - margin.left - margin.right;
        const height = svg_height - margin.top - margin.bottom;

        const lineWidth = d3.scaleLinear().range([2, 6]).domain([d3.min(links, d => d.value), d3.max(links, d => d.value)]);
        const radius = d3.scaleLinear().range([10, 50])
                .domain([d3.min(nodes, d => d.value), d3.max(nodes, d => d.value)]);
        const color = d3.scaleOrdinal().range(d3.schemeCategory10).domain(nodes.map( d => d.name));
        
        
        const d3Selection = useRef();
        useEffect( ()=>{
            d3.select(".node-tooltip").remove();

            const tooltip = d3.select("body")
                .append("div")
                .attr("class", "node-tooltip")
                .style("position", "absolute")
                .style("pointer-events", "none")
                .style("background", "white")
                .style("border", "1px solid gray")
                .style("border-radius", "4px")
                .style("padding", "4px 8px")
                .style("font-size", "12px")
                .style("visibility", "hidden")
                .style("z-index", 10);

            const simulation =  d3.forceSimulation(nodes)
                .force("link", d3.forceLink(links).id(d => d.name).distance(d => 20/d.value))
                .force("charge", d3.forceManyBody())
                .force("centrer", d3.forceCenter(width/2, height/2))
                .force("y", d3.forceY([height/2]).strength(0.02))
                .force("collide", d3.forceCollide().radius(d => radius(d.value)+20))
                .tick(3000);
            
            let g = d3.select(d3Selection.current);

            g.selectAll('.graph-background').remove();

            // Draw a background layer with white color
            g.append("rect")
                .attr("class", "graph-background")
                .attr("width", width)
                .attr("height", height)
                .attr("fill", "white") // Set background to white

            const link = g.append("g")
                .attr("stroke", "#999")
                .attr("stroke-opacity", 0.6)
                .selectAll("line")
                .data(links)
                .join("line")
                .attr("stroke-width", d => lineWidth(d.value));

            const node = g.append("g")
                .attr("stroke", "#fff")
                .attr("stroke-width", 1.5)
                .selectAll("circle")
                .data(nodes)
                .enter();

            const point = node.append("circle")
                .attr("r", d => radius(d.value))
                .attr("fill", d => color(d.name))
                .call(drag(simulation))
                .on("mouseover", (event, d) => {
                    console.log("Hovered over node:", d);
                    tooltip
                      .style("visibility", "visible") // Show the tooltip
                      .html(d.name); // Set the tooltip text to the node name (d.name)
                  })
                  .on("mousemove", (event) => {
                    tooltip
                      .style("top", `${event.pageY + 10}px`) // Position slightly below mouse
                      .style("left", `${event.pageX + 10}px`); // Position slightly to the right of mouse
                  })
                  .on("mouseout", () => {
                    tooltip.style("visibility", "hidden"); // Hide the tooltip when the mouse leaves
                  });   
            
            // const node_text = node.append('text')
            //     .style("fill", "black")
            //     .attr("stroke", "black")
            //     .text(d => d.name)

            simulation.on("tick", () => {
                g.selectAll('.legend').remove();
                g.selectAll('.link').remove();
                g.selectAll('.node').remove();

                link
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y);

                point
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y);
                
                // node_text
                //     .attr("x", d => d.x -radius(d.value)/4)
                //     .attr("y", d => d.y)

            const uniqueNames = Array.from(new Set(nodes.map(d => d.name)));
            const legendData = uniqueNames.map(name => ({ name, color: color(name) }));

            const legendGroup = g.append("g")
                .attr("class", "legend")
                .attr("transform", "translate(40, 0)");
            
            const legendItems = legendGroup.selectAll("g")
                .data(legendData)
                .enter()
                .append("g")
                .attr("transform", (d, i) => `translate(0, ${i * 20})`);

            legendItems.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 12)
                .attr("height", 12)
                .attr("fill", d => d.color);
            
            legendItems.append("text")
                .attr("x", 18)
                .attr("y", 10)
                .text(d => d.name)
                .attr("fill", "#333")
                .style("font-size", "12px");
            
            });

        }, [width, height])


        return <svg 
            viewBox={`0 0 ${svg_width} ${svg_height}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ width: "100%", height: "100%" }}
            > 
                <g ref={d3Selection} transform={`translate(${margin.left}, ${margin.top})`}>
                </g>
            </svg>
    };
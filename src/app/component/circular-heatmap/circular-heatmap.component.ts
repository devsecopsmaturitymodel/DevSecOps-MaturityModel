import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-circular-heatmap',
  templateUrl: './circular-heatmap.component.html',
  styleUrls: ['./circular-heatmap.component.css']
})
export class CircularHeatmapComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  var data =[{
    "Name": "Build",
    "Level": "Level 1",
    "Done": 0.5
  },{
    "Name": "Deployment",
    "Level": "Level 1",
    "Done": 0.2
  },{
    "Name": "Build",
    "Level": "Level 2",
    "Done": 0.25
  },{
    "Name": "Deployment",
    "Level": "Level 2",
    "Done": 0.1
  }, {
    "Name": "Build",
    "Level": "Level 3",
    "Done": 0.67
  },{
    "Name": "Deployment",
    "Level": "Level 3",
    "Done": 0.3
  },{
    "Name": "Build",
    "Level": "Level 4",
    "Done": 0.1
  },{
    "Name": "Deployment",
    "Level": "Level 4",
    "Done": 0.75
  }];

  var radial_labels = ['Level 1','Level 2','Level 3','Level 4'];

  var segment_labels = ['Build', 'Deployment'];

  this.loadCircularHeatMap(data, "#chart", radial_labels, segment_labels);

  }

  loadCircularHeatMap(dataset:any, dom_element_to_append_to:string, radial_labels:string[], segment_labels:string[]) {
    var margin = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50
    };
    var width = 1000 - margin.left - margin.right;
    var curr:any;
    var height = width;
    var innerRadius = 100; // width/14;
  
    var segmentHeight = (width - margin.top - margin.bottom - 2 * innerRadius) / (2 * radial_labels.length);
  
    var chart = this.circularHeatChart(segment_labels.length)
      .innerRadius(innerRadius)
      .segmentHeight(segmentHeight)
      .domain([0,1])
      .range(["white", "green"])
      .radialLabels(radial_labels)
      .segmentLabels(segment_labels);
  
    chart.accessor(function(d:any) {
      return d.Done;
    })
  
    var svg = d3.select(dom_element_to_append_to)
      .selectAll('svg')
      .data([dataset])
      .enter()
      .append('svg')
      .attr("width", "60%")
      .attr("height", height + margin.top + margin.bottom)
      .append('g')
      .attr("transform",
        "translate(" + ((width) / 2 - (radial_labels.length * segmentHeight + innerRadius)) + "," + margin.top + ")")
      .call(chart);
  
  
  
  
    var tooltip = d3.select(dom_element_to_append_to)
      .append('div')
      .attr('class', 'tooltip');
  
    tooltip.append('div')
      .attr('class', 'name');
    tooltip.append('div')
      .attr('class', 'level');
    tooltip.append('div')
      .attr('class', 'done');
    
      function cx(){
        var e = window.event as MouseEvent;
        return e.clientX;
      }
      function cy(){
        var e = window.event as MouseEvent ;
        return e.clientY;
      }
    svg.selectAll("path")
      .on('click', function(d) {
        //console.log('oa')
        tooltip.style('display', 'none');
        tooltip.style('opacity', 0);
        tooltip.select('.name').html("<b> Name: " + d.explicitOriginalTarget.__data__.Name + "</b>");
        tooltip.select('.level').html("<b> Level: " + d.explicitOriginalTarget.__data__.Level + "</b>");
        tooltip.select('.done').html("<b> Done: " + d.explicitOriginalTarget.__data__.Done + "</b>");
        tooltip.style('display', 'block');
        tooltip.style('opacity', 2);
        tooltip.style('background-color', 'orange');
        tooltip.style('float', 'right');
        tooltip.style('width', '25%');
        tooltip.style('margin', '5%');
      })
      .on('mouseover', function(d) {
        
        curr=d.explicitOriginalTarget.__data__
        console.log(curr)
        // increase the segment height of the one being hovered as well as all others of the same date
        // while decreasing the height of all others accordingly
        //console.log(d)
        d3.selectAll("#segment-" + curr.Name+'-'+curr.Level.replaceAll(' ','-')).attr("fill", function(p) {
          return "white"
        });  
        
      })
      .on('mousemove', function(d,event) {
        tooltip.style('top', (cy() + 10) + 'px')
          .style('left', (cx() - 25) + 'px');
      })
      .on('mouseout', function(d) {
        //console.log(d.explicitOriginalTarget.__data__.Day)
        
        //  var time = d.Time;
        //  var timeCleaned = time.split(":").join("-");
        //  var segment = d3.select("#segment-"+d.Day +"-"+timeCleaned); //designate selector variable for brevity
        //  var fillcolor = segment.select("desc").text();  //access original color from desc
        //  segment.style("fill", fillcolor);
  
        d3.selectAll("#segment-" + curr.Name+'-'+curr.Level.replaceAll(' ','-')).attr("fill", function(p)  {
          return d.target.textContent
        });
      })
      .append("desc") //append the current color as a desc element
      .text(function(d:any) {
        var color = d3.scaleLinear<string,string>().domain([0,1]).range(["white", "green"]);
        // how to access a function within reusable charts
        console.log(color(d.Done));
        return color(d.Done);
      });
  }
  
  circularHeatChart(num_of_segments:number) {
    var margin = {
        top: 20,
        right: 50,
        bottom: 50,
        left: 20
      },
      innerRadius = 20,
      numSegments = num_of_segments,
      segmentHeight = 20,
      domain:any = null,
      range = ["white", "red"],
      accessor = function(d:any) {
        return d;
      }
      var radialLabels =[];
      var segmentLabels:any[] = [];
      
      //console.log(segmentLabels)

  
    function chart(selection:any) {
      selection.each(function(this:any,data:any) {
        
        var svg = d3.select(this);
  
        var offset = innerRadius + Math.ceil(data.length / numSegments) * segmentHeight;
        var g = svg.append("g")
          .classed("circular-heat", true)
          .attr("transform", "translate(" + (margin.left + offset) + "," + (margin.top + offset) + ")");
  
        var autoDomain = false;
        if (domain === null) {
          domain = d3.extent(data, accessor);
          autoDomain = true;
        }
        var color = d3.scaleLinear<string,string>().domain(domain).range(range);
        if (autoDomain)
          domain = null;
  
        g.selectAll("path").data(data)
          .enter().append("path")
          // .attr("class","segment")
          .attr("class", function(d:any) {
            return "segment-" + d.Name
          })
          .attr("id", function(d:any) {
            return "segment-" + d.Name + "-" + d.Level.replaceAll(' ','-');
          })
          .attr("d", d3.arc<any>().innerRadius(ir).outerRadius(or).startAngle(sa).endAngle(ea))
          .attr("stroke", function(d) {
            return '#252525';
          })
          .attr("fill", function(d) {
            return color(accessor(d));
          });
  
        // Unique id so that the text path defs are unique - is there a better way to do this?
        // console.log(d3.selectAll(".circular-heat")["_groups"][0].length)
        var id = 1;
  
  
        //Segment labels
        var segmentLabelOffset = 5;
        var r = innerRadius + Math.ceil(data.length / numSegments) * segmentHeight + segmentLabelOffset;
        var labels = svg.append("g")
          .classed("labels", true)
          .classed("segment", true)
          .attr("transform", "translate(" + (margin.left + offset) + "," + (margin.top + offset) + ")");
  
        labels.append("def")
          .append("path")
          .attr("id", "segment-label-path-" + id)
          .attr("d", "m0 -" + r + " a" + r + " " + r + " 0 1 1 -1 0");
  
        labels.selectAll("text")
          .data(segmentLabels).enter()
          .append("text")
          .append("textPath")
          .attr("xlink:href", "#segment-label-path-" + id)
          .style("font-size", "12px")
          .attr("startOffset", function(d, i) {
            return i * 100 / numSegments + 1.5 + "%";
          })
          .text(function(d:any) {
            return d;
          });
      });
  
    }
  
    /* Arc functions */
    var ir = function(d:any, i:number) {
      return innerRadius + Math.floor(i / numSegments) * segmentHeight;
    }
    var or = function(d:any, i:number) {
      return innerRadius + segmentHeight + Math.floor(i / numSegments) * segmentHeight;
    }
    var sa = function(d:any, i:number) {
      return (i * 2 * Math.PI) / numSegments;
    }
    var ea = function(d:any, i:number) {
      return ((i + 1) * 2 * Math.PI) / numSegments;
    }
  
    /* Configuration getters/setters */
    chart.margin = function(_:any) {
      //if (!arguments.length) return margin;
      margin = _;
      return chart;
    };
  
    chart.innerRadius = function(_:any) {
     // if (!arguments.length) return innerRadius;
      innerRadius = _;
      return chart;
    };
  
    chart.numSegments = function(_:any) {
      //if (!arguments.length) return numSegments;
      numSegments = _;
      return chart;
    };
  
    chart.segmentHeight = function(_:any) {
     // if (!arguments.length) return segmentHeight;
      segmentHeight = _;
      return chart;
    };
  
    chart.domain = function(_:any) {
      //if (!arguments.length) return domain;
      domain = _;
      return chart;
    };
  
    chart.range = function(_:any) {
     // if (!arguments.length) return range;
      range = _;
      return chart;
    };
  
    chart.radialLabels = function(_:any) {
     // if (!arguments.length) return radialLabels;
      if (_ == null) _ = [];
      radialLabels = _;
      return chart;
    };
  
    chart.segmentLabels = function(_:any) {
     // if (!arguments.length) return segmentLabels;
      if (_ == null) _ = [];
      segmentLabels = _;
      return chart;
    };
  
    chart.accessor = function(_:any) {
      if (!arguments.length) return accessor;
      accessor = _;
      return chart;
    };
  
    return chart;
  }
  
}

import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3'
import { ymlService } from '../service/yaml-parser/yaml-parser.service';

@Component({
  selector: 'app-dependency-graph',
  templateUrl: './dependency-graph.component.html',
  styleUrls: ['./dependency-graph.component.css']
})
export class DependencyGraphComponent implements OnInit {
  SIZE_OF_NODE:number=10
  COLOR_OF_LINK:string="black"
  COLOR_OF_NODE:string="#55bc55"
  BORDER_COLOR_OF_NODE:string="black"
  simulation:any
  YamlObject:any;
  graph={
    nodes: [{
        id: "Alice"
      },
      {
        id: "Bob"
      },
      {
        id: "George"
      }
    ],
    links: [{
        source: "Alice",
        target: "George"
      },
      {
        source: "George",
        target: "Bob"
      }
    ]
  };

  @Input() dimension: string= "";
  @Input() subDimension: string= "";
  @Input() taskName: string= "";

  constructor(private yaml:ymlService) { }

  ngOnInit(): void {
    this.generateGraph()
  }

  generateGraph():void{

    let svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

    this.simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d:any) { return d.id; }))
    .force("charge", d3.forceManyBody().strength(-11215))
    .force("center", d3.forceCenter(width / 2, height / 2));

    svg.append('defs').append('marker')
        .attr('id','arrowhead')
        .attr('viewBox','-0 -5 10 10')
        .attr('refX',20)
        .attr('refY',0)
        .attr('orient','auto')
        .attr('markerWidth',13)
        .attr('markerHeight',13)
        .attr('xoverflow','visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', this.COLOR_OF_LINK)
        .style('stroke','none');

    let link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(this.graph.links)
    .enter().append("line")
    .style("stroke", this.COLOR_OF_LINK)
    .attr('marker-end','url(#arrowhead)');

    let node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("g")
    .data(this.graph.nodes)
    .enter().append("g")
      

    node.append("circle")
    .attr("r", 15)
    .attr("fill",this.COLOR_OF_NODE)

      

    node.append("text")
      .attr("dy", ".35em")
      .attr("text-anchor","middle")
      .text(function(d) { return d.id });

    this.simulation
      .nodes(this.graph.nodes)
      .on("tick", ticked);

    this.simulation.force("link")
      .links(this.graph.links);

    function ticked() {
      link
          .attr("x1", function(d:any) { return d.source.x; })
          .attr("y1", function(d:any) { return d.source.y; })
          .attr("x2", function(d:any) { return d.target.x; })
          .attr("y2", function(d:any) { return d.target.y; });

      node
          .attr("transform", function(d:any) {
            return "translate(" + d.x + "," + d.y + ")";
          })
    }
  }

}

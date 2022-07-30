import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-tree-map',
  templateUrl: './tree-map.component.html',
  styleUrls: ['./tree-map.component.css']
})
export class TreeMapComponent implements OnInit {

  treeData = {
    "name": "Eve",
    "value": 15,
    "children": [
      {
        "name": "Cain",
        "value": 10,
      },
      {
        "name": "Seth",
        "value": 10,
        "children": [
          {
            "name": "Enos",
            "value": 7.5,
          },
          {
            "name": "Noam",
            "value": 7.5,
          }
        ]
      },
      {
        "name": "Abel",
        "value": 10,
      },
      {
        "name": "Awan",
        "value": 10,
        "children": [
          {
            "name": "Enoch",
            "value": 7.5,
          }
        ]
      },
      {
        "name": "Azura",
        "value": 10,
      }
    ]
  };  
  
  constructor() { }

  ngOnInit(): void {
    this.generateTree()
  }

  generateTree():void{
    // set the dimensions and margins of the diagram
    const margin = {top: 20, right: 90, bottom: 30, left: 90},
    width  = 660 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // declares a tree layout and assigns the size
    const treemap = d3.tree().size([height, width]);

    //  assigns the data to a hierarchy using parent-child relationships
    var nodes:any = d3.hierarchy(this.treeData, (d:any) => d.children);

    // maps the node data to the tree layout
    nodes = treemap(nodes);

    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    const svg = d3.select("#tree").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom),
    g = svg.append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // adds the links between the nodes
    const link = g.selectAll(".link")
    .data( nodes.descendants().slice(1))
    .enter().append("path")
    .attr("class", "link")
    .style("stroke", "black")
    .style("fill","none")
    .attr("d", (d:any) => {
    return "M" + d.y + "," + d.x
    + "C" + (d.y + d.parent.y) / 2 + "," + d.x
    + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
    + " " + d.parent.y + "," + d.parent.x;
    });

    // adds each node as a group
    const node = g.selectAll(".node")
    .data(nodes.descendants())
    .enter().append("g")
    .attr("class", (d:any) => "node" + (d.children ? " node--internal" : " node--leaf"))
    .attr("transform", (d:any) => "translate(" + d.y + "," + d.x + ")");

    // adds the circle to the node
    node.append("circle")
    .attr("r", (d:any) => d.data.value)
    .style("stroke", "black")
    .style("fill", "green");

    // adds the text to the node
    node.append("text")
    .attr("dy", ".35em")
    .attr("x", (d:any) => d.children ? (d.data.value + 5) * -1 : d.data.value + 5)
    .attr("y", (d:any) => d.children && d.depth !== 0 ? -(d.data.value + 5) : d)
    .style("text-anchor", (d:any) => d.children ? "end" : "start")
    .text((d:any) => d.data.name);
  }


}

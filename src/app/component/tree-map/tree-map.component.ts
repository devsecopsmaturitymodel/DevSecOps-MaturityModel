import { Component, OnInit, Input } from '@angular/core';
import { ymlService } from '../../service/yaml-parser/yaml-parser.service';
import * as d3 from 'd3';

export interface TreeNode {
  name: string;
  dependsOn:TreeNode[]
}


@Component({
  selector: 'app-tree-map',
  templateUrl: './tree-map.component.html',
  styleUrls: ['./tree-map.component.css']
})

export class TreeMapComponent implements OnInit {
  SIZE_OF_NODE:number=10
  COLOR_OF_LINK:string="black"
  COLOR_OF_NODE:string="#55bc55"
  BORDER_COLOR_OF_NODE:string="black"
  TREE_DATA:TreeNode={name:"",dependsOn:[]};
  YamlObject:any;
  @Input() dimension: string= "";
  @Input() subDimension: string= "";
  @Input() taskName: string= "";

  constructor(private yaml:ymlService) { }

  ngOnInit(): void {
    this.setTreeData()
  }

  setTreeData():void{
    this.yaml.setURI('./assets/YAML/generated/generated.yaml');
    // Function sets data 
    this.yaml.getJson().subscribe((data) => {
      
      this.YamlObject = data[this.dimension][this.subDimension];
      //console.log(JSON.parse(JSON.stringify(this.TREE_DATA)));
      this.TREE_DATA=this.generateTreeNodes(this.taskName)
      //console.log(this.TREE_DATA)
      this.generateTree()
    })
    
  }

  generateTreeNodes(currentTask:string):TreeNode{
    var tempTreeNode:TreeNode={name:'',dependsOn:[]}
    tempTreeNode['name']=currentTask
    try{
      for(var i=0;i<this.YamlObject[currentTask]["dependsOn"].length;i++){
        tempTreeNode['dependsOn'].push(this.generateTreeNodes(this.YamlObject[currentTask]["dependsOn"][i]))
      }
    }
    catch{
      return tempTreeNode
    }
    //console.log(tempTreeNode)
    return tempTreeNode
  }

  generateTree():void{
    // set the dimensions and margins of the diagram
    const margin = {top: 20, right: 1250, bottom: 30, left: 90},
    width  = 2000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // declares a tree layout and assigns the size
    const treemap = d3.tree().size([height, width]);

    //  assigns the data to a hierarchy using parent-child relationships
    var nodes:any = d3.hierarchy(this.TREE_DATA, (d:any) => d.dependsOn);
    console.log(JSON.parse(JSON.stringify(this.TREE_DATA)));

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
    .style("stroke", this.COLOR_OF_LINK)
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
    .attr("class", (d:any) => "node" + (d.dependsOn ? " node--internal" : " node--leaf"))
    .attr("transform", (d:any) => "translate(" + d.y + "," + d.x + ")");

    // adds the circle to the node
    node.append("circle")
    .attr("r", this.SIZE_OF_NODE)
    .style("stroke", this.BORDER_COLOR_OF_NODE)
    .style("fill", this.COLOR_OF_NODE);

    // adds the text to the node
    node.append("text")
    .attr("dy", ".25em")
    .attr("x", "-20")
    .attr("y", "-20")
    .style("text-anchor", (d:any) => d.dependsOn ? "end" : "start")
    .text((d:any) => d.data.name);
    console.log()
  }


}

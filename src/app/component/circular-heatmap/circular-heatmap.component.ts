import { Component, OnInit } from '@angular/core';
import { ymlService } from '../../service/yaml-parser/yaml-parser.service';
import * as d3 from 'd3';
import * as yaml from "js-yaml"

export interface taskSchema{
  taskName:string
  ifTaskDone:boolean
}

export interface cardSchema{
  Name:string
  Level:string
  "Done%":number
  Task:taskSchema[]
}

@Component({
  selector: 'app-circular-heatmap',
  templateUrl: './circular-heatmap.component.html',
  styleUrls: ['./circular-heatmap.component.css']
})
export class CircularHeatmapComponent implements OnInit {
  maxLevelOfTasks:number=-1
  showTaskCard:boolean=false
  cardHeader:string=''
  cardSubheader:string=''
  tasksData:any[]=[]
  ALL_CARD_DATA:cardSchema[] =[];
  radial_labels:string[]= [];
  YamlObject:any;
  segment_labels:string[] = [];
  constructor(private yaml:ymlService) { }

  ngOnInit(): void {
    this.yaml.setURI('./assets/YAML/meta.yaml');
    // Function sets column header
    this.yaml.getJson().subscribe((data) => {
      this.YamlObject = data;

      // Levels header
      for(let x in this.YamlObject['strings']['en']['maturity_levels']){
        var y=parseInt(x)+1
        this.radial_labels.push('Level '+y)
        this.maxLevelOfTasks=y
        }      
      
    });

    this.yaml.setURI('./assets/YAML/generated/generated.yaml');
    // Function sets data 
    this.yaml.getJson().subscribe((data) => {
      //console.log(this.radial_labels)
      this.YamlObject = data;
      var allDimensionNames=Object.keys(this.YamlObject)
      //console.log(allDimensionNames)
      for(var i=0;i<allDimensionNames.length;i++){
        var allSubDimensionInThisDimension=Object.keys(this.YamlObject[allDimensionNames[i]])
        for(var j=0;j<allSubDimensionInThisDimension.length;j++){
          this.segment_labels.push(allSubDimensionInThisDimension[j]) 
        }
      }
      //console.log(this.segment_labels)
      for(var l=0 ; l<this.maxLevelOfTasks; l++){
        var allDimensionNames=Object.keys(this.YamlObject)
        for(var i=0;i<allDimensionNames.length;i++){
          var allSubDimensionInThisDimension=Object.keys(this.YamlObject[allDimensionNames[i]])
          for(var j=0;j<allSubDimensionInThisDimension.length;j++){
            var allTaskInThisSubDimension=Object.keys(this.YamlObject[allDimensionNames[i]][allSubDimensionInThisDimension[j]])
            var tempData:cardSchema={
              "Name": "",
              "Level": "",
              "Done%":-1,
              "Task":[]
            }
            var totalImplemented:number=0
            var totalTasks:number=0
            tempData["Name"]=allSubDimensionInThisDimension[j]
            tempData["Level"]="Level "+(l+1) 
            for(var k=0;k<allTaskInThisSubDimension.length;k++){
              try{
                var lvlOfCurrentTask=this.YamlObject[allDimensionNames[i]][allSubDimensionInThisDimension[j]][allTaskInThisSubDimension[k]]["level"]
                if (lvlOfCurrentTask==l+1){
                  totalTasks+=1
                  var nameOfTask:string=allTaskInThisSubDimension[k]
                  var Status:boolean=this.YamlObject[allDimensionNames[i]][allSubDimensionInThisDimension[j]][allTaskInThisSubDimension[k]]['isImplemented']
                  if(Status){
                    totalImplemented+=1
                  }
                  tempData["Task"].push({"taskName":nameOfTask,"ifTaskDone":Status})
                }
                if(totalTasks>0){
                  tempData["Done%"]=totalImplemented/totalTasks
                }
              }
              catch{
                console.log("level for task does not exist")
              }
            }
            this.ALL_CARD_DATA.push(tempData)
          }
        }
      }
      console.log(this.ALL_CARD_DATA)
      this.loadCircularHeatMap(this.ALL_CARD_DATA, "#chart", this.radial_labels, this.segment_labels);
      this.noTasktoGrey()
    })
  }

  toggleCheckbox(taskIndex:number){
    //console.log('fo')
    let _self=this
    var index=0;
    var cnt=0;
    for(var i=0;i<this.ALL_CARD_DATA.length;i++){
      if(this.ALL_CARD_DATA[i]["Name"]===this.cardHeader&&this.ALL_CARD_DATA[i]["Level"]===this.cardSubheader){
        index=i
        break;
      }
    }
    if(this.ALL_CARD_DATA[index]["Task"][taskIndex]["ifTaskDone"]){
      this.ALL_CARD_DATA[index]["Task"][taskIndex]["ifTaskDone"]=false
    }
    else{
      this.ALL_CARD_DATA[index]["Task"][taskIndex]["ifTaskDone"]=true
    }
    //console.log(this.data[i]["Task"][taskIndex]["done"])
    for(var i=0;i< this.ALL_CARD_DATA[index]["Task"].length;i++){
      console.log(this.ALL_CARD_DATA[index]["Task"][i]["ifTaskDone"])
      if(this.ALL_CARD_DATA[index]["Task"][i]["ifTaskDone"]){
        cnt+=1
      } 
    }
    var allDimensionNames=Object.keys(this.YamlObject)
    for(var i=0; i<allDimensionNames.length;i++){
      var allSubDimensionInThisDimension=Object.keys(this.YamlObject[allDimensionNames[i]])
      for(var j=0;j<allSubDimensionInThisDimension.length;j++){
        if(allSubDimensionInThisDimension[j]==this.cardHeader){
          var taskName= this.ALL_CARD_DATA[index]["Task"][taskIndex]["taskName"]
          //console.log(taskName)
          this.YamlObject[allDimensionNames[i]][allSubDimensionInThisDimension[j]][taskName]["isImplemented"]=this.ALL_CARD_DATA[index]["Task"][taskIndex]["ifTaskDone"]
          break
        }
      }
    }
    this.ALL_CARD_DATA[index]['Done%']=cnt/this.ALL_CARD_DATA[index]["Task"].length
    //console.log(this.data[index]['Done%'],cnt)
    var color = d3.scaleLinear<string,string>().domain([0,1]).range(["white", "green"]);
    
    this.loadCircularHeatMap(this.ALL_CARD_DATA, "#chart", this.radial_labels, this.segment_labels);
    d3.selectAll("#segment-" + this.ALL_CARD_DATA[index]["Name"].replace(/ /g, "-") +'-'+this.ALL_CARD_DATA[index]["Level"].replace(' ','-')).attr("fill", function(p) {
      return color(_self.ALL_CARD_DATA[index]["Done%"])
    });
    
  }

  SaveEditedYAMLfile() {
      console.log(this.YamlObject)
      let yamlStr = yaml.dump(this.YamlObject);
      let file = new Blob([yamlStr], { type: 'text/csv;charset=utf-8' });
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(file);
      link.download = 'generated.yaml'
      link.click(); 
      link.remove();
  }

  loadCircularHeatMap(dataset:any, dom_element_to_append_to:string, radial_labels:string[], segment_labels:string[]) {
    //console.log(segment_labels)
    //d3.select(dom_element_to_append_to).selectAll('svg').exit()
    //console.log(dataset)
    let _self=this
    var margin = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50
    };
    var width = 1250 - margin.left - margin.right;
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
      return d["Done%"];
    })
    //d3.select("svg").remove(); 
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
        _self.cardSubheader=d.explicitOriginalTarget.__data__.Level
        _self.tasksData=d.explicitOriginalTarget.__data__.Task;
        _self.cardHeader=d.explicitOriginalTarget.__data__.Name
        _self.showTaskCard=true
        //console.log(_self.tasksData)
      })
      .on('mouseover', function(d) {
        console.log(d.explicitOriginalTarget)
        curr=d.explicitOriginalTarget.__data__
        //console.log(curr)
        // increase the segment height of the one being hovered as well as all others of the same date
        // while decreasing the height of all others accordingly
        //console.log(d)
        if(curr["Done%"]!=-1){
          d3.selectAll("#segment-" + curr.Name.replace(/ /g, "-")+'-'+curr.Level.replaceAll(' ','-')).attr("fill","yellow")
        };  
        
      })

      .on('mouseout', function(d) {
        //console.log(d.explicitOriginalTarget.__data__.Day)
        
        //  var time = d.Time;
        //  var timeCleaned = time.split(":").join("-");
        //  var segment = d3.select("#segment-"+d.Day +"-"+timeCleaned); //designate selector variable for brevity
        //  var fillcolor = segment.select("desc").text();  //access original color from desc
        //  segment.style("fill", fillcolor);
        if(curr["Done%"]!=-1){
          d3.selectAll("#segment-" + curr.Name.replace(/ /g, "-")+'-'+curr.Level.replaceAll(' ','-')).attr("fill", function(p)  {
            var color = d3.scaleLinear<string,string>().domain([0,1]).range(["white", "green"]);
          // how to access a function within reusable charts
          //console.log(color(d.Done));
            return color(curr["Done%"]);
          });
        }
        else{
          d3.selectAll("#segment-" + curr.Name.replace(/ /g, "-")+'-'+curr.Level.replaceAll(' ','-')).attr("fill", "#DCDCDC");
        }
      })
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
            return "segment-" + d.Name.replace(/ /g, "-")
          })
          .attr("id", function(d:any) {
            return "segment-" + d.Name.replace(/ /g, "-") + "-" + d.Level.replaceAll(' ','-');
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
            return i * 100 / numSegments+0.1+ "%";
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

  noTasktoGrey():void{
    console.log(this.ALL_CARD_DATA)
    for (var x=0;x<this.ALL_CARD_DATA.length;x++){ 
      if (this.ALL_CARD_DATA[x]["Done%"]==-1){
        console.log(this.ALL_CARD_DATA[x]["Name"])
        console.log(this.ALL_CARD_DATA[x]["Level"])
        d3.selectAll("#segment-" + this.ALL_CARD_DATA[x]["Name"].replace(/ /g, "-")+'-'+this.ALL_CARD_DATA[x]["Level"].replace(' ','-')).attr("fill","#DCDCDC");
      }
    }
  }  
}

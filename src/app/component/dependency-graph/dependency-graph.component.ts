import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
import { ymlService } from 'src/app/service/yaml-parser/yaml-parser.service';

export interface graphNodes {
  id: string;
}

export interface graphLinks {
  source: string;
  target: string;
}

export interface graph {
  nodes: graphNodes[];
  links: graphLinks[];
}

@Component({
  selector: 'app-dependency-graph',
  templateUrl: './dependency-graph.component.html',
  styleUrls: ['./dependency-graph.component.css'],
})
export class DependencyGraphComponent implements OnInit {
  SIZE_OF_NODE: number = 10;
  COLOR_OF_LINK: string = 'black';
  COLOR_OF_NODE: string = '#55bc55';
  BORDER_COLOR_OF_NODE: string = 'black';
  simulation: any;
  YamlObject: any;
  graphData: graph = { nodes: [], links: [] };
  visited: string[] = [];

  @Input() dimension: string = '';
  @Input() subDimension: string = '';
  @Input() activityName: string = '';

  constructor(private yaml: ymlService) {}

  ngOnInit(): void {
    this.yaml.setURI('./assets/YAML/generated/generated.yaml');
    // Function sets data
    this.yaml.getJson().subscribe(data => {
      this.graphData = { nodes: [], links: [] };
      this.YamlObject = data[this.dimension][this.subDimension];
      this.populateGraphWithActivitiesCurrentActivityDependsOn(
        this.activityName
      );
      this.populateGraphWithActivitiesThatDependsOnCurrentActivity(
        this.activityName
      );
      //console.log({...this.graphData['nodes']})

      console.log({ ...this.graphData });
      this.generateGraph(this.activityName);
    });
  }

  populateGraphWithActivitiesCurrentActivityDependsOn(activity: string): void {
    this.checkIfNodeHasBeenGenerated(activity);
    try {
      var activitysThatCurrenActivityIsDependentOn =
        this.YamlObject[activity]['dependsOn'];
      if (activitysThatCurrenActivityIsDependentOn) {
        for (
          var j = 0;
          j < activitysThatCurrenActivityIsDependentOn.length;
          j++
        ) {
          this.checkIfNodeHasBeenGenerated(
            activitysThatCurrenActivityIsDependentOn[j]
          );
          this.graphData['links'].push({
            source: activitysThatCurrenActivityIsDependentOn[j],
            target: activity,
          });
          this.populateGraphWithActivitiesCurrentActivityDependsOn(
            activitysThatCurrenActivityIsDependentOn[j]
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
    //console.log({...this.graphData['nodes']})
  }
  populateGraphWithActivitiesThatDependsOnCurrentActivity(activity: string) {
    var allActivitys = Object.keys(this.YamlObject);
    for (var i = 0; i < allActivitys.length; i++) {
      try {
        if (this.YamlObject[allActivitys[i]]['dependsOn'].includes(activity)) {
          this.checkIfNodeHasBeenGenerated(allActivitys[i]);
          this.graphData['links'].push({
            source: activity,
            target: allActivitys[i],
          });
        }
      } catch {
        continue;
      }
    }
  }

  checkIfNodeHasBeenGenerated(activity: string) {
    if (!this.visited.includes(activity)) {
      this.graphData['nodes'].push({ id: activity });
      this.visited.push(activity);
    }
  }

  generateGraph(activity: string): void {
    let svg = d3.select('svg'),
      width = +svg.attr('width'),
      height = +svg.attr('height');

    this.simulation = d3
      .forceSimulation()
      .force(
        'link',
        d3.forceLink().id(function (d: any) {
          return d.id;
        })
      )
      .force('charge', d3.forceManyBody().strength(-12000))
      .force('center', d3.forceCenter(width / 2, height / 2));

    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 18)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 13)
      .attr('markerHeight', 13)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', this.COLOR_OF_LINK)
      .style('stroke', 'none');

    let link = svg
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this.graphData['links'])
      .enter()
      .append('line')
      .style('stroke', this.COLOR_OF_LINK)
      .attr('marker-end', 'url(#arrowhead)');

    let node = svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(this.graphData['nodes'])
      .enter()
      .append('g');

    var defaultNodeColor = this.COLOR_OF_NODE;
    node
      .append('circle')
      .attr('r', 10)
      .attr('fill', function (d) {
        if (d.id == activity) return 'yellow';
        else return defaultNodeColor;
      });

    node
      .append('text')
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .text(function (d) {
        return d.id;
      });

    this.simulation.nodes(this.graphData['nodes']).on('tick', ticked);

    this.simulation.force('link').links(this.graphData['links']);

    function ticked() {
      link
        .attr('x1', function (d: any) {
          return d.source.x;
        })
        .attr('y1', function (d: any) {
          return d.source.y;
        })
        .attr('x2', function (d: any) {
          return d.target.x;
        })
        .attr('y2', function (d: any) {
          return d.target.y;
        });

      node.attr('transform', function (d: any) {
        return 'translate(' + d.x + ',' + d.y + ')';
      });
    }
  }
}

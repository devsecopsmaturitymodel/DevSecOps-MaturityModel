import { Component, OnInit, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { LoaderService } from '../../service/loader/data-loader.service';
import { Activity } from 'src/app/model/activity-store';
import { DataStore } from 'src/app/model/data-store';

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
  dataStore: Partial<DataStore> = {};
  graphData: graph = { nodes: [], links: [] };
  visited: Set<string> = new Set();

  @Input() activityName: string = '';

  constructor(private loader: LoaderService) {}

  ngOnInit(): void {
    this.loader.load().then((dataStore: DataStore) => {
      this.dataStore = this.dataStore;
      if (!dataStore.activityStore) {
        throw Error('No activity store loaded');
      }
      let activity: Activity = dataStore.activityStore.getActivityByName(this.activityName);
      if (activity) {
        this.graphData = { nodes: [], links: [] };
        this.populateGraphWithActivitiesCurrentActivityDependsOn(activity);
        this.populateGraphWithActivitiesThatDependsOnCurrentActivity(activity);

        this.generateGraph(this.activityName);
      }
    });
  }

  populateGraphWithActivitiesCurrentActivityDependsOn(activity: Activity): void {
    this.addNode(activity.name);
    if (activity.dependsOn) {
      for (const prececcor of activity.dependsOn) {
        this.addNode(prececcor);
        this.graphData['links'].push({
          source: prececcor,
          target: activity.name,
        });
      }
    }
  }

  populateGraphWithActivitiesThatDependsOnCurrentActivity(currentActivity: Activity) {
    const all: Activity[] = this.dataStore.activityStore?.getAllActivities?.() ?? [];
    for (const activity of all) {
      if (activity.dependsOn?.includes(currentActivity.name)) {
        this.addNode(activity.name);
        this.graphData['links'].push({
          source: currentActivity.name,
          target: activity.name,
        });
      }
    }
  }

  addNode(activityName: string) {
    if (!this.visited.has(activityName)) {
      this.graphData['nodes'].push({ id: activityName });
      this.visited.add(activityName);
    }
  }

  generateGraph(activityName: string): void {
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

    /* eslint-disable */
    let node = svg
    .append('g')
    .attr('class', 'nodes')
    .selectAll('g')
    .data(this.graphData['nodes'])
    .enter()
    .append('g');
    /* eslint-enable */

    var defaultNodeColor = this.COLOR_OF_NODE;
    node
      .append('circle')
      .attr('r', 10)
      .attr('fill', function (d) {
        if (d.id == activityName) return 'yellow';
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

import { Component, OnInit, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { LoaderService } from '../../service/loader/data-loader.service';
import { Activity } from 'src/app/model/activity-store';
import { DataStore } from 'src/app/model/data-store';

export interface graphNodes {
  id: string;
  relativeLevel: number;
  relativeCount: number;
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
  COLOR_OF_LINK: string = 'black';
  COLOR_OF_NODE: string = '#66bb6a';
  COLOR_OF_PREDECESSOR: string = '#deeedeff';
  COLOR_OF_SUCCESSOR: string = '#fdfdfdff';
  BORDER_COLOR_OF_NODE: string = 'black';
  simulation: any;
  dataStore: Partial<DataStore> = {};
  graphData: graph = { nodes: [], links: [] };
  visited: Set<string> = new Set();

  @Input() activityName: string = '';

  constructor(private loader: LoaderService) {}

  ngOnInit(): void {
    this.loader.load().then((dataStore: DataStore) => {
      this.dataStore = dataStore;
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
      let i: number = 1;
      for (const prececcor of activity.dependsOn) {
        this.addNode(prececcor, -1, i++);
        this.graphData['links'].push({
          source: prececcor,
          target: activity.name,
        });
      }
    }
  }

  populateGraphWithActivitiesThatDependsOnCurrentActivity(currentActivity: Activity) {
    const all: Activity[] = this.dataStore.activityStore?.getAllActivities?.() ?? [];
    let i: number = 1;
    for (const activity of all) {
      if (activity.dependsOn?.includes(currentActivity.name)) {
        this.addNode(activity.name, 1, i++);
        this.graphData['links'].push({
          source: currentActivity.name,
          target: activity.name,
        });
      }
    }
  }

  addNode(activityName: string, relativeLevel: number = 0, relativeCount: number = 0): void {
    if (!this.visited.has(activityName)) {
      this.graphData['nodes'].push({ id: activityName, relativeLevel, relativeCount });
      this.visited.add(activityName);
    }
  }

  generateGraph(activityName: string): void {
    let svg = d3.select('svg');


    // Now that rectWidth is set on each node, set up the simulation
    this.simulation = d3
      .forceSimulation()
      .force('link', d3.forceLink().id(function (d: any) {
          return d.id;
      }).strength(0.1))
      .force('x', d3.forceX((d: any) => {
        let col: number = 7;        
        return d.relativeLevel * Math.ceil(d.relativeCount / col)  * 300;
      }).strength(5))
      // .force('y', d3.forceY((d: any) => {
      //   return d.relativeLevel * 30;
      // }).strength(10))
      .force('charge', d3.forceManyBody().strength(-80))
      .force('collide', d3.forceCollide((d: any) => 30))
      .force('center', d3.forceCenter(0, 0));

    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 0)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 13)
      .attr('markerHeight', 13)
      .attr('overflow', 'visible')
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



    const rectHeight = 30;
    const rectRx = 10;
    const rectRy = 10;
    const padding = 20;

    // Append text first so we can measure it
    node.append('text')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text(function (d) { return d.id; });

    // Now for each node, measure the text and insert a rect behind it
    const self = this;
    node.each(function(this: SVGGElement, d: any) {
      const textElem = d3.select(this).select('text').node() as SVGTextElement;
      let textWidth = 60; // fallback default
      if (textElem && textElem.getBBox) {
        textWidth = textElem.getBBox().width;
      }
      const rectWidth = textWidth + padding;
      d.rectWidth = rectWidth; // Store for collision force
      // Insert rect before text
      d3.select(this)
        .insert('rect', 'text')
        .attr('x', -rectWidth / 2)
        .attr('y', -rectHeight / 2)
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('rx', rectRx)
        .attr('ry', rectRy)
        .attr('fill', (d: any) => {
          if (d.relativeLevel == 0) return self.COLOR_OF_NODE;
          return d.relativeLevel < 0 ? self.COLOR_OF_PREDECESSOR : self.COLOR_OF_SUCCESSOR;
        })
        .attr('stroke', self.BORDER_COLOR_OF_NODE)
        .attr('stroke-width', 1.5);
    });

    this.simulation.nodes(this.graphData['nodes']).on('tick',() => {
      self.rectCollide(this.graphData['nodes']);
      ticked();
    });

    this.simulation.force('link').links(this.graphData['links']);

    function ticked() {


      // Improved rectangle edge intersection for arrowhead placement
      function rectEdgeIntersection(sx: number, sy: number, tx: number, ty: number, rectWidth: number, rectHeight: number, offset: number = 0) {
        // Rectangle centered at (tx, ty)
        const dx = tx - sx;
        const dy = ty - sy;
        const w = rectWidth / 2;
        const h = rectHeight / 2;
        // Parametric line: (sx, sy) + t*(dx, dy), t in [0,1]
        // Find smallest t in (0,1] where line crosses rectangle edge
        let tMin = 1;
        // Left/right sides
        if (dx !== 0) {
          let t1 = (w - (sx - tx)) / dx;
          let y1 = sy + t1 * dy;
          if (t1 > 0 && Math.abs(y1 - ty) <= h) tMin = Math.min(tMin, t1);
          let t2 = (-w - (sx - tx)) / dx;
          let y2 = sy + t2 * dy;
          if (t2 > 0 && Math.abs(y2 - ty) <= h) tMin = Math.min(tMin, t2);
        }
        // Top/bottom sides
        if (dy !== 0) {
          let t3 = (h - (sy - ty)) / dy;
          let x3 = sx + t3 * dx;
          if (t3 > 0 && Math.abs(x3 - tx) <= w) tMin = Math.min(tMin, t3);
          let t4 = (-h - (sy - ty)) / dy;
          let x4 = sx + t4 * dx;
          if (t4 > 0 && Math.abs(x4 - tx) <= w) tMin = Math.min(tMin, t4);
        }
        // Clamp tMin to [0,1]
        tMin = Math.max(0, Math.min(1, tMin));
        // Move intersection back by 'offset' pixels along the direction from target to source
        let px = sx + dx * tMin;
        let py = sy + dy * tMin;
        if (offset > 0 && (dx !== 0 || dy !== 0)) {
          const len = Math.sqrt(dx * dx + dy * dy);
          px -= (dx / len) * offset;
          py -= (dy / len) * offset;
        }
        return { x: px, y: py };
      }

      link
        .attr('x1', function (d: any) {
          return d.source.x;
        })
        .attr('y1', function (d: any) {
          return d.source.y;
        })
        .attr('x2', function (d: any) {
          // If target has rectWidth, adjust arrow to edge minus offset
          if (d.target.rectWidth) {
            const pt = rectEdgeIntersection(
              d.source.x, d.source.y,
              d.target.x, d.target.y,
              d.target.rectWidth, 30, 10 // rectHeight, offset
            );
            return pt.x;
          }
          return d.target.x;
        })
        .attr('y2', function (d: any) {
          if (d.target.rectWidth) {
            const pt = rectEdgeIntersection(
              d.source.x, d.source.y,
              d.target.x, d.target.y,
              d.target.rectWidth, 30, 10
            );
            return pt.y;
          }
          return d.target.y;
        });

      node.attr('transform', function (d: any) {
        return 'translate(' + d.x + ',' + d.y + ')';
      });
    }
  }

  /**
   * Custom rectangular collision force for D3 simulation.
   * Pushes nodes apart if their rectangles (boxes) overlap.
   * Assumes each node has .x, .y, and .rectWidth properties.
   * Uses a fixed rectHeight of 30 (half = 15).
   * @param nodes Array of node objects
   */
  rectCollide(nodes: any[]) {
    // Loop through all pairs of nodes
    let node, nx1, nx2, ny1, ny2, other, ox1, ox2, oy1, oy2, i, n = nodes.length;
    for (i = 0; i < n; ++i) {
      node = nodes[i];
      // Calculate bounding box for node
      nx1 = node.x - node.rectWidth / 2;
      nx2 = node.x + node.rectWidth / 2;
      ny1 = node.y - 15; // rectHeight / 2
      ny2 = node.y + 15;
      for (let j = i + 1; j < n; ++j) {
        other = nodes[j];
        // Calculate bounding box for other node
        ox1 = other.x - other.rectWidth / 2;
        ox2 = other.x + other.rectWidth / 2;
        oy1 = other.y - 15;
        oy2 = other.y + 15;
        // Check for overlap between rectangles
        if (nx1 < ox2 && nx2 > ox1 && ny1 < oy2 && ny2 > oy1) {
          // Overlap detected, push nodes apart along the direction between them
          let dx = (node.x - other.x) || (Math.random() - 0.5);
          let dy = (node.y - other.y) || (Math.random() - 0.5);
          let l = Math.sqrt(dx * dx + dy * dy);
          let moveX = dx / l || 1;
          let moveY = dy / l || 1;
          node.x += moveX;
          node.y += moveY;
          other.x -= moveX;
          other.y -= moveY;
        }
      }
    }
  }
}


import { Component, OnInit, Input, ElementRef, SimpleChanges, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import { LoaderService } from '../../service/loader/data-loader.service';
import { Activity } from 'src/app/model/activity-store';
import { DataStore } from 'src/app/model/data-store';
import { ThemeService } from 'src/app/service/theme.service';

import { Output, EventEmitter } from '@angular/core';

export interface graphNodes {
  id: string;
  relativeLevel: number;
  activityIndex: number;
  activityCount: number;
}

export interface graphLinks {
  source: string;
  target: string;
}

export interface graph {
  nodes: graphNodes[];
  links: graphLinks[];
}

interface ThemeColors {
  linkColor: string;
  borderColor: string;
  mainNodeColor: string;
  mainNodeFill: string;
  predecessorFill: string;
  successorFill: string;
}

@Component({
  selector: 'app-dependency-graph',
  templateUrl: './dependency-graph.component.html',
  styleUrls: ['./dependency-graph.component.css'],
})
export class DependencyGraphComponent implements OnInit, OnChanges {
  css: CSSStyleDeclaration = getComputedStyle(document.body);
  themeColors: Partial<ThemeColors> = {};
  theme: string;
  simulation: any;
  dataStore: Partial<DataStore> = {};
  graphData: graph = { nodes: [], links: [] };
  visited: Set<string> = new Set();

  @Input() activityName: string = '';

  @Output() activityClicked = new EventEmitter<string>();

  constructor(private loader: LoaderService, private themeService: ThemeService) {
    this.theme = this.themeService.getTheme();
    this.setThemeColors(this.theme);
  }

  ngOnInit(): void {
    this.loader.load().then((dataStore: DataStore) => {
      this.dataStore = dataStore;
      if (!dataStore.activityStore) {
        throw Error('No activity store loaded');
      }
      this.populateGraph(this.activityName);
    });

    // Reactively handle theme changes (if user toggles later)
    this.themeService.theme$.subscribe((theme: string) => {
      this.setThemeColors(theme);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dataStore?.activityStore) {
      if (changes?.hasOwnProperty('activityName')) {
        this.populateGraph(changes['activityName'].currentValue);
      }
    }
  }

  setThemeColors(theme: string) {
    /* eslint-disable */
      this.themeColors.mainNodeFill = this.css.getPropertyValue('--heatmap-filled').trim();
      this.themeColors.mainNodeColor = this.css.getPropertyValue('--text-primary').trim();
      this.themeColors.linkColor = this.css.getPropertyValue('--dependency-link').trim();
      this.themeColors.borderColor = this.css.getPropertyValue('--dependency-border').trim();
      this.themeColors.predecessorFill = this.css.getPropertyValue('--dependency-predecessor-fill').trim();
      this.themeColors.successorFill = this.css.getPropertyValue('--dependency-successor-fill').trim();
      /*eslint-enable */

    this.generateGraph();
  }

  populateGraph(activityName: string): void {
    if (this.simulation) {
      this.simulation.stop();
    }
    this.visited.clear();
    let activity: Activity | undefined =
      this.dataStore?.activityStore?.getActivityByName(activityName);
    if (activity) {
      this.graphData = { nodes: [], links: [] };
      this.addNode(activity.name);
      this.populateGraphWithActivitiesCurrentActivityDependsOn(activity);
      this.populateGraphWithActivitiesThatDependsOnCurrentActivity(activity);

      this.generateGraph();
    }
  }

  populateGraphWithActivitiesCurrentActivityDependsOn(activity: Activity): void {
    if (activity.dependsOn) {
      let i: number = 1;
      for (const predecessor of activity.dependsOn) {
        this.addNode(predecessor, -1, i++);
        this.graphData['links'].push({
          source: predecessor,
          target: activity.name,
        });
      }
      this.graphData['nodes']
        .filter(node => node.relativeLevel == -1)
        .forEach(node => {
          node.activityCount = i - 1;
        });
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
    this.graphData['nodes']
      .filter(node => node.relativeLevel == 1)
      .forEach(node => {
        node.activityCount = i - 1;
      });
  }

  addNode(activityName: string, relativeLevel: number = 0, activityIndex: number = 0): void {
    if (!this.visited.has(activityName)) {
      let d: any = {
        id: activityName,
        relativeLevel,
        activityIndex,
      };
      this.graphData['nodes'].push(d);
      this.visited.add(activityName);
    }
  }

  initX(d: any): number {
    let colSize: number = 8;
    if (d.activityCount > colSize && d.activityCount <= colSize * 2.5) {
      let colCount: number = Math.ceil(d.activityCount / colSize);
      colSize = Math.ceil(d.activityCount / colCount);
    }
    return d.relativeLevel * Math.ceil(d.activityIndex / colSize) * 300;
  }
  initY(d: any): number {
    return d.relativeLevel * 30;
  }

  generateGraph(): void {
    let svg = d3.select('svg.dependency-graph');
    svg.selectAll('*').remove();

    // Now that rectWidth is set on each node, set up the simulation
    /* eslint-disable */
    this.simulation = d3
      .forceSimulation()
      // .alphaMin(0.11)
      .force('link', d3.forceLink().id((d: any) => { return d.id; }).strength(0.1))
      .force('x', d3.forceX((d: any) => { return self.initX(d) }).strength(5))
      .force('charge', d3.forceManyBody().strength(-30))
      .force('collide', d3.forceCollide((d: any) => 30))
      .force('center', d3.forceCenter(0, 0));
    /* eslint-enable */

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
      .attr('fill', this.themeColors.linkColor || 'black')
      .style('stroke', 'none');

    let links = svg
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this.graphData['links'])
      .enter()
      .append('line')
      .style('stroke', this.themeColors.linkColor || 'black')
      .attr('marker-end', 'url(#arrowhead)');

    let nodes = svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(this.graphData['nodes'])
      .enter()
      .append('g')
      .on('click', (event: MouseEvent, d: any) => {
        if (d.relativeLevel != 0) {
          this.activityClicked.emit(d.id);
        }
      })
      .classed('clickable', (d: any) => this.activityClicked.observed && d.relativeLevel != 0)
      .classed('predecessor', (d: any) => d.relativeLevel < 0)
      .classed('successor', (d: any) => d.relativeLevel > 0)
      .classed('main', (d: any) => d.relativeLevel == 0)
      .style('cursor', (d: any) =>
        this.activityClicked.observed && d.relativeLevel != 0 ? 'pointer' : 'default'
      )
      .on('mouseover', function (_event: any, _d: any) {
        if (d3.select(this).classed('clickable')) {
          d3.select(this).classed('hovered', true);
        }
      })
      .on('mouseout', function (_event: any, _d: any) {
        d3.select(this).classed('hovered', false);
      });

    const rectHeight = 30;
    const rectRx = 10;
    const rectRy = 10;
    const padding = 20;

    // Append text first so we can measure it
    nodes
      .append('text')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text(function (d) {
        return d.id;
      });

    // Now for each node, measure the text and insert a rect behind it
    const self = this;
    nodes.each(function (this: SVGGElement, d: any) {
      const textElem = d3.select(this).select('text').node() as SVGTextElement;
      let textWidth = 60;
      if (textElem) {
        try {
          textWidth = (textElem.getBBox && textElem.getBBox().width) || textWidth;
        } catch {
          textWidth =
            (textElem.getComputedTextLength && textElem.getComputedTextLength()) || textWidth;
        }
      }

      const rectWidth = Math.ceil(textWidth + padding);
      d.rectWidth = rectWidth; // store for collision force

      // compute fill + hover color once
      const fillColor =
        d.relativeLevel == 0
          ? self.themeColors.mainNodeFill || 'green'
          : (d.relativeLevel < 0
              ? self.themeColors.predecessorFill
              : self.themeColors.successorFill) || 'white';
      const c = d3.color(fillColor);
      const hoverColor = c ? c.darker(0.6).toString() : fillColor;

      // set CSS variables on the group so global stylesheet can use them
      d3.select(this)
        .style('--node-fill', fillColor)
        .style('--node-hover-fill', hoverColor)
        .style('--node-border', self.themeColors.borderColor || 'black');

      // Insert rect before text sized to measured text
      d3.select(this)
        .insert('rect', 'text')
        .attr('class', 'node-rect')
        .attr('x', -rectWidth / 2)
        .attr('y', -rectHeight / 2)
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('rx', rectRx)
        .attr('ry', rectRy)
        .attr('stroke-width', 1.5)
        .attr('stroke', 'currentColor'); // stroke taken from --node-border via CSS
    });

    this.simulation.nodes(this.graphData['nodes']).on('tick', () => {
      self.rectCollide(this.graphData['nodes']);
      ticked();
    });

    this.simulation.force('link').links(this.graphData['links']);

    function ticked() {
      // Improved rectangle edge intersection for arrowhead placement
      links
        .attr('x1', function (d: any) {
          return d.source.x;
        })
        .attr('y1', function (d: any) {
          return d.source.y;
        })
        .attr('x2', function (d: any) {
          // If target has rectWidth, adjust arrow to edge minus offset
          if (d.target.rectWidth) {
            const pt = self.rectEdgeIntersection(
              d.source.x,
              d.source.y,
              d.target.x,
              d.target.y,
              d.target.rectWidth,
              30,
              10 // rectHeight, offset
            );
            return pt.x;
          }
          return d.target.x;
        })
        .attr('y2', function (d: any) {
          if (d.target.rectWidth) {
            const pt = self.rectEdgeIntersection(
              d.source.x,
              d.source.y,
              d.target.x,
              d.target.y,
              d.target.rectWidth,
              30,
              10
            );
            return pt.y;
          }
          return d.target.y;
        });

      nodes.attr('transform', function (d: any) {
        return 'translate(' + d.x + ',' + d.y + ')';
      });
    }
  }

  rectEdgeIntersection(
    sx: number,
    sy: number,
    tx: number,
    ty: number,
    rectWidth: number,
    rectHeight: number,
    offset: number = 0
  ) {
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

  /**
   * Custom rectangular collision force for D3 simulation.
   * Pushes nodes apart if their rectangles (boxes) overlap.
   * Assumes each node has .x, .y, and .rectWidth properties.
   * Uses a fixed rectHeight of 30 (half = 15).
   * @param nodes Array of node objects
   */
  rectCollide(nodes: any[]) {
    // Loop through all pairs of nodes
    let node,
      nx1,
      nx2,
      ny1,
      ny2,
      other,
      ox1,
      ox2,
      oy1,
      oy2,
      i,
      n = nodes.length;
    for (i = 0; i < n; ++i) {
      node = nodes[i];
      // Calculate bounding box for node
      nx1 = node.x - node.rectWidth / 2 - 25;
      nx2 = node.x + node.rectWidth / 2 + 25;
      ny1 = node.y - 25;
      ny2 = node.y + 25;
      for (let j = i + 1; j < n; ++j) {
        other = nodes[j];
        // Calculate bounding box for other node
        ox1 = other.x - other.rectWidth / 2;
        ox2 = other.x + other.rectWidth / 2;
        oy1 = other.y - 25;
        oy2 = other.y + 25;
        // Check for overlap between rectangles
        if (nx1 < ox2 && nx2 > ox1 && ny1 < oy2 && ny2 > oy1) {
          // Overlap detected, push nodes apart along the direction between them
          let dx = node.x - other.x || Math.random() - 0.5;
          let dy = node.y - other.y || Math.random() - 0.5;
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

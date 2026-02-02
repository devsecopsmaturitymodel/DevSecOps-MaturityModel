import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { Sector } from '../model/sector';

export interface HeatmapColors {
  background: string;
  filled: string;
  disabled: string;
  cursor: string;
  stroke: string;
}

export interface HeatmapConfig {
  imageWidth: number;
  margin: number;
  maxLevel: number;
  dimLabels: string[];
  colors: HeatmapColors;
}

@Injectable({
  providedIn: 'root',
})
export class D3HeatmapService {
  private svg: d3.Selection<SVGGElement, any, HTMLElement, any> | null = null;
  private config!: HeatmapConfig;
  private segmentHeight!: number;
  private innerRadius!: number;
  private segmentLabelHeight!: number;
  private outerRadius!: number;
  private colorScale!: d3.ScaleLinear<string, string>;

  public initialize(
    domElement: string,
    config: HeatmapConfig,
    sectorProgressFn: (sector: Sector) => number
  ): void {
    this.config = config;
    const { imageWidth, margin: marginAll, maxLevel, dimLabels } = config;

    const margin = {
      top: marginAll,
      right: marginAll,
      bottom: marginAll,
      left: marginAll,
    };

    const bbWidth =
      imageWidth - Math.max(margin.left + margin.right, margin.top + margin.bottom) * 2;
    this.segmentLabelHeight = bbWidth * 0.0166;
    this.outerRadius = bbWidth / 2 - this.segmentLabelHeight;
    this.innerRadius = this.outerRadius / (maxLevel + 1);
    this.segmentHeight = (this.outerRadius - this.innerRadius) / maxLevel;

    this.colorScale = d3
      .scaleLinear<string, string>()
      .domain([0, 1])
      .range([config.colors.background, config.colors.filled]);

    this.svg = d3
      .select(domElement)
      .selectAll('svg')
      .data([null])
      .enter()
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${imageWidth} ${imageWidth}`)
      .append('g')
      .attr(
        'transform',
        `translate(${margin.left + this.segmentLabelHeight}, ${
          margin.top + this.segmentLabelHeight
        })`
      ) as any;
  }

  public render(
    dataset: Sector[],
    handlers: {
      onClick: (sector: Sector, index: number, id: string) => void;
      onMouseOver: (sector: Sector, index: number, id: string) => void;
      onMouseOut: () => void;
    },
    sectorProgressFn: (sector: Sector) => number
  ): void {
    if (!this.svg) return;

    const { dimLabels, colors } = this.config;
    const numSegments = dimLabels.length;
    const offset = this.innerRadius + this.config.maxLevel * this.segmentHeight;

    const g = this.svg
      .append('g')
      .classed('circular-heat', true)
      .attr('transform', `translate(${offset}, ${offset})`);

    const arc = d3
      .arc<SVGPathElement, Sector>()
      .innerRadius((d, i) => this.innerRadius + Math.floor(i / numSegments) * this.segmentHeight)
      .outerRadius(
        (d, i) =>
          this.innerRadius + this.segmentHeight + Math.floor(i / numSegments) * this.segmentHeight
      )
      .startAngle((d, i) => (i * 2 * Math.PI) / numSegments)
      .endAngle((d, i) => ((i + 1) * 2 * Math.PI) / numSegments);

    g.selectAll('path')
      .data(dataset)
      .enter()
      .append('path')
      .attr('class', d => 'segment-' + d.dimension.replace(/ /g, '-'))
      .attr('id', (d, i) => 'index-' + i)
      .attr('d', arc)
      .attr('stroke', colors.stroke)
      .attr('fill', d => {
        if (!d.activities || d.activities.length === 0) {
          return colors.disabled;
        }
        return this.colorScale(sectorProgressFn(d));
      })
      .on('click', (event, d) => {
        const index = dataset.indexOf(d);
        handlers.onClick(d, index, 'index-' + index);
      })
      .on('mouseover', (event, d) => {
        const index = dataset.indexOf(d);
        handlers.onMouseOver(d, index, 'index-' + index);
      })
      .on('mouseout', () => {
        handlers.onMouseOut();
      });

    // Segment labels
    const segmentLabelFontSize = (this.segmentLabelHeight * 2) / 3;
    const segmentLabelOffset = (this.segmentLabelHeight * 1) / 3;
    const r = this.innerRadius + this.config.maxLevel * this.segmentHeight + segmentLabelOffset;

    const labels = this.svg
      .append('g')
      .classed('labels', true)
      .classed('segment', true)
      .attr('transform', `translate(${offset}, ${offset})`);

    labels
      .append('def')
      .append('path')
      .attr('id', 'segment-label-path-1')
      .attr('d', `m0 -${r} a${r} ${r} 0 1 1 -1 0`);

    labels
      .selectAll('text')
      .data(dimLabels)
      .enter()
      .append('text')
      .append('textPath')
      .attr('text-anchor', 'middle')
      .attr('xlink:href', '#segment-label-path-1')
      .style('font-size', segmentLabelFontSize + 'px')
      .attr('startOffset', (d, i) => ((i + 0.5) * 100) / numSegments + '%')
      .text(d => d);

    const cursors = this.svg
      .append('g')
      .classed('cursors', true)
      .attr('transform', `translate(${offset}, ${offset})`);

    cursors
      .append('path')
      .attr('id', 'hover')
      .attr('pointer-events', 'none')
      .attr('stroke', 'green')
      .attr('stroke-width', '7')
      .attr('fill', 'transparent');

    cursors
      .append('path')
      .attr('id', 'selected')
      .attr('pointer-events', 'none')
      .attr('stroke', '#232323')
      .attr('stroke-width', '4')
      .attr('fill', 'transparent');
  }

  public setSectorCursor(cursorId: string, targetId: string): void {
    if (!this.svg) return;
    const cursor = this.svg.select(cursorId.startsWith('#') ? cursorId : '#' + cursorId);
    let path = '';
    if (targetId) {
      if (!targetId.startsWith('#')) targetId = '#' + targetId;
      path = this.svg.select(targetId).attr('d') || '';
    }
    cursor.attr('d', path);
  }

  public recolorSector(index: number, progressValue: number): void {
    if (!this.svg) return;

    this.svg
      .select('#index-' + index)
      .attr(
        'fill',
        isNaN(progressValue) ? this.config.colors.disabled : this.colorScale(progressValue)
      );
  }

  public updateThemeColors(colors: HeatmapColors): void {
    this.config.colors = colors;
    this.colorScale.range([colors.background, colors.filled]);
    if (this.svg) {
      this.svg.selectAll('.circular-heat path').attr('stroke', colors.stroke);
    }
  }
}

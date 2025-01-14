import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
} from '@angular/core';
import { ymlService } from '../../service/yaml-parser/yaml-parser.service';
import * as d3 from 'd3';
import * as yaml from 'js-yaml';
import { Router } from '@angular/router';
import { MatChip } from '@angular/material/chips';
import * as md from 'markdown-it';

export interface activitySchema {
  uuid: string;
  activityName: string;
  teamsImplemented: any;
}

export interface cardSchema {
  Dimension: string;
  SubDimension: string;
  Level: string;
  'Done%': number;
  Activity: activitySchema[];
}

type ProjectData = {
  Activity: activitySchema[];
  Dimension: string;
  Done: number;
  Level: string;
  SubDimension: string;
}[];

@Component({
  selector: 'app-circular-heatmap',
  templateUrl: './circular-heatmap.component.html',
  styleUrls: ['./circular-heatmap.component.css'],
})
export class CircularHeatmapComponent implements OnInit {
  Routing: string = '/activity-description';
  maxLevelOfMaturity: number = -1;
  showActivityCard: boolean = false;
  cardHeader: string = '';
  cardSubheader: string = '';
  currentDimension: string = '';
  activityData: any[] = [];
  ALL_CARD_DATA: cardSchema[] = [];
  radial_labels: string[] = [];
  YamlObject: any;
  teamList: any;
  teamGroups: any;
  selectedTeamChips: string[] = ['All'];
  teamVisible: string[] = [];
  segment_labels: string[] = [];
  activityDetails: any;
  showOverlay: boolean;
  markdown: md = md();

  constructor(
    private yaml: ymlService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {
    this.showOverlay = false;
  }

  ngOnInit(): void {
    console.log(`${this.perfNow()}s: ngOnInit`);
    // Ensure that Levels and Teams load before MaturityData
    // using promises, since ngOnInit does not support async/await
    this.LoadMaturityLevels()
      .then(() => this.LoadTeamsFromMetaYaml())
      .then(() => this.LoadMaturityDataFromGeneratedYaml())
      .then(() => {
        console.log(`${this.perfNow()}s: set filters: ${this.chips?.length}`);
        this.matChipsArray = this.chips.toArray();
      });
  }

  @ViewChildren(MatChip) chips!: QueryList<MatChip>;
  matChipsArray: MatChip[] = [];

  private LoadMaturityDataFromGeneratedYaml() {
    return new Promise<void>((resolve, reject) => {
      console.log(`${this.perfNow()}s: LoadMaturityData Fetch`);
      this.yaml.setURI('./assets/YAML/generated/generated.yaml');
      this.yaml.getJson().subscribe(data => {
        console.log(`${this.perfNow()}s: LoadMaturityData Downloaded`);
        this.YamlObject = data;
        this.AddSegmentLabels(this.YamlObject);
        const localStorageData = this.getDatasetFromBrowserStorage();

        // Initialize the card array
        let segmentTotalCount = this.segment_labels.length;
        let cardTotalCount = segmentTotalCount * this.maxLevelOfMaturity;
        this.ALL_CARD_DATA = new Array(cardTotalCount).fill(null);

        // Process each card / sector
        let subdimCount = -1;
        for (let dim in this.YamlObject) {
          for (let subdim in this.YamlObject[dim]) {
            subdimCount++;
            console.log(subdimCount, subdim);
            let activities: Map<number, activitySchema[]> =
              this.processActivities(
                this.YamlObject[dim][subdim],
                localStorageData
              );

            for (
              let level: number = 1;
              level <= this.maxLevelOfMaturity;
              level++
            ) {
              // Create and store each card (with activities for that level)
              var cardSchemaData: cardSchema = {
                Dimension: dim,
                SubDimension: subdim,
                Level: 'Level ' + level,
                'Done%': -1,
                Activity: activities.get(level) || [],
              };

              // Store cards in sequential slots, by dimension then level
              let levelIndex = (level - 1) * segmentTotalCount;
              this.ALL_CARD_DATA[levelIndex + subdimCount] = cardSchemaData;
            }
          }
        }

        console.log('ALL CARD DATA', this.ALL_CARD_DATA);
        this.loadCircularHeatMap(
          this.ALL_CARD_DATA,
          '#chart',
          this.radial_labels,
          this.segment_labels
        );
        this.noActivitytoGrey();
        console.log(`${this.perfNow()}s: LoadMaturityData End`);
        resolve();
      });
    });
  }

  /**
   * Returns activities of one subdimension, separated by maturity level.
   * Source of activities is the cards from the server.
   *
   * Status of Team Implementation is merged from both server status and
   * locally stored changes.
   */
  private processActivities(
    card: any,
    localStorageData: any
  ): Map<number, activitySchema[]> {
    let activities: Map<number, activitySchema[]> = new Map();
    for (let activityName in card) {
      let currentActivity: any = card[activityName];
      let level: number = currentActivity.level;
      var uuid = currentActivity?.uuid;

      // Initialize a status for all genuine teams
      let genuineTeams: any = {};
      this.teamList.forEach((singleTeam: string) => {
        genuineTeams[singleTeam] = false;
      });

      // Read server and locally stored teams statuses as well
      var teamsFromYaml: any = currentActivity.teamsImplemented;
      var teamsFromLocalstorage: any = this.getTeamImplementedFromJson(
        localStorageData,
        activityName
      );

      // Combine the lot, where local changes takes priority
      var combinedTeamsImplemented = Object.assign(
        {},
        genuineTeams,
        teamsFromYaml,
        teamsFromLocalstorage
      );

      // Store each activity, split by maturity level
      if (!activities.has(level)) activities.set(level, []);
      activities.get(level)?.push({
        uuid: uuid,
        activityName: activityName,
        teamsImplemented: combinedTeamsImplemented,
      });
    }
    return activities;
  }

  private getTeamImplementedFromJson(
    data: ProjectData,
    activityName: string
  ): any | undefined {
    if (data) {
      // Find the activity in data that matches the activityName
      const card = data.find(project =>
        project.Activity.find(
          activity => activity.activityName === activityName
        )
      );

      if (card) {
        return card.Activity.find(
          activity => activity.activityName === activityName
        )?.teamsImplemented;
      }
    }

    return undefined;
  }

  private AddSegmentLabels(yampObject: any[]) {
    for (let dim in yampObject) {
      for (let subdim in yampObject[dim]) {
        this.segment_labels.push(subdim);
      }
    }
    console.log(this.segment_labels);
  }

  private LoadTeamsFromMetaYaml() {
    return new Promise<void>((resolve, reject) => {
      console.log(`${this.perfNow()}s: LoadTeamsFromMetaYaml Fetch`);
      this.yaml.setURI('./assets/YAML/meta.yaml');
      this.yaml.getJson().subscribe(data => {
        console.log(`${this.perfNow()}s: LoadTeamsFromMetaYaml Downloaded`);
        this.YamlObject = data;

        this.teamList = this.YamlObject['teams']; // Genuine teams (the true source)
        this.teamGroups = this.YamlObject['teamGroups'];
        this.teamVisible = [...this.teamList];

        // Ensure that all team names in the groups are genuine team names
        for (let team in this.teamGroups) {
          this.teamGroups[team] = this.teamGroups[team].filter((t: string) =>
            this.teamList.includes(t)
          );
          if (this.teamGroups[team].length == 0) delete this.teamGroups[team];
        }
        resolve();
      });
    });
  }

  private LoadMaturityLevels() {
    return new Promise<void>((resolve, reject) => {
      console.log(`${this.perfNow()}s: LoadMaturityLevels Fetch`);
      this.yaml.setURI('./assets/YAML/meta.yaml');
      // Function sets column header
      this.yaml.getJson().subscribe(data => {
        console.log(`${this.perfNow()}s: LoadMaturityLevels Downloaded`);
        this.YamlObject = data;

        // Levels header
        for (let x in this.YamlObject['strings']['en']['maturity_levels']) {
          var y = parseInt(x) + 1;
          this.radial_labels.push('Level ' + y);
          this.maxLevelOfMaturity = y;
        }
        resolve();
      });
    });
  }

  toggleTeamGroupSelection(chip: MatChip) {
    chip.toggleSelected();
    let currChipValue = chip.value.trim();

    if (chip.selected) {
      this.selectedTeamChips = [currChipValue];
      if (currChipValue == 'All') {
        this.teamVisible = [...this.teamList];
      } else {
        this.teamVisible = [];

        (
          Object.keys(this.teamGroups) as (keyof typeof this.teamGroups)[]
        ).forEach((key, index) => {
          if (key === currChipValue) {
            console.log('group selected');
            this.teamVisible = [...this.teamGroups[key]];
          }
        });
      }
    } else {
      this.selectedTeamChips = this.selectedTeamChips.filter(
        o => o !== currChipValue
      );
    }
    console.log('Selected Chips', this.selectedTeamChips);
    console.log('Team Visible', this.teamVisible);
    console.log('All chips', this.matChipsArray);

    // Update heatmap based on selection
    this.updateChips(true);
  }

  toggleTeamSelection(chip: MatChip) {
    chip.toggleSelected();
    let currChipValue = chip.value.trim();
    let prevSelectedChip = this.selectedTeamChips;
    if (chip.selected) {
      this.teamVisible.push(currChipValue);
      this.selectedTeamChips = [];
    } else {
      this.selectedTeamChips = [];
      this.teamVisible = this.teamVisible.filter(o => o !== currChipValue);
    }
    console.log('Selected Chips', this.selectedTeamChips);
    console.log('Team Visible', this.teamVisible);
    console.log('Team List', this.teamList);
    console.log('All chips', this.matChipsArray);
    // Update heatmap based on selection
    this.updateChips(prevSelectedChip);
  }

  updateChips(fromTeamGroup: any) {
    console.log('updating chips', fromTeamGroup);
    // Re select chips
    this.matChipsArray.forEach(chip => {
      let currChipValue = chip.value.trim();

      if (this.teamVisible.includes(currChipValue)) {
        console.log(currChipValue);
        chip.selected = true;
      } else {
        if (!this.selectedTeamChips.includes(currChipValue)) {
          chip.selected = false;
        }
      }
    });
    this.reColorHeatmap();
  }
  // Team Filter ENDS

  teamCheckbox(activityIndex: number, teamKey: any) {
    let _self = this;
    var index = 0;
    for (var i = 0; i < this.ALL_CARD_DATA.length; i++) {
      if (
        this.ALL_CARD_DATA[i]['SubDimension'] === this.cardHeader &&
        this.ALL_CARD_DATA[i]['Level'] === this.cardSubheader
      ) {
        index = i;
        break;
      }
    }
    this.ALL_CARD_DATA[index]['Activity'][activityIndex]['teamsImplemented'][
      teamKey
    ] =
      !this.ALL_CARD_DATA[index]['Activity'][activityIndex]['teamsImplemented'][
        teamKey
      ];

    this.saveDataset();
    this.reColorHeatmap();
  }

  loadCircularHeatMap(
    dataset: any,
    dom_element_to_append_to: string,
    radial_labels: string[],
    segment_labels: string[]
  ) {
    //console.log(segment_labels)
    //d3.select(dom_element_to_append_to).selectAll('svg').exit()
    let _self = this;
    var margin = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    };
    var width = 1250 - margin.left - margin.right;
    var curr: any;
    var height = width;
    var innerRadius = 100; // width/14;

    var segmentHeight =
      (width - margin.top - margin.bottom - 2 * innerRadius) /
      (2 * radial_labels.length);

    var chart = this.circularHeatChart(segment_labels.length)
      .innerRadius(innerRadius)
      .segmentHeight(segmentHeight)
      .domain([0, 1])
      .range(['white', 'green'])
      .radialLabels(radial_labels)
      .segmentLabels(segment_labels);

    chart.accessor(function (d: any) {
      return d['Done%'];
    });
    //d3.select("svg").remove();
    var svg = d3
      .select(dom_element_to_append_to)
      .selectAll('svg')
      .data([dataset])
      .enter()
      .append('svg')
      .attr('width', '60%') // 70% forces the heatmap down
      .attr('height', 'auto')
      .attr('viewBox', '0 0 1150 1150')
      .append('g')
      .attr(
        'transform',
        'translate(' +
          (width / 2 - (radial_labels.length * segmentHeight + innerRadius)) +
          ',' +
          margin.top +
          ')'
      )
      .call(chart);

    function cx() {
      var e = window.event as MouseEvent;
      return e.clientX;
    }
    function cy() {
      var e = window.event as MouseEvent;
      return e.clientY;
    }

    svg
      .selectAll('path')
      .on('click', function (d) {
        console.log(d);
        try {
          curr = d.explicitOriginalTarget.__data__;
        } catch {
          curr = d.srcElement.__data__;
        }
        var index = 0;
        var cnt = 0;
        for (var i = 0; i < _self.ALL_CARD_DATA.length; i++) {
          if (
            _self.ALL_CARD_DATA[i]['SubDimension'] === curr.SubDimension &&
            _self.ALL_CARD_DATA[i]['Level'] === curr.Level
          ) {
            index = i;
            break;
          }
        }
        console.log('index', _self.ALL_CARD_DATA[index]['Activity']);
        _self.currentDimension = curr.Dimension;
        _self.cardSubheader = curr.Level;
        _self.activityData = curr.Activity;
        _self.cardHeader = curr.SubDimension;
        _self.showActivityCard = true;
      })
      .on('mouseover', function (d) {
        //console.log(d.toElement.__data__.Name)
        try {
          curr = d.explicitOriginalTarget.__data__;
        } catch {
          curr = d.toElement.__data__;
        }
        // increase the segment height of the one being hovered as well as all others of the same date
        // while decreasing the height of all others accordingly
        if (curr['Done%'] != -1) {
          d3.selectAll(
            '#segment-' +
              curr.SubDimension.replace(/ /g, '-') +
              '-' +
              curr.Level.replaceAll(' ', '-')
          ).attr('fill', 'yellow');
        }
      })

      .on('mouseout', function (d) {
        //console.log(d.explicitOriginalTarget.__data__.Day)

        if (curr['Done%'] != -1) {
          d3.selectAll(
            '#segment-' +
              curr.SubDimension.replace(/ /g, '-') +
              '-' +
              curr.Level.replaceAll(' ', '-')
          ).attr('fill', function (p) {
            var color = d3
              .scaleLinear<string, string>()
              .domain([0, 1])
              .range(['white', 'green']);
            // how to access a function within reusable charts
            //console.log(color(d.Done));
            return color(curr['Done%']);
          });
        } else {
          d3.selectAll(
            '#segment-' +
              curr.SubDimension.replace(/ /g, '-') +
              '-' +
              curr.Level.replaceAll(' ', '-')
          ).attr('fill', '#DCDCDC');
        }
      });
    this.reColorHeatmap();
  }

  circularHeatChart(num_of_segments: number) {
    var margin = {
        top: 20,
        right: 50,
        bottom: 50,
        left: 20,
      },
      innerRadius = 20,
      numSegments = num_of_segments,
      segmentHeight = 20,
      domain: any = null,
      range = ['white', 'red'],
      accessor = function (d: any) {
        return d;
      };
    var radialLabels = [];
    var segmentLabels: any[] = [];

    //console.log(segmentLabels)

    function chart(selection: any) {
      selection.each(function (this: any, data: any) {
        var svg = d3.select(this);

        var offset =
          innerRadius + Math.ceil(data.length / numSegments) * segmentHeight;
        var g = svg
          .append('g')
          .classed('circular-heat', true)
          .attr(
            'transform',
            'translate(' +
              (margin.left + offset) +
              ',' +
              (margin.top + offset) +
              ')'
          );

        var autoDomain = false;
        if (domain === null) {
          domain = d3.extent(data, accessor);
          autoDomain = true;
        }
        var color = d3
          .scaleLinear<string, string>()
          .domain(domain)
          .range(range);
        if (autoDomain) domain = null;

        g.selectAll('path')
          .data(data)
          .enter()
          .append('path')
          // .attr("class","segment")
          .attr('class', function (d: any) {
            return 'segment-' + d.SubDimension.replace(/ /g, '-');
          })
          .attr('id', function (d: any) {
            return (
              'segment-' +
              d.SubDimension.replace(/ /g, '-') +
              '-' +
              d.Level.replaceAll(' ', '-')
            );
          })
          .attr(
            'd',
            d3
              .arc<any>()
              .innerRadius(ir)
              .outerRadius(or)
              .startAngle(sa)
              .endAngle(ea)
          )
          .attr('stroke', function (d) {
            return '#252525';
          })
          .attr('fill', function (d) {
            return color(accessor(d));
          });

        // Unique id so that the text path defs are unique - is there a better way to do this?
        // console.log(d3.selectAll(".circular-heat")["_groups"][0].length)
        var id = 1;

        //Segment labels
        var segmentLabelOffset = 5;
        var r =
          innerRadius +
          Math.ceil(data.length / numSegments) * segmentHeight +
          segmentLabelOffset;
        var labels = svg
          .append('g')
          .classed('labels', true)
          .classed('segment', true)
          .attr(
            'transform',
            'translate(' +
              (margin.left + offset) +
              ',' +
              (margin.top + offset) +
              ')'
          );

        labels
          .append('def')
          .append('path')
          .attr('id', 'segment-label-path-' + id)
          .attr('d', 'm0 -' + r + ' a' + r + ' ' + r + ' 0 1 1 -1 0');

        labels
          .selectAll('text')
          .data(segmentLabels)
          .enter()
          .append('text')
          .append('textPath')
          .attr('xlink:href', '#segment-label-path-' + id)
          .style('font-size', '12px')
          .attr('startOffset', function (d, i) {
            return (i * 100) / numSegments + 0.1 + '%';
          })
          .text(function (d: any) {
            return d;
          });
      });
    }

    /* Arc functions */
    var ir = function (d: any, i: number) {
      return innerRadius + Math.floor(i / numSegments) * segmentHeight;
    };
    var or = function (d: any, i: number) {
      return (
        innerRadius +
        segmentHeight +
        Math.floor(i / numSegments) * segmentHeight
      );
    };
    var sa = function (d: any, i: number) {
      return (i * 2 * Math.PI) / numSegments;
    };
    var ea = function (d: any, i: number) {
      return ((i + 1) * 2 * Math.PI) / numSegments;
    };

    /* Configuration getters/setters */
    chart.margin = function (_: any) {
      //if (!arguments.length) return margin;
      margin = _;
      return chart;
    };

    chart.innerRadius = function (_: any) {
      // if (!arguments.length) return innerRadius;
      innerRadius = _;
      return chart;
    };

    chart.numSegments = function (_: any) {
      //if (!arguments.length) return numSegments;
      numSegments = _;
      return chart;
    };

    chart.segmentHeight = function (_: any) {
      // if (!arguments.length) return segmentHeight;
      segmentHeight = _;
      return chart;
    };

    chart.domain = function (_: any) {
      //if (!arguments.length) return domain;
      domain = _;
      return chart;
    };

    chart.range = function (_: any) {
      // if (!arguments.length) return range;
      range = _;
      return chart;
    };

    chart.radialLabels = function (_: any) {
      // if (!arguments.length) return radialLabels;
      if (_ == null) _ = [];
      radialLabels = _;
      return chart;
    };

    chart.segmentLabels = function (_: any) {
      // if (!arguments.length) return segmentLabels;
      if (_ == null) _ = [];
      segmentLabels = _;
      return chart;
    };

    chart.accessor = function (_: any) {
      if (!arguments.length) return accessor;
      accessor = _;
      return chart;
    };

    return chart;
  }

  noActivitytoGrey(): void {
    for (var x = 0; x < this.ALL_CARD_DATA.length; x++) {
      if (this.ALL_CARD_DATA[x]['Done%'] == -1) {
        d3.selectAll(
          '#segment-' +
            this.ALL_CARD_DATA[x]['SubDimension'].replace(/ /g, '-') +
            '-' +
            this.ALL_CARD_DATA[x]['Level'].replace(' ', '-')
        ).attr('fill', '#DCDCDC');
      }
    }
  }

  defineStringValues(
    dataToCheck: string,
    valueOfDataIfUndefined: string
  ): string {
    try {
      return this.markdown.render(dataToCheck);
    } catch {
      return valueOfDataIfUndefined;
    }
  }

  openActivityDetails(dim: string, subdim: string, activityName: string) {
    let navigationExtras = {
      dimension: dim,
      subDimension: subdim,
      activityName: activityName,
    };
    this.activityDetails = Object.assign(
      {},
      this.YamlObject[dim][subdim][activityName]
    );
    this.activityDetails.description = this.defineStringValues(
      this.activityDetails.description,
      this.activityDetails.description
    );
    this.activityDetails.risk = this.defineStringValues(
      this.activityDetails.risk,
      this.activityDetails.risk
    );
    this.activityDetails.measure = this.defineStringValues(
      this.activityDetails.measure,
      this.activityDetails.measure
    );
    if (this.activityDetails) {
      this.activityDetails.navigationExtras = navigationExtras;
    }
    console.log(this.activityDetails);
    this.showOverlay = true;
  }

  closeOverlay() {
    this.showOverlay = false;
  }

  saveEditedYAMLfile() {
    this.setTeamsStatus(this.YamlObject, this.teamList, this.ALL_CARD_DATA);
    let yamlStr = yaml.dump(this.YamlObject);

    let file = new Blob([yamlStr], { type: 'text/csv;charset=utf-8' });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(file);
    link.download = 'generated.yaml';
    link.click();
    link.remove();
  }

  setTeamsStatus(yamlObject: any, teamList: string[], card_data: cardSchema[]) {
    // Loop through all activities from the card_data
    for (let card of card_data) {
      for (let activity of card.Activity) {
        let dim: string = card.Dimension;
        let subdim: string = card.SubDimension;
        let activityName: string = activity.activityName;
        let teamsImplemented: any = {};

        // Get the state for all genuine teams of the activity
        for (let team of teamList) {
          teamsImplemented[team] = activity?.teamsImplemented[team] || false;
        }
        // Save the teams' state to the yaml object
        yamlObject[dim][subdim][activityName].teamsImplemented =
          teamsImplemented;
      }
    }
  }

  reColorHeatmap() {
    console.log('recolor');
    for (var index = 0; index < this.ALL_CARD_DATA.length; index++) {
      let cntAll: number = 0;
      let cntTrue: number = 0;
      var _self = this;
      for (var i = 0; i < this.ALL_CARD_DATA[index]['Activity'].length; i++) {
        var activityTeamList: any;
        activityTeamList =
          this.ALL_CARD_DATA[index]['Activity'][i]['teamsImplemented'];
        (
          Object.keys(activityTeamList) as (keyof typeof activityTeamList)[]
        ).forEach((key, index) => {
          if (typeof key === 'string') {
            if (this.teamVisible.includes(key)) {
              if (activityTeamList[key] === true) {
                cntTrue += 1;
              }
              cntAll += 1;
            }
          }
        });
      }
      if (cntAll !== 0) {
        this.ALL_CARD_DATA[index]['Done%'] = cntTrue / cntAll;
      } else {
        this.ALL_CARD_DATA[index]['Done%'] = -1;
      }
      var color = d3
        .scaleLinear<string, string>()
        .domain([0, 1])
        .range(['white', 'green']);

      d3.selectAll(
        '#segment-' +
          this.ALL_CARD_DATA[index]['SubDimension'].replace(/ /g, '-') +
          '-' +
          this.ALL_CARD_DATA[index]['Level'].replace(' ', '-')
      ).attr('fill', function (p) {
        return color(_self.ALL_CARD_DATA[index]['Done%']);
      });
    }
    this.noActivitytoGrey();
  }

  ResetIsImplemented() {
    localStorage.removeItem('dataset');
    this.loadDataset();
  }

  saveDataset() {
    localStorage.setItem('dataset', JSON.stringify(this.ALL_CARD_DATA));
  }

  loadDataset() {
    var content = this.getDatasetFromBrowserStorage();
    if (content != null) {
      this.ALL_CARD_DATA = content;
    }
  }

  getDatasetFromBrowserStorage(): any {
    console.log(`${this.perfNow()}s: getDatasetFromBrowserStorage() ####`);
    // @ts-ignore
    if (this.ALL_CARD_DATA?.length && this.ALL_CARD_DATA[0]?.Task != null) {
      console.log('Found outdated dataset, removing');
      localStorage.removeItem('dataset');
    }

    var content = localStorage.getItem('dataset');
    if (content != null) {
      return JSON.parse(content);
    }
    return null;
  }

  perfNow(): string {
    return (performance.now() / 1000).toFixed(3);
  }

  unsorted() {
    return 0;
  }
}

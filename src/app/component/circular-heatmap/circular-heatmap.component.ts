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
  maxLevelOfActivities: number = -1;
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
      console.log(
        `${this.perfNow()}s: LoadMaturityDataFromGeneratedYaml Fetch`
      );
      this.yaml.setURI('./assets/YAML/generated/generated.yaml');

      this.yaml.getJson().subscribe(data => {
        console.log(
          `${this.perfNow()}s: LoadMaturityDataFromGeneratedYaml Downloaded`
        );
        this.YamlObject = data;
        var allDimensionNames = Object.keys(this.YamlObject);
        var totalTeamsImplemented: number = 0;
        var totalActivityTeams: number = 0;

        this.AddSegmentLabels(allDimensionNames);

        for (var l = 0; l < this.maxLevelOfActivities; l++) {
          for (var d = 0; d < allDimensionNames.length; d++) {
            var allSubDimensionInThisDimension = Object.keys(
              this.YamlObject[allDimensionNames[d]]
            );
            for (var s = 0; s < allSubDimensionInThisDimension.length; s++) {
              var allActivityInThisSubDimension = Object.keys(
                this.YamlObject[allDimensionNames[d]][
                  allSubDimensionInThisDimension[s]
                ]
              );
              var level = 'Level ' + (l + 1);
              var activity: activitySchema[] = [];
              var activityCompletionStatus: number = -1;

              for (var a = 0; a < allActivityInThisSubDimension.length; a++) {
                try {
                  var uuid =
                    this.YamlObject[allDimensionNames[d]][
                      allSubDimensionInThisDimension[s]
                    ][allActivityInThisSubDimension[a]]['uuid'];

                  var lvlOfCurrentActivity =
                    this.YamlObject[allDimensionNames[d]][
                      allSubDimensionInThisDimension[s]
                    ][allActivityInThisSubDimension[a]]['level'];

                  if (lvlOfCurrentActivity == l + 1) {
                    var nameOfActivity: string =
                      allActivityInThisSubDimension[a];
                    var teamStatus: { [key: string]: boolean } = {};
                    const teams = this.teamList;

                    totalActivityTeams += 1;

                    teams.forEach((singleTeam: any) => {
                      teamStatus[singleTeam] = false;
                    });

                    var teamsImplemented: any =
                      this.YamlObject[allDimensionNames[d]][
                        allSubDimensionInThisDimension[s]
                      ][allActivityInThisSubDimension[a]]['teamsImplemented'];

                    if (teamsImplemented) {
                      teamStatus = teamsImplemented;
                    }

                    var localStorageData = this.getFromBrowserState();

                    if (
                      localStorageData != null &&
                      localStorageData.length > 0
                    ) {
                      this.YamlObject[allDimensionNames[d]][
                        allSubDimensionInThisDimension[s]
                      ][allActivityInThisSubDimension[a]]['teamsImplemented'] =
                        this.getTeamImplementedFromJson(
                          localStorageData,
                          allActivityInThisSubDimension[a]
                        );
                    }

                    (
                      Object.keys(teamStatus) as (keyof typeof teamStatus)[]
                    ).forEach((key, index) => {
                      totalActivityTeams += 1;
                      if (teamStatus[key] === true) {
                        totalTeamsImplemented += 1;
                      }
                    });

                    activity.push({
                      uuid: uuid,
                      activityName: nameOfActivity,
                      teamsImplemented: teamStatus,
                    });
                  }

                  if (totalActivityTeams > 0) {
                    activityCompletionStatus =
                      totalTeamsImplemented / totalActivityTeams;
                  }
                } catch {
                  console.log('level for activity does not exist');
                }
              }

              var cardSchemaData: cardSchema = {
                Dimension: allDimensionNames[d],
                SubDimension: allSubDimensionInThisDimension[s],
                Level: level,
                'Done%': activityCompletionStatus,
                Activity: activity,
              };

              this.ALL_CARD_DATA.push(cardSchemaData);
            }
          }
        }

        console.log('ALL CARD DATA', this.ALL_CARD_DATA);
        this.loadState();
        this.loadCircularHeatMap(
          this.ALL_CARD_DATA,
          '#chart',
          this.radial_labels,
          this.segment_labels
        );
        this.noActivitytoGrey();
        console.log(
          `${this.perfNow()}s: LoadMaturityDataFromGeneratedYaml End`
        );
        resolve();
      });
    });
  }

  private getTeamImplementedFromJson(
    data: ProjectData,
    activityName: string
  ): any | undefined {
    const activity = data.find(project =>
      project.Activity.find(activity => activity.activityName === activityName)
    );

    if (activity) {
      return activity.Activity.find(
        activity => activity.activityName === activityName
      )?.teamsImplemented;
    }

    return undefined;
  }

  private AddSegmentLabels(allDimensionNames: string[]) {
    console.log(allDimensionNames);
    for (var i = 0; i < allDimensionNames.length; i++) {
      var allSubDimensionInThisDimension = Object.keys(
        this.YamlObject[allDimensionNames[i]]
      );
      for (var j = 0; j < allSubDimensionInThisDimension.length; j++) {
        this.segment_labels.push(allSubDimensionInThisDimension[j]);
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

        this.teamList = this.YamlObject['teams'];
        this.teamGroups = this.YamlObject['teamGroups'];
        this.teamVisible = [...this.teamList];
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
          this.maxLevelOfActivities = y;
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

    this.saveState();
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
        //console.log(_self.activityData)
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

  navigate(dim: string, subdim: string, activityName: string) {
    let navigationExtras = {
      dimension: dim,
      subDimension: subdim,
      activityName: activityName,
    };
    this.yaml.setURI('./assets/YAML/generated/generated.yaml');
    this.activityDetails = this.YamlObject[dim][subdim][activityName];
    console.log(this.YamlObject);
    console.log(this.YamlObject[dim][subdim]);
    if (this.activityDetails) {
      this.activityDetails.navigationExtras = navigationExtras;
    }
    console.log(this.activityDetails);
    console.log(this.ALL_CARD_DATA);
    this.showOverlay = true;
  }

  closeOverlay() {
    this.showOverlay = false;
  }

  SaveEditedYAMLfile() {
    let yamlStr = yaml.dump(this.YamlObject);
    let file = new Blob([yamlStr], { type: 'text/csv;charset=utf-8' });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(file);
    link.download = 'generated.yaml';
    link.click();
    link.remove();
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
    this.loadState();
  }

  saveState() {
    localStorage.setItem('dataset', JSON.stringify(this.ALL_CARD_DATA));
  }

  loadState() {
    var content = localStorage.getItem('dataset');
    // @ts-ignore
    if (this.ALL_CARD_DATA[0]['Task'] != null) {
      console.log('Found outdated dataset, removing');
      localStorage.removeItem('dataset');
    }
    if (content != null) {
      this.ALL_CARD_DATA = JSON.parse(content);
    }
  }

  getFromBrowserState(): any {
    var content = localStorage.getItem('dataset');
    if (content != null) {
      return JSON.parse(content);
    }
  }

  perfNow(): string {
    return (performance.now() / 1000).toFixed(3);
  }
}

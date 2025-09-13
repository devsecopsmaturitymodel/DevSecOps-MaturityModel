## Doing
 - Bug: Teams: Reads progress heading from activityStore, not metaStore

## Next
### Dependency graph
- Dependency graph: Add to CircularHeatmap Details
- Matrix: Dependency graph: Render in center of page

## ToDo
- Heatmap: Fix: asterisk marks when modified
  - ViewController needs to know about changes vs temp storage
- Heatmap: Bug: Clicking on grey sector leaves cursor on that sector
- Team KPI: One KPI per ProgressDefinition
- KPI: Add Sub-title
### Settings
- Make settings page
  - Date format (don't rely just on browser language)
  - Display mode dark/light
  - Progress Definition: Make customizable stage: Name, Percentage, Definition (free text)
  - Set Max maturity level (1-5)
### Dark Mode
- Merge in Dark Mode [PR #381](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/pull/381)
### Matrix
- Matrix: Add a Close/Back button
### Teams
- Teams: Allow user to re-order teams and groups
- Teams: Bug: Editing name, pushes the item last
- Teams: Allow editing dates for progress stages
### Heatmap:
- Heatmap: Bug: Selecting a team group does not always get deselected when flipping teams
- Heatmap: meta-yaml: If progress definition is missing, default to 0% + 100% 
- Heatmap: Revert to boolean checkboxes, if definition is only 0% and 100%
- Heatmap: Read previous local storage for backwards compatibility 
- Heatmap: Input Teams' evidence
- Heatmap: Increase subdimension to be two lines (and increase size)
### Documentation
- Doc: Update `Usage`
- Doc: Update `README.md`
- Doc: Update `About Us`
- Doc: Update `Development.md`
- Doc: Update `INSTALL.md`
### Misc
- Move all getMetaString into MetaStore()
- Add fallbacks for getMetaString in MetaStore()
- Fix dependsOn that is uuid (e.g. 83057028-0b77-4d2e-8135-40969768ae88)
- Refactor: Labels for knowledge, time, resources, and usefulness (used by both Matrix and Heatmap)
- Move META_FILE constant from data service to main app
- Check if loader can be optimized by load in yaml in parallel
- Proxy Grafana Faro data: https://grafana.com/docs/grafana-cloud/monitor-applications/frontend-observability/instrument/data-proxy/  

## Align DSOMM-data and DSOMM
- DSOMM-data: Sort linear list of activities (sorted by dim, level)
- DSOMM-data: Update generated filename and data structure to adhere to this new DSOMM standard
- DSOMM-data: Include version number in generated yaml file
- DSOMM: Read latest "generated.yaml" from DSOMM-data's github repo, to check for any new releases

# Later
- App: Search activities, across title description etc
- Export to Excel. Move from Mapping, to just progress data
- Filter: Bug: SPACE key does not trigger
- Heatmap, Card: Add Complete-symbol per activity
- Heatmap: Update url on open details + read querystring on open
- Heatmap: Add 'Not applicable' as a status for a team
- Matrix: Brushup layout of details page
- Matrix: Remember filters, when moving back from details
- Matrix: Dependency graph: Make it clickable
- Matrix: Go through tags: remove, add and rename
- Misc: What is the activities.yaml comment field for? Should it be displayed to the user?
- Teams: View active initiatives for a team (>0% and <100%)
- Teams: View timeline for a team
- Meta.yaml: Allow admins to customize the terms 'Team' and 'Group' (e.g. to 'App' and 'Portfolio')

# Done
 - Linting
- Using Angular's built-in DomSanitizer to check [innerHTML]
- Heatmap: Run Markdown on yaml text
- Matrix: Fix markdown rendering
- Teams: Display some core info about the selected team/group
- Teams: Export teams and groups names as yaml
- Teams: Store teams names in localstorage
- Teams: Move team group 'All' from data-loader-service to Heatmap load
- Teams: Refactor to adhere to new data structure. 
- Mapping: Add search filters 
- Mapping: Refactor to adhere to new data structure. 
- Mapping: Refactor ExportToExcel
- Mapping: ExportToExcel: Fix duplicate lines in export  (The column ISO 27001:2017 is not flattened)
- Misc: Move page "components" to ./pages/
- Heatmap: Fix references not showing in activity details
- Heatmap: Remove old obsolete code
- Heatmap: Export TeamProgress yaml
- Heatmap: Fix: Update map when teams are selected
- Store TeamProgress to localStorage
- Load localStorage TeamProgress
- Load TeamProgress yaml
- Refactor Circular Heatmap
- Add validation for meta.yaml, progress step: include 0% and 100%
- Load YAML progress
- Navigate to activity-description without site reload
- Refactor Dependecy graph
- Refactor activity-description
- Make sure loader.load() only runs once (even with navigations)
- Handle parsing errors, like Circular Heatmap
- Filter: Make filters for subdimensions
- Matrix: toggle chips
- Matrix: updateActivitesBeingDisplayed()
- Matrix: dataloader.getLevels(): Return only max levels from yaml
- Matrix: ngInit
- Make unittest for activity-store
- Make unittest for ignore
- Handle 'ignore:true' on Category and Dimension
- Handle 'ignore:true' on Activity
- Handle 'ignore:true' on dimension or categories
- Load multiple Activity files
- Better error msg handling in load Yaml
- Make 1st draft of Activity model
- Load Activities
- Substitute refs
- Load Yaml

For details and dates, please see the [GitHub log](https://github.com/vbakke/DevSecOps-MaturityModel/commits/experiment/).

## User tracking
The Experimental edition, and the Experimental edition only, uses Grafana Frontend to log the console log to catch bugs, especially from mobile devices. 


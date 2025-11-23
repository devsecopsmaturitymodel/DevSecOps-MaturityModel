## Doing

## Next
### Align DSOMM-data and DSOMM

- Loader: If "activities.yaml" is missing locally, notify user with a link to the latest version to doownload
- DSOMM-data: Sort linear list of activities (sorted by dim, level)
- DSOMM-data: Update generated filename and data structure to adhere to this new DSOMM standard


### Activity view
- Activity: Shorten very long ISO references
- Activity: Show Team Evidence from yaml file
- Activity: Show Implemented by properly


## ToDo
### KPI
- Teams: Bug: Reads progress heading from activityStore, not metaStore
- Team KPI: One KPI per ProgressDefinition
- KPI: Add Sub-title
### Matrix
- Matrix: Add a Close/Back button on Activity
- Matrix: Close on pushing ESCAPE
- Matrix: Add Filter serach (like for Mapping)
- Matrix: Remember filters when returning to matrix page
### Teams
- Teams: Allow user to re-order teams and groups
- Teams: Bug: Editing name, pushes the item last
- Teams: Allow editing dates for progress stages
### Heatmap:
- Heatmap: Allow 'change all' if more than four activities
- Heatmap: Add filter search, and highlight sectors with a match, inc highlight activity card
- Heatmap: Hilight (outline) the activity card that is open
- Heatmap: Fix: asterisk marks when modified
  - ViewController needs to know about changes vs temp storage
- Heatmap: Bug: Selecting a team group does not always get deselected when flipping teams
- Heatmap: meta-yaml: If progress definition is missing, default to 0% + 100% 
- Heatmap: Read previous local storage for backwards compatibility 
- Heatmap: Outer rim: Increase subdimension to be two lines (and increase size)
- Heatmap: Outer rim: Make hover display Dimension (over subdimension)
### Activity view
- Activity: Input Teams' evidence
- Activity: Dependency: Do not list activities beyond Max Level
### Documentation
- Doc: Update `Usage`
- Doc: Update `README.md`
- Doc: Update `About Us`
- Doc: Update `Development.md`
- Doc: Update `INSTALL.md`
### Settings
- Settings: Terms: Allow custom names for: 'Team' and 'Group' (e.g. to 'App' and 'Portfolio')

### Misc
- Refactor ProgressDefinitions to MetaStore to get definitions for 0%, 100% etc
- Move About Us, last, renaming to About DSOMM
- Move all getMetaString into MetaStore()
- Add fallbacks for getMetaString in MetaStore()
- Move META_FILE constant from data service to main app
- Check if loader can be optimized by load in yaml in parallel

# Later
- App: Search activities, across title description etc
- Export to Excel. Move from Mapping, to just progress data
- Filter: Bug: SPACE key does not trigger
- Heatmap, Card: Add Complete-symbol per activity
- Heatmap: Add 'Not applicable' as a status for a team
- Matrix: Go through tags: remove, add and rename
- Teams: View timeline for a team

# Done
- Settings: Show a button for checking for newer versions of the model
- Settings: Show model version
- DSOMM-data: Include version number in generated yaml file
- Heatmap: Show a dimension label in title when hovering (especially for the up-side down dimension)
- Settings: Proper text under Progress
- Settings: Progress Definition: Make customizable stage: Name, Percentage, Definition (free text)
- Settings: Make settings page
- Settings: Date format (don't rely just on browser language)
- Settings: Set Max maturity level (1-5)
- Activity info: Revamp the activity compoment
- Activity info: Both Matrix, Heatmap, and now Mapping use the same component for displaying activity info
- Heatmap: Add #uuid to URL, and allow navigation on clicks in dependencies
- Dependency: Make connecting nodes clickable for navigation
- Dependency: Handle dependsOn uuid, not just name
- Matrix: Dependency graph: Render in center of page
- Dependency graph: Add to CircularHeatmap Details
- Dependency graph: Support dark mode
- Merge in Dark Mode [PR #381](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/pull/381)
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


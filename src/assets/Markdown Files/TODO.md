# ToDo
The file contains items that would be good to improve. No particular order, apart from 'Doing' amd 'Next in the line'.


## Doing


## Next in line


## Backlog
### Upgrade to latest Angular
- Angular: Upgrade from v13

### Activity view
- Activity: Show Team Evidence from yaml file
- Activity: Input Teams' evidence
- Activity: Dependency: Do not list activities beyond Max Level
- Activity: Give user message if selected activity is of higher level than visible

### Matrix
- Matrix: Add Filter search (like for Mapping)
- Matrix: Remember filters when returning to matrix page
- Matrix: Add a Close/Back button on Activity
- Matrix: Close on pushing ESCAPE

### KPI
- Teams: Bug: Reads progress heading from activityStore, not metaStore
- Team KPI: One KPI per ProgressDefinition
- KPI: Add Sub-title

### Teams
- Teams: Bug: Editing name, pushes the item last
- Teams: Allow user to re-order teams and groups
- Teams: Allow editing dates for progress stages

### Heatmap:
- Heatmap: Known Bug ([#432](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/issues/432)): Occasionally, the `getComputedStyle()` returns a \ CSSStyleDeclaration` object with empty styles, which leave the heatmap all black.
- Heatmap: Allow 'change all' if more than four activities
- Heatmap: Highlight (outline) the activity card that is open
- Heatmap, Card: Add Complete-symbol per activity
- Heatmap: Slider: Fix: asterisk marks when modified
  - ViewController needs to know about changes vs temp storage
- Heatmap: Bug: Selecting a team group does not always get deselected when flipping teams
- Heatmap: meta-yaml: If progress definition is missing, default to 0% + 100% 
- Heatmap: Outer rim: Increase subdimension to be two lines (and increase size)
- Heatmap: Outer rim: Make hover display Dimension (over subdimension)
- Heatmap: Search: A bit like 'Filter' but needs to highlight each sector and activity card
- Heatmap: Filter: Bug: SPACE key does not trigger
- Export to Excel. Move from Mapping, to just progress data

### Settings
- Settings: Terms: Allow custom names for: 'Team' and 'Group' (e.g. to 'App' and 'Portfolio')

### Misc
- Move all getMetaString into MetaStore()
- Add fallbacks for getMetaString in MetaStore()
- Move META_FILE constant from data service to main app
- Loader: Check if loader can be optimized by load in yaml in parallel
- Matrix: Go through tags: remove, add and rename


## Done
### DSOMM v4.0.0
- Breaking changes: Data model
  - The `generated.yaml` is split into `model.yaml` and `team-progress.yaml`
  - The `model.yaml` has now includes a _"header"_ that contains the version of the DSOMM model it contains
- Customize your own Team names and Groups in the browser
- A Team's progress has changed from a `yes|no` boolean, to customizable steps, from zero to fully complete
- The view of an activity has been improved including the dependencies between activities
- Centralized data loader, all pages uses the same loading mechanism and we only load once at startup


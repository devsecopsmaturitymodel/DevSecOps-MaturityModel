## Things we'd like to improve
### Upgrade to Angular 21
 - We’d like to update to lates Angular, as we are currently running on a dated version 

### Evidence
 - Support handling evidence for each activity. 

### Review Level 2 activities in the model
 - Do a quality assurance on the model of all level 2 activities in the [DSOMM-data](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel-data) repository.

&nbsp;

<hr>

## Completed 
### DSOMM application v4.0
The release of v4.0 came with some breaking changing of the data model. This was to separate the role of responsibility into the model itself, and the progress information of a team. This way one can more easily update to a new version of the model, without affecting the historic progress of each team. 

The headlines of the release is:
- Breaking changes: Data model
  - The `generated.yaml` is split into `model.yaml` and `team-progress.yaml`
  - The `model.yaml` has now includes a _"header"_ that contains the version of the DSOMM model it contains
- Customize your own Team names and Groups in the browser
- A Team's progress has changed from a `yes|no` boolean, to customizable steps, from zero to fully complete
- The view of an activity has been improved including the dependencies between activities
- Centralized data loader, all pages uses the same loading mechanism and we only load once at startup

*Released: 2025-12-16*

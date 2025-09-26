# Changing team names has no effect

## Expected outcome
* Updating the teams names and groups in `meta.yaml` should be visible in the browser after a refresh

## Actual outcome

## Steps to reproduce
1) Clone the repo \
   `git clone https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel.git`

2) Install dependencies \
   `cd DevSecOps-MaturityModel` \
   `npm install`

3) Download the default teams setup \
   `curl https://raw.githubusercontent.com/devsecopsmaturitymodel/DevSecOps-MaturityModel-data/main/src/assets/YAML/generated/generated.yaml -o src/assets/YAML/generated/generated.yaml`

4) Start the web server \
   `ng server`  (or maybe `npx ng server`)

5) Open *incognito mode* os a web browser and visit \
   http://localhost:4200/circular-heatmap

6) Verify that the teams are 'Default', 'B' and 'C'

7) Fill in data for some of the teams
    - Click on a sector in the circle (e.g. *Build* Level 1)
    - Expand *Defined build process*
    - Tick all three teams
    - Click on another sector in the circle (e.g. *Deployment* Level 1)
    - Expand *Defined deployment process*
    - Tick 'Default' and 'B' only

8) Download `generated.yaml`

### Change names of teams
9) Open `src\assets\YAML\meta.yaml`
10) Edit team names in 'meta'
    - Rename `Default` to `A` in `teams` and `teamGroups`
    - Add `D` on `teams` and `teamGroups.GroupA`
    - Add `GroupD: ['C', 'D']` under `teamGroups`
11) Update team names in 'generated'
    - Rename all `Default:` to `A:` in the downloaded `generated.yaml`
    - Add `D: true` on line 130 for *Defined build process*

12) Replace `src/assets/YAML/generated/generated.yaml` with the newly modified version

### Verify data in your browser 
13) Refresh your browser
    * The team filters are showing the new names
    * But expanding the activity cards only show `B` and `C`
    







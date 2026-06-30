
# Migration Log: DSOMM Modernization

  

This log tracks the progress of the Angular modernization project from version 13 towards version 21.

  

<details>

<summary><strong>Angular 13 → 14</strong></summary>

  

### Summary

The initial upgrade from Angular 13 to 14 was performed using `ng update`. This phase focused on establishing a stable v14 base, resolving immediate template warnings, and adopting the new Typed Forms feature.

  

### Commit History

  

#### 1. Chore: Upgrade Angular 13 to 14 ([c68f708b](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/c68f708b))

- Executed `npx ng update @angular/core@14 @angular/cli@14 @angular-eslint/schematics@14`.

- This was followed by a `npx ng update @angular/cdk@14 @angular/material@14`.

  
  

#### 2. Fix: Remove Unnecessary Optional Chaining ([387be213](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/387be213))

-  **Action:** Cleaned up template code to resolve `NG8107` warnings.

-  **Reason:** Angular 14's improved template type checking flagged optional chaining (`?.`) on properties that are guaranteed to be defined (or where the parent is not null/undefined). This "chore" was necessary to clear the console of noise and ensure clean build outputs.


  

#### 3. Refactor: Migrate to Typed Reactive Forms ([3d36885e](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/3d36885e))

-  **Action:** Converted `UntypedFormControl`, `UntypedFormGroup`, etc., to their typed counterparts.

-  **Reason:** One of the major benefits of Angular 14. This improves type safety across the application and catches potential form-related errors at compile time.

  

#### 4. Fix: Update SettingsComponent Spec to Resolve Test Failures ([31aef4ab](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/31aef4ab))

-  **Action:** Fixed 3 failing tests in `settings.component.spec.ts` by providing missing mock data.

-  **Reason:** Removing `?.` in commit `031ef6a1` exposed that the test environment never provided a `meta` object to the component. Since `MockLoaderService` returns no `meta`, `this.meta` stayed `undefined` at render time, causing Angular's template engine to crash with `Cannot read properties of undefined (reading 'activityMeta')`. Added a `meta` stub on the component instance before `detectChanges()`, and provided a `GithubService` spy which was also missing from the test providers.
  

---


  

</details>

  

<details>

<summary><strong>Angular 14 → 15</strong></summary>

  

### Summary

The upgrade from Angular 14 to 15 involved multiple phases: a TypeScript prerequisite upgrade, the Angular core/CLI `ng update`, the Angular Material/CDK `ng update` (which auto-aliases all components to `mat-legacy-*`), a typography configuration fix, the full MDC migration using Angular's CLI schematics, manual resolution of all `TODO(mdc-migration)` comments, several rounds of CSS/template/component fixes for chips, sliders, form-fields, buttons, and dark-mode styling, test suite updates, and finally a full migration to standalone components (removing `AppModule` and `MaterialModule` entirely).

  

### Commit History

  

#### 1. Chore: Upgrade TypeScript to 4.8 ([24645b16](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/24645b16))

-  **Action:** Bumped `typescript` from `^4.6.4` to `^4.8.0` in `package.json`.

  

#### 2. Chore: Upgrade Angular Core & CLI to v15 ([6a433bbb](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/6a433bbb))

-  **Action:** Executed `npx ng update @angular/core@15 @angular/cli@15 @angular-eslint/schematics@15`.

-  **Key Changes:**

- All `@angular/*` core packages bumped from `^14.3.0` to `^15.2.10`.

-  `@angular-devkit/build-angular` bumped from `^14.2.13` to `^15.2.11`.

-  `@angular-eslint/*` packages bumped from `^14.4.0` to `^15.2.1`.

-  `@typescript-eslint/*` bumped from `^5.36.2` to `^5.43.0`.

-  `tsconfig.json`: `target` changed from `es2020` to `ES2022`, added `"useDefineForClassFields": false` (required by Angular 15's class field semantics).

-  `src/test.ts`: Removed deprecated `require.context()` bootstrapping; Angular 15's test builder auto-discovers spec files.

-  `angular.json`: Added `schematics` configuration for `@angular-eslint`.

-  **Files:**  `angular.json`, `package.json`, `package-lock.json`, `src/test.ts`, `tsconfig.json`

  

#### 3. Chore: Upgrade Angular Material & CDK to v15 ([a9999c51](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/a9999c51))

-  **Action:** Executed `npx ng update @angular/cdk@15 @angular/material@15`.

-  **Key Changes:**

-  `@angular/cdk` bumped from `^14.2.7` to `^15.2.9`.

-  `@angular/material` bumped from `^14.2.7` to `^15.2.9`.

-  **Auto-aliasing to `mat-legacy-*`:** The `ng update` schematic automatically rewrote all Material imports across the entire codebase to use legacy aliases (e.g., `MatButtonModule` → `MatLegacyButtonModule as MatButtonModule`). This is Angular Material 15's strategy for maintaining backward compatibility while introducing new MDC-based components.

-  **`material.module.ts`:** All 14 Material module imports were aliased (Button, List, Table, Chips, ProgressSpinner, Autocomplete, Input, Select, FormField, Card, Checkbox, Slider, etc.).

-  **Component files:** Dialog, Tooltip, Menu imports were aliased across `app.module.ts`, all modal components, all page components, all spec files, and the notification service.

-  **`custom-theme.scss`:**

-  `mat.core()` → `mat.legacy-core()`

-  `mat.all-component-themes()` → `mat.all-legacy-component-themes()`

- Added auto-generated `TODO(v15)` comment about typography migration

- Added `mat.all-legacy-component-typographies($custom-typography)`

-  **Files:** 24 files changed across `package.json`, `app.module.ts`, all component `.ts`/`.spec.ts` files, `material.module.ts`, `notification.service.ts`, `custom-theme.scss`

  

#### 4. Fix: Correct Typography Configuration & Theme Structure ([d354b9f5](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/d354b9f5))

-  **Action:**

- Replaced `mat.define-typography-level()` with `mat.define-legacy-typography-config($font-family: 'Roboto, Helvetica Neue, sans-serif')`.

- Reordered SCSS `@include` statements: `mat.legacy-core()` before `mat.all-legacy-component-typographies()`.

- Changed `mat.all-legacy-component-themes()` → `mat.all-legacy-component-colors()` (avoids re-emitting typography/density styles).


-  **Reason:** The original code used `mat.define-typography-level()` which produces a single level, not a full config map. Material silently ignored it and fell back to defaults. `Montserrat` was never rendered in production. Using `mat.define-legacy-typography-config()` fixes the signature, and Roboto preserves visual parity with the live site. The `all-legacy-component-colors()` mixin avoids duplicate typography emission when theme colors differ between light/dark modes.

-  **Files:**  `custom-theme.scss`, `docs/migration-doc.md`, `teams.component.html`, `teams.component.ts`

  

#### 5. Refactor: Run MDC Migration Schematics ([66c409cd](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/66c409cd))

-  **Action:** Executed `ng generate @angular/material:mdc-migration` to migrate all legacy components to MDC.

-  **Key Changes (38 files):**

-  **CSS:** Auto-generated `TODO(mdc-migration)` comments on rules targeting legacy internal classes (`.mat-slider-horizontal`, `.mat-chip-list`, `.mat-form-field-wrapper`, `.mat-card-header`, etc.)

-  **`custom-theme.scss`:**

-  `mat.legacy-core()` → `mat.core()`

-  `mat.all-legacy-component-typographies()` → `mat.all-component-typographies()`

-  `mat.all-legacy-component-colors()` → `mat.all-component-colors()`

- CSS selectors updated: `.mat-table` → `.mat-mdc-table`, `.mat-header-row` → `.mat-mdc-header-row`, `.mat-row` → `.mat-mdc-row`, etc.

-  **`styles.css`:** Slider rules updated with `TODO(mdc-migration)` comments.

-  **Note:** The CLI migration produced some duplicate `@include` calls and leftover `TODO` comments that were cleaned up in the next commit.

-  **Files:** 38 files across all components, specs, modules, theme, and global styles

  

#### 6. Fix: Resolve All MDC Migration TODOs ([d414cb90](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/d414cb90))

-  **Action:** Manually resolved every `TODO(mdc-migration)` comment generated by the CLI schematics, replacing legacy CSS selectors with their MDC-compliant equivalents.

-  **Files:** 15 files across `progress-slider`, `report-config-modal`, `circular-heatmap`, `mapping`, `matrix`, `settings` components + `custom-theme.scss` + `styles.css`

  

#### 7. Fix: Migrate Sidenav List Directives to MDC ([b8b39d4c](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/b8b39d4c))

-  **Action:** Updated `sidenav-buttons.component.html` to use MDC list directives.

-  **Key Changes:**

-  `mat-list-icon` → `matListItemIcon`,    `mat-line` → `matListItemTitle`

- Added component CSS for `[matListItemIcon]` with spacing overrides (`margin-right: 18px`, `margin-left: 22px`) to restore icon alignment matching the legacy layout.

-  **Reason:** The MDC `mat-list` uses structural directives (`matListItemIcon`, `matListItemTitle`, `matListItemLine`) instead of legacy attribute selectors (`mat-list-icon`, `mat-line`). The CLI migration schematic did not catch these in the sidenav component.

-  **Files:**  `sidenav-buttons.component.html`, `sidenav-buttons.component.css`

  

#### 8. Fix: Resolve Heatmap Chip Selection and Styling Issues ([769b63af](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/769b63af))

-  **Action:** Rewrote the circular heatmap's team filter chip logic and template to work correctly with MDC chips.

-  **Key Changes:**

-  **Template:** Removed wrapping `<mat-form-field>` from chip listboxes (MDC chips should not be inside form fields for selection-only use). Replaced with plain `<label>` + `<mat-chip-listbox>` structure. Added `<mat-divider>` separators. Changed filter toggle button from `mat-button` to `mat-icon-button`.

-  **TypeScript:** Completely rewrote `toggleTeamGroupFilter()` and `toggleTeamFilter()`:

-  **Reason:** The initial MDC migration (commits 5-6) broke chip filtering because the MDC `MatChipOption` API differs fundamentally from legacy `MatChip`. The old imperative `chip.toggleSelected()` + `(click)` pattern doesn't work with MDC's `(selectionChange)` event model, which fires *after* internal state is already updated. The form field wrapper also caused rendering issues because MDC chips render their own outline.

-  **Files:**  `circular-heatmap.component.html`, `circular-heatmap.component.ts`, `custom-theme.scss`

  

#### 9. Fix: Resolve Button, Input, and Panel CSS Issues ([8582349b](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/8582349b))

-  **Action:** Fixed broken styling across multiple components after the MDC migration.



-  **Reason:** MDC components use different DOM structures and default spacing than legacy components. The migration schematics update import paths and top-level selectors but cannot account for deep CSS customizations or layout assumptions built around legacy internal structures.

-  **Files:** 7 files across `add-evidence-modal`, `report-config-modal`, `team-selector`, `circular-heatmap`, `settings`, `custom-theme.scss`


### NOTE

- ⚠️ A few minor visual regressions were flagged after this manual UI change  (see [Backlog](#backlog) below).

-  Decision: **move ahead with the next upgrade cycle (Angular 15 → 16 → ... → 21)** and track the remaining visual polish items as backlog.

  

#### 10. Fix: Resolve Matrix Chip Selection and Rendering Issues ([30aa3ee1](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/30aa3ee1))

-  **Action:** Fixed the Matrix page's chip filters and table rendering.


-  **Reason:** The Matrix page had the same chip API incompatibility as the heatmap. Additionally, the `<div>` inside `<table>` rendered silently under legacy Material but broke under MDC's stricter DOM expectations.

-  **Files:**  `matrix.component.css`, `matrix.component.html`, `matrix.component.ts`

  

#### 11. Fix: Update Matrix Spec to Use MatChipSelectionChange API ([9970e77e](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/9970e77e))

-  **Action:** Updated `matrix.component.spec.ts` to match the new `MatChipSelectionChange` event-based API.


-  **Reason:** The component's filter functions now accept `MatChipSelectionChange` events instead of `MatChip` instances, and use `setTimeout()` internally. Tests needed `fakeAsync`/`tick` to properly exercise the async filter logic.

-  **Files:**  `matrix.component.spec.ts`

  

#### 12. Refactor: Migrate All Components to Standalone ([9ec0c58f](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/9ec0c58f))

-  **Action:** Converted every component, directive, and pipe in the application to `standalone: true`, then deleted `AppModule` and `MaterialModule`.


-  **Reason:** Angular 15 is the first version to support standalone components as stable. Migrating removes the centralized `AppModule` / `MaterialModule` barrel pattern, enabling:

-  **Files:** 52 files — all components, directives, pipes, specs, `main.ts`

  

</details>

  

<details>

<summary><strong>Angular 15 → 16</strong></summary>

  

### Summary

A straightforward upgrade. No breaking changes affected this codebase. The migration was limited to dependency bumps, a sidenav icon color fix, and cleaning up a deprecated CLI flag.

  

### Commit History

  

#### 1. Chore: Upgrade TypeScript to 4.9 ([f18ec072](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/f18ec072))

-  Bumped `typescript` from `^4.8.0` to `^4.9.3` (minimum required by Angular 16).

  

#### 2. Chore: Upgrade Angular Core & CLI to v16 ([82b79fc3](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/82b79fc3))

-  Executed `ng update @angular/core@16 @angular/cli@16 @angular-eslint/schematics@16`. Zone.js bumped to `~0.13.3`.

  

#### 3. Chore: Upgrade Angular Material & CDK to v16 ([a6bac0aa](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/a6bac0aa))

-  Executed `ng update @angular/material@16 @angular/cdk@16`.

  

#### 4. Fix: Apply Primary Color to All Sidenav Icons ([afb3d58f](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/afb3d58f))

-  Ensured all navigation icons use the theme's primary color consistently.

  

#### 5. Fix: Replace Deprecated `--prod` Flag ([fe8893be](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/fe8893be))

-  Replaced `ng build --aot --prod` with `ng build --configuration=production` in the `heroku-postbuild` script. The `--prod` flag was removed in Angular CLI v12+.

---

</details>

<details>
<summary><strong>Angular 16 → 17</strong></summary>

### Summary

A relatively smooth upgrade. Core, CLI, Material, CDK, and ESLint were bumped to v17. The MDC theme required replacing auto-generated TODO placeholders with the proper `all-component-themes` mixin. A few CSS regressions on buttons and info icons were fixed using MDC CSS variables. Spec files needed minor updates for `RouterTestingModule` deprecation and `MatChip` becoming standalone. ESLint deps were cleaned up to resolve peer conflicts introduced by the upgrade. Ended with a Prettier 3 reformat. Commit messages are detailed with more information about the specific changes.

---

</details>

  

<details>
<summary><strong>Angular 17 → 18 + Complete UI Revamp</strong></summary>

  

### Summary

Upgraded Angular Core, CLI, Material, and CDK to v18. TypeScript version pinning was tightened (`^` → `~`). An ESLint 18 warning required renaming the `cancel` output binding to `cancelEdit` across 3 files. Material 18 introduced the M3 theming system. The custom theme was regenerated via the CLI (`ng generate @angular/material:m3-theme`) and the `custom-theme.scss` file was refactored to unify dark/light mode overrides. Multiple UI component fixes followed to align with M3's updated DOM structure and default styles.

  

### Commit History

  

#### 1. Chore: Pin TypeScript Ranges in `package-lock.json` ([959bb88f](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/959bb88f))

- Converted `^` (caret) ranges to `~` (tilde) in `package-lock.json` for tighter version pinning.

  

#### 2. Chore: Upgrade Angular Core & CLI to v18 ([18fafd7f](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/18fafd7f))

- Executed `ng update @angular/core@18 @angular/cli@18`.

  

#### 3. Fix: Rename `cancel` Output to `cancelEdit` ([8859ce34](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/8859ce34))

- Renamed `cancel` → `cancelEdit` across 3 files.
- **Reason:** ESLint 18 warning — output bindings (including aliases) should not be named as standard DOM events.

  

#### 4. Chore: Upgrade Angular Material & CDK to v18 ([1575ec8c](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/1575ec8c))

- Executed `ng update @angular/material@18 @angular/cdk@18`.

  

#### 5. Chore: Generate M3 Theme via CLI ([58b77590](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/58b77590))

- Ran `ng generate @angular/material:m3-theme` to scaffold the new M3 theme configuration.

  

#### 6. Fix(UI): Sidenav Component ([d9b526e4](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/d9b526e4))

- Fixed sidenav styling for M3 compatibility.

  

#### 7. Fix(UI): Matrix Page Icons ([b7eb30be](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/b7eb30be))

- Fixed icon rendering on the Matrix page.

  

#### 8. Refactor: Unify Dark/Light Theme Overrides ([2514ae93](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/2514ae93))

- Cleaned up `custom-theme.scss` — consolidated duplicate styles that were identical across dark and light themes into shared rules.

  

#### 9. Fix(UI): Mat-Chips ([ae994674](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/ae994674))

- Fixed chip styling for M3.

  

#### 10. Fix(UI): Mat-Expansion-Panel ([8ddcc878](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/8ddcc878))

- Fixed expansion panel styling for M3.

  

#### 11. Fix(UI): Mat-Button ([7e7a4411](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/7e7a4411))

- Fixed button styling for M3.

  

#### 12. Fix(UI): Mat-Accordion Trailing Line ([dae53b67](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/dae53b67))

- Removed trailing line artifact from accordion panels.

  

#### 13. Fix(UI): MatDialog Pop-Up Modal ([fdaa7db8](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/fdaa7db8))

- Fixed dialog/modal styling for M3.

  

#### 14. Fix(UI): Mat-Slider ([6185748f](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/6185748f))

- Fixed slider styling for M3.

  

#### 15. Chore: Remove Unnecessary Comments ([6f10efda](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/6f10efda))

- Removed obvious/redundant comments from the codebase.

  

#### 16. Chore: Pin All Dependency Versions ([f1ec329](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/f1ec329))

- Removed `~` and `^` ranges from every dependency for strict version pinning + regression fix.

  

#### 17. Refactor: Standardize MatDialog Sizing ([b95e65c2](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/b95e65c2))

- Introduced semantic size tiers for `MatDialog` width/height, replacing scattered hard-coded pixel values with a centralized sizing utility.

  

#### 18. Fix: Remove Redundant Mat-Select Global Styles ([b2361d88](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/b2361d88))

- Removed unused `mat-select` CSS overrides from global styles: the rules were not being applied and the default M3 background color is already appropriate.

  

#### 19. Chore: Bump markdown-it Dependencies ([ff70f84d](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/ff70f84d))

- Bumped `markdown-it` and `@types/markdown-it` to their latest versions.


---

</details>

  

---

## Signal Migration

Each component toggle below documents a single commit.

  

<details>

<summary><strong>MatrixComponent</strong> (<a href="https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/2f020c46">2f020c46</a>)</summary>

  

- Converted `levels`, `filtersTag`, `filtersDim`, `columnNames`, and `MATRIX_DATA` from plain properties to `signal()`.
- Replaced the imperative `updateActivitiesBeingDisplayed()` method with a single `dataSource = computed()` that derives filtered rows automatically whenever `MATRIX_DATA`, `filtersTag`, or `filtersDim` change.
- Removed `MatTableDataSource` wrapper and `deepCopy()` call — `computed()` already produces a fresh derivation on every dependency change.
- Filter chip handlers (`toggleTagFilters` / `toggleDimensionFilters`) now call `signal.update()` instead of mutating a plain object, and no longer need to manually trigger a re-filter.
- `buildMatrixData()` takes `allDimensionNames` as a parameter instead of reading a class property, since it was previously only used once during init.
- **Files:** `matrix.component.ts`, `matrix.component.html`, `matrix.component.spec.ts`

</details>

  

<details>

<summary><strong>ThemeService & TitleService</strong> (<a href="https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/408342c3">408342c3</a>)</summary>

  

**Services**

- `ThemeService.theme` changed from `BehaviorSubject<AppTheme>` → `signal<AppTheme>`. A `toObservable()` bridge (`theme$`) is kept for any remaining subscribers.
- `TitleService.titleInfo` changed from `BehaviorSubject<TitleInfo | null>` → `signal<TitleInfo | null>`, with the same `toObservable()` bridge.

**Consumers**

- `AppComponent`: Replaced manual `subscribe()` + instance properties for `title` / `subtitle` with `computed()` values that read directly from `TitleService.titleInfo()`.
- `SidenavButtonsComponent`: Replaced `subscribe()` on `ThemeService.theme$` with `isNightMode = computed(() => themeService.theme() === 'dark')`.
- Both consumers no longer need `OnDestroy` / manual unsubscribe logic.
- **Files:** `theme.service.ts`, `title.service.ts`, `app.component.ts`, `app.component.html`, `app.component.spec.ts`, `sidenav-buttons.component.ts`, `sidenav-buttons.component.html`, `sidenav-buttons.component.spec.ts` (8 files, −56 / +50)

</details>

  

<details>

<summary><strong>ReportComponent & ReportConfigModalComponent</strong> (<a href="https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/44480759">44480759</a>)</summary>

  

**ReportComponent**

- `reportConfig` and `allActivities` converted to `signal()`.
- `filteredDimensions`, `levelByLevelOverviewFromActivties`, and `totalFilteredActivities` are now `computed()` values that automatically re-derive when `reportConfig` or `allActivities` change — no manual refresh calls needed.
- Config changes from the modal or team selector write back via `signal.set()`.

**ReportConfigModalComponent**

- `config` converted to `signal<ReportConfig>`, deep-copied from dialog input on construction.
- `filteredActivities` and `hasAnyMarkdownAttribute` are `computed()` values.
- `activitySearchQuery` is a `signal('')` driving the `filteredActivities` computation.
- **Files:** `report.component.ts`, `report.component.html`, `report-config-modal.component.ts`, `report-config-modal.component.html` (4 files)

</details>

  

---

## Backlog

  

Known issues deferred from the Angular 14 → 15 migration. These should be addressed alongside or after the upgrade to Angular 21.

| # | Component | Issue | Priority | Notes |
|---|-----------|-------|----------|-------|



> [!NOTE]

> Add new backlog items here as they are discovered during future upgrades. Remove items once resolved.
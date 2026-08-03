
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

  

<details>
<summary><strong>Angular 18 → 20</strong></summary>

### Summary

Two clean version bumps (19, then 20) across Core, CLI, Material, and CDK, interspersed with a Control Flow migration, a chip filter loop fix, an RxJS upgrade for bundler module resolution, and a dialog theming fix.

- Upgraded Core & CLI to v19, then Material & CDK to v19.
- Migrated templates to the new Control Flow syntax (`ng generate @angular/core:control-flow`).
- Removed unnecessary `this.` prefix when accessing template reference variables.
- Fixed an infinite filter loop by switching chip listboxes from `(selectionChange)` to `(change)`.
- Bumped `@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser` to `8.62.1`.
- Upgraded Core & CLI to v20, then Material & CDK to v20.
- Upgraded `rxjs` to `7.8.1` and switched to `moduleResolution: bundler` (rxjs 7.5.0 lacked an `exports` field required for bundler resolution).
- Fixed dialog surface background override (Material now paints background via `--mat-dialog-container-color` on `.mat-mdc-dialog-surface`, not `.mat-mdc-dialog-container`).
- Migrated constructor DI to the `inject()` function across the codebase (`ng generate @angular/core:inject`), resolving all `@angular-eslint/prefer-inject` lint errors.
- Updated CI workflow to run on Node.js 20 instead of 18.

---

</details>

<details>
<summary><strong>Angular 20 → 21 + Dependency Security Audit</strong></summary>

### Summary

Two straightforward `ng update` passes (Core/CLI, then Material/CDK) to reach Angular 21, followed by a round of test fixes required by Angular 21's stricter TestBed change-detection error rethrow (`NG0100`), and a full dependency security audit that dropped vulnerability count from 33 to 1.

### Commit History

#### 1. Chore: Upgrade Angular Core & CLI to v21 ([186d547a](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/186d547a))
- Executed `ng update @angular/core@21 @angular/cli@21`.

#### 2. Chore: Upgrade Angular Material & CDK to v21 ([fe574695](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/fe574695))
- Executed `ng update @angular/material@21 @angular/cdk@21`.

#### 3. Fix: Resolve NG0100 Test Failures from Angular 21 TestBed Error Rethrow ([da2bdb34](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/da2bdb34))
- **Action:** Fixed test failures surfaced by Angular 21's stricter enforcement around change-detection errors during `TestBed` runs.
- **Key Changes:**
  - `progress-slider.component.spec.ts`, `top-header.component.spec.ts`: Moved `fixture.detectChanges()` out of the shared `beforeEach()` into each individual test, since a global `detectChanges()` call before test-specific state was set (e.g. `component.state`) caused a second, differing `detectChanges()` later in the same test to throw `NG0100`.
  - `teams.component.spec.ts`: Pre-loaded mock data via `mockLoaderService.load()` before component creation and now sets it synchronously with `setYamlData()` prior to the first `detectChanges()`, resolving an async `NG0100` caused by data arriving after the component's first render.
  - `usage.component.ts`: Added a null guard (`if (page && page.match(...))`) before the CWE-79 sanitization check, since `params['page']` could be `undefined` on some routes.
  - `main.ts`: Removed unused `ReactiveFormsModule` / `FormsModule` imports left over from the standalone migration.
- **Files:** `progress-slider.component.spec.ts`, `top-header.component.spec.ts`, `teams.component.spec.ts`, `usage.component.ts`, `main.ts`

#### 4. Chore: Remove Unused Grafana SDK, Patch Vulnerabilities via Bumps/Overrides (33→1) ([2a14047e](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/2a14047e))
- **Action:** Ran a full dependency security audit against `package.json`.
- **Key Changes:**
  - Removed `@grafana/faro-web-sdk` and `@grafana/faro-web-tracing`, unused anywhere in `src/`. Eliminated ~20 vulnerabilities on its own by dropping the entire `@opentelemetry/*` stack 
  - Bumped `js-yaml` 4.1.0 → 4.3.0
  - Bumped `yaml` 2.8.1 → 2.9.0
  - Bumped `@types/node` 12.11.1 → 20.19.0 (dev-only types, years out of date).
  - Bumped `karma` 6.3.0 → 6.4.4 (satisfies Angular 21's `karma@^6.4.0` peer dependency, clearing an `ERESOLVE` warning).
  - Bumped `prettier-eslint` 16.3.0 → 17.1.1 (drops its bundled EOL ESLint 8, clearing 3 deprecation warnings and a vulnerable `minimatch`).
  - Bumped `qs` 6.11.0 → 6.15.3
  - Added an `overrides` entry pinning `uuid` to `11.1.1` across the tree, fixing a buffer bounds-check issue nested inside Angular's own build tooling (`webpack-dev-server → sockjs → uuid@8.3.2`).
  - Also bumped `@ngneat/until-destroy`, `d3`, `markdown-it`, `rxjs`, and `prettier` as part of the same pass.
- **Result:** Vulnerabilities reduced from 33 → 1. The one remaining issue is an unfixable `xlsx`/SheetJS ReDoS + prototype pollution vulnerability, deferred to a future PR since resolving it requires code changes wherever `xlsx` is imported.
- **Files:** `package.json`, `package-lock.json`

 Vulnerability Reduction

| Stage | Vulnerabilities | Deprecation Warnings |
|-------|:-:|:-:|
| Starting point (Angular 21) | 33 | 5 |
| After Grafana removal | 14 | 5 |
| After `npm audit fix` + bumps | 9 | 4 |
| After `uuid` override | 4 | 3 |
| After `prettier-eslint` bump + `minimatch` override removed | **1** | **0** |


#### 5. Chore: Remove unused deps and migrate test env to static platform ([431328a](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/431328a))
- Removed `@angular/platform-browser-dynamic` (runtime + types) after completing the `bootstrapApplication` migration in `main.ts`.
- Dropped unused packages: `js-yaml`, `@types/js-yaml`, `@types/node`, `@angular-eslint/schematics`, `@typescript-eslint/eslint-plugin`, `prettier-eslint`, `qs`.
- Bumped `@typescript-eslint/parser` to `8.64.0`.
- Migrated `test.ts` from `BrowserDynamicTestingModule` to `BrowserTestingModule` (static platform).

#### 6. Chore(deps): Remove `@angular/animations` ([d55c9b8](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/d55c9b8))
- Removed `@angular/animations` package and all related imports (`provideAnimations`, `BrowserAnimationsModule`, `NoopAnimationsModule`) from `main.ts` and test specs.

#### 7. Chore: Migrate build toolchain from `@angular-devkit/build-angular` to `@angular/build` ([a7e3cf6](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/a7e3cf6))
- Switched build, serve, and extract-i18n builders to the leaner `@angular/build` package (esbuild/Vite only, no Webpack baggage).
- Karma test builder remains on `@angular-devkit/build-angular` (karma plugin not available in `@angular/build`).

#### 8. Chore: Approve install scripts for build toolchain dependencies ([426666c](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/426666c))
- Allowlisted `esbuild`, `lmdb`, `msgpackr-extract`, `@parcel/watcher` install scripts in both npm (`allowScripts`) and pnpm (`pnpm-workspace.yaml` `allowBuilds`).
- Moved `uuid` override into `pnpm-workspace.yaml` for pnpm v11 compatibility.

---

</details>

<details>
<summary><strong>Angular 21 → 22 + Karma → Vitest Migration</strong></summary>

### Summary

Upgraded Core, CLI, Material, and CDK to v22 via `ng update`, which auto-applied several breaking-change migrations in one pass, most notably the Karma → Vitest test-runner migration. The Karma→Vitest switch itself was schematic-driven and happened as part of this single `ng update` commit; the follow-up commit afterward was purely manual cleanup to make the auto-migrated Vitest setup actually pass -- converting remaining Jasmine-specific APIs, removing a legacy `test.ts` double-init crash, and dropping now-dead Karma devDependencies. Also migrated ESLint config to the new flat-config format, and did a full pnpm-workspace round trip (removed, then restored) to work through lockfile regeneration under the new toolchain.

### Commit History

#### 1. Chore: Remove `pnpm-workspace.yaml` and `package-lock.json` ([94dd8ab](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/94dd8ab6485fa987c4ab7dee0de44707d03e98a3))
- Cleared out the pnpm workspace config and lockfile ahead of the Angular 22 upgrade, to avoid stale resolution conflicts during `ng update`.

#### 2. Feat: Upgrade Angular 21 → 22 via `ng update` ([38eac6bc](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/38eac6bc45c5304885d1fe057b8a06789cf06b5f))
- Ran `ng update @angular/core@22 @angular/cli@22`.
- **Auto-applied migrations:**
  - Core packages `21.x` → `22.1.0`, TypeScript `5.9` → `6.0`.
  - **Karma → Vitest test runner** (schematic-migrated `angular.json` and `tsconfig.spec.json`; see nested log below for the full interactive migration summary).
<details>
<summary>Full <code>ng update</code> Migration Log</summary>

```bash
npx ng update @angular/core@22 @angular/cli@22 
The installed Angular CLI version is outdated.
Installing a temporary Angular CLI versioned 22 to perform the update.
Using package manager: npm
	Collecting installed dependencies...
	Found 42 dependencies.
	Fetching dependency metadata from registry...
	    Package "@angular-eslint/builder" has an incompatible peer dependency to "@angular/cli" (requires ">= 21.0.0 < 22.0.0", would install "22.1.2").
	Updating package.json with dependency @angular/cli to version 22.1.2...
	Updating package.json with dependency @angular/common to version 22.1.0...
	Updating package.json with dependency @angular/compiler to version 22.1.0...
	Updating package.json with dependency @angular/core to version 22.1.0...
	Updating package.json with dependency @angular/forms to version 22.1.0...
	Updating package.json with dependency @angular/localize to version 22.1.0...
	Updating package.json with dependency @angular/platform-browser to version 22.1.0...
	Updating package.json with dependency @angular/router to version 22.1.0...
	Updating package.json with dependency @angular-devkit/build-angular to version 22.1.2...
	Updating package.json with dependency @angular/build to version 22.1.2...
	Updating package.json with dependency @angular/compiler-cli to version 22.1.0...
	Updating package.json with dependency typescript to version 6.0.3...
	✔ Cleaning node modules directory
✔ Installing packages
** Executing migrations of package '@angular/cli' **

❯ Add 'istanbul-lib-instrument' to 'devDependencies' if Karma unit testing is used.
UPDATE package.json (2151 bytes)
✔ Packages installed successfully.
  Migration completed (1 file modified).

❯ Add 'trustProxyHeaders' configuration to 'AngularNodeAppEngine' or 'AngularAppEngine'.
  For more information see: https://angular.dev/best-practices/security#configuring-trusted-proxy-headers
  Migration completed (No changes made).

❯ Update the angular workspace configuration.
  Migration completed (No changes made).

** Optional migrations of package '@angular/cli' **

This package has 2 optional migrations that can be executed.
Optional migrations may be skipped and executed after the update process, if preferred.

Select the migrations that you'd like to run [migrate-karma-to-vitest] Migrate projects using legacy Karma unit-test builder to the new unit-test builder with Vitest., [use-application-builder] Migrate application projects to the new build system. (https://angular.dev/tools/cli/build-system-migration)

❯ Migrate projects using legacy Karma unit-test builder to the new unit-test builder with Vitest.
    Project "DSOMM" uses the "kjhtml" reporter. This has not been automatically mapped. For an interactive test UI in Vitest, consider setting the "ui" option to true in your test target options and installing "@vitest/ui".
    Project "DSOMM" uses a custom Karma configuration file "karma.conf.js". Tests have been migrated to use Vitest, but you may need to manually migrate custom settings from this Karma config to a Vitest config (e.g. "vitest-base.config.ts") and set the "runnerConfig" option to true.
    Project "DSOMM" uses a "main" entry file for tests: "src/test.ts". This has been mapped to the unit-test builder "setupFiles" array. Please ensure you remove any TestBed.initTestEnvironment calls from this file as the builder now handles test environment initialization automatically.

    --- Karma to Vitest Migration Summary ---
    Projects migrated: 1
      - DSOMM
    Projects skipped (non-applications): 0
    Projects skipped (missing application builder): 0

    The following Karma configuration files require manual migration:
      - karma.conf.js

    Note: To refactor your test files from Jasmine to Vitest, consider running the following command:
      ng g @schematics/angular:refactor-jasmine-vitest <project_name>
    -----------------------------------------

UPDATE tsconfig.spec.json (316 bytes)
UPDATE angular.json (4503 bytes)
UPDATE package.json (2175 bytes)
✔ Packages installed successfully.
  Migration completed (3 files modified).

❯ Migrate application projects to the new build system.
  Application projects that are using the '@angular-devkit/build-angular' package's 'browser' and/or 'browser-esbuild' builders will be migrated to use the new 'application' builder.
  You can read more about this, including known issues and limitations, here: https://angular.dev/tools/cli/build-system-migration
    Package dependency "@angular/build" already exists with a different specifier. "22.1.2" will be replaced with "^22.1.2".
UPDATE package.json (2129 bytes)
UPDATE tsconfig.json (853 bytes)
✔ Packages installed successfully.
  Migration completed (2 files modified).

** Executing migrations of package '@angular/core' **

❯ Adds the required third argument to canMatch callsites.
  Migration completed (No changes made).

❯ Adds `ChangeDetectionStrategy.Eager` to all components.
UPDATE src/app/component/sidenav-buttons/sidenav-buttons.component.ts (1797 bytes)
UPDATE src/app/component/logo/logo.component.ts (308 bytes)
UPDATE src/app/app.component.ts (2036 bytes)
UPDATE src/app/component/markdown-viewer/markdown-viewer.component.ts (1051 bytes)
UPDATE src/app/component/top-header/top-header.component.ts (379 bytes)
UPDATE src/app/pages/about-us/about-us.component.ts (548 bytes)
UPDATE src/app/pages/userday/userday.component.ts (691 bytes)
UPDATE src/app/component/modal-message/modal-message.component.ts (3007 bytes)
UPDATE src/app/component/team-selector/team-selector.component.ts (1986 bytes)
UPDATE src/app/component/add-evidence-modal/add-evidence-modal.component.ts (3449 bytes)
UPDATE src/app/component/evidence-panel/evidence-panel.component.ts (1987 bytes)
UPDATE src/app/component/view-evidence-modal/view-evidence-modal.component.ts (1123 bytes)
UPDATE src/app/component/progress-slider/progress-slider.component.ts (1429 bytes)
UPDATE src/app/component/dependency-graph/dependency-graph.component.ts (14543 bytes)
UPDATE src/app/component/activity-description/activity-description.component.ts (5712 bytes)
UPDATE src/app/pages/circular-heatmap/circular-heatmap.component.ts (28914 bytes)
UPDATE src/app/pages/mapping/mapping.component.ts (7833 bytes)
UPDATE src/app/pages/matrix/matrix.component.ts (8724 bytes)
UPDATE src/app/pages/activity-description/activity-description-page.component.ts (3058 bytes)
UPDATE src/app/pages/usage/usage.component.ts (1069 bytes)
UPDATE src/app/component/teams-groups-editor/selectable-list.component.ts (3225 bytes)
UPDATE src/app/component/teams-groups-editor/teams-groups-editor.component.ts (9079 bytes)
UPDATE src/app/component/kpi/kpi.component.ts (441 bytes)
UPDATE src/app/pages/teams/teams.component.ts (10601 bytes)
UPDATE src/app/pages/roadmap/roadmap.component.ts (691 bytes)
UPDATE src/app/pages/settings/settings.component.ts (13650 bytes)
UPDATE src/app/component/report-config-modal/report-config-modal.component.ts (5647 bytes)
UPDATE src/app/pages/report/report.component.ts (17284 bytes)
UPDATE src/app/component/activity-description/activity-description.component.spec.ts (6418 bytes)
  Migration completed (29 files modified).

❯ Adds 'withXhr' to 'provideHttpClient' function calls when the 'HttpXhrBackend' is used.
  For more information see: https://angular.dev/api/common/http/withXhr
UPDATE src/main.ts (1949 bytes)
UPDATE src/app/component/markdown-viewer/markdown-viewer.component.spec.ts (938 bytes)
UPDATE src/app/component/sidenav-buttons/sidenav-buttons.component.spec.ts (2493 bytes)
UPDATE src/app/pages/about-us/about-us.component.spec.ts (890 bytes)
UPDATE src/app/pages/matrix/matrix.component.spec.ts (3621 bytes)
UPDATE src/app/pages/roadmap/roadmap.component.spec.ts (889 bytes)
UPDATE src/app/pages/teams/teams.component.spec.ts (2085 bytes)
UPDATE src/app/pages/usage/usage.component.spec.ts (1388 bytes)
UPDATE src/app/pages/userday/userday.component.spec.ts (889 bytes)
UPDATE src/app/service/loader/data-loader.service.spec.ts (866 bytes)
  Migration completed (10 files modified).

❯ Adds withNoIncrementalHydration() opt out to provideClientHydration() when incremental hydration is not enabled to retain pre-v22 behavior.
  Migration completed (No changes made).

❯ Migrate broken duplicate outputs.
  Migration completed (No changes made).

❯ Wraps optional chaining expressions in $safeNavigationMigration().
UPDATE src/app/component/activity-description/activity-description.component.html (15152 bytes)
UPDATE src/app/pages/teams/teams.component.html (4143 bytes)
UPDATE src/app/pages/settings/settings.component.html (11256 bytes)
  Migration completed (3 files modified).

❯ Disables the 'nullishCoalescingNotNullable' & 'optionalChainNotNullable' extended diagnostics.
UPDATE tsconfig.app.json (518 bytes)
UPDATE tsconfig.spec.json (491 bytes)
  Migration completed (2 files modified).

❯ Adds 'strictTemplates: false' in tsconfig.json when not set.
  Migration completed (No changes made).
```

</details>

#### 3. Refactor: Migrate ESLint to Flat Config ([1bd805a](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/1bd805addef8a9753b8172b4d198a13bc737184c))
- Replaced `.eslintrc.json` with `eslint.config.js`.
- Added `angular-eslint` and `typescript-eslint` packages required by the flat-config format.
- Removed now-unnecessary `eslint-disable` comments that were previously masking rule mismatches under the legacy config.

#### 4. Fix: Complete Angular 22 Migration Follow-Up ([aba84690](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/aba8469083f2e1ae6c53b86271a55d7da5aeae7e))
- **Action:** Finished what `ng update`'s auto-migration left incomplete after the Karma→Vitest schematic ran.
- **Key Changes:**
  - Migrated remaining Jasmine APIs to their Vitest equivalents: `spyOn` → `vi.spyOn`, `toHaveSize` → `toHaveLength`, `toBeTrue` → `toBe(true)`, `jasmine.createSpyObj` → `vi.fn()`-based mock objects.
  - Removed the lingering `setupFiles` reference to the legacy `src/test.ts`, which was causing a double test-environment-init crash under Vitest.
  - Removed `withXhr()` calls from `main.ts` and all spec files. (added by the auto-migration but not actually needed once the HTTP backend config was reviewed)
  - Dropped now-dead devDependencies: `@types/jasmine`, `jasmine-core`, `karma`, `karma-*`, `istanbul-lib-instrument`.
  - Added `jsdom` as the Vitest DOM environment.
- **Reason:** The `ng update` schematic migrates the *build config* (`angular.json`, `tsconfig.spec.json`) from Karma to Vitest automatically, but it doesn't rewrite test *code*.

#### 5. Chore: Restore pnpm Workspace Config and Update Lockfile ([6d73c45a](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/6d73c45a2d3dda1b2d084989ea2826009132f5e4))
- Restored `pnpm-workspace.yaml` with `allowBuilds` configuration.
- Removed the now-unneeded `uuid` override from `package.json`.
- Regenerated `package-lock.json` following the Angular 22 upgrade.

#### 6. Chore: Lint Fix ([fdff1564](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/fdff15647df63f82c47bdb6d5210af741080e356))
- Final lint cleanup pass after the flat-config and Vitest migrations settled.

#### 7. Chore: Upgrade CI to Node.js 24 and Pin Vitest/ESLint-Utils Versions ([0a22f7e0](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/0a22f7e0eafb2a18f739b62ef03e45e6319e35e5))
- Bumped CI Node.js version from `20.19.6` to `24.19.0` (latest).
- Dropped `--browsers=ChromeHeadless` from the CI test command. No longer needed now that tests run under Vitest instead of Karma.
- Pinned `@typescript-eslint/utils` and `vitest` to exact versions (`8.65.0`, `4.0.8`) 
- **Files:** `.github/workflows/tests.yml`, `package.json`

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

<details>

<summary><strong>CircularHeatmapComponent</strong> (<a href="https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/d7abc966">d7abc966</a>)</summary>

- Full signal migration: `filtersTeams`, `filtersTeamGroups`, `teamGroups`, `allSectors`, `selectedSector`, `showOverlay`, `showFilters`, `showActivityCard`, `showActivityDetails`, and `dataStore` converted from plain properties to `signal()`.
- `hasTeamsFilter` derived as `computed()` from `filtersTeams` (no manual bookkeeping)
- Replaced `ngOnInit` + `requestAnimationFrame` hack with `afterNextRender` (Angular 17+ DOM-ready API).
- Replaced `themeService.theme$` RxJS subscription with an `effect()` tracking the `ThemeService.theme` signal for reactive heatmap repaint.
- Dissolved `destroy$` Subject / `takeUntil` / `OnDestroy`: teardown handled by `DestroyRef` (`destroyRef.onDestroy()` and `takeUntilDestroyed()`).
- Extracted `readThemeColors()` helper to DRY up CSS custom property reads (previously duplicated in init and theme subscriber).
- Group chip filter switched from listbox-level `(change)` to per-chip `(selectionChange)` with `MatChipSelectionChange` — prevents deselection of the active group chip via a three-tier guard (`isUserInput` check → programmatic deselection ignore → already-active check).
- **Bug fix:** Replaced `equalArray()` with set-based comparison for group highlight, fixing order-sensitive mismatch between chip/DOM order and YAML declaration order.
- **Bug fix:** All filter mutations now create new object references via `.set()`, fixing the `keyvalue` pipe caching bug that caused group-selected teams to be silently dropped on subsequent single-chip clicks.
- **Bug fix:** Group chip deselection no longer leaves stale team selections — the per-chip `(selectionChange)` handler prevents visual deselection entirely.
- D3 click/hover handlers updated to use `signal.set()` for `selectedSector`, `showActivityCard`.
- Template updated: all signal properties called with `()` in bindings.
- **Files:** `circular-heatmap.component.ts`, `circular-heatmap.component.html`

</details>

<details>

<summary><strong>MappingComponent, SettingsComponent & TeamsComponent</strong> (<a href="https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/d0089a97">d0089a97</a>)</summary>

**MappingComponent**
- `allTeams`, `dataStore`, and `searchTerms` converted from plain properties to `signal()`.
- Search-term chip handlers (`removeSearchTerm`, `clearFilter`) and `onSearchKeydown` now use `.update()` / `.set()` instead of direct array mutation.
- `setYamlData()` writes `dataStore` and `allTeams` via `.set()`.
- Template updated: `searchTerms()`, `allTeams()`, `dataStore()` called as functions, including the optional-chained `dataStore().progressStore?.getTeamActivityTitle(...)`.

**SettingsComponent**
- `meta`, `dataStoreMaxLevel`, `selectedMaxLevel`, `selectedMaxLevelCaption`, `editingProgressDefinitions`, `remoteReleaseCheck`, and `selectedDateFormat` converted to `signal()`.
- Removed unused `GithubReleaseInfo` import and dead `checkingLatest` / `latestReleaseInfo` / `latestCheckError` / `isNewerAvailable` / `latestDownloadUrl` / `latestReleasePublishedDate` fields. These were leftover state never wired to the template, superseded by `remoteReleaseCheck`.
- `checkForLatestRelease()` rewritten to build the release-check result via local variables (`latestRelease`, `checkError`) and commit them in a single `.update()`/`.set()` call per branch, instead of mutating individual `remoteReleaseCheck` fields in place across try/catch/finally.
- `onMaxLevelChange`, `updateMaxLevelCaption`, `toggleProgressDefinitionsEdit`, `saveProgressDefinitions`, `resetProgressDefinitions` updated to read/write via signal `()`/`.set()`/`.update()`.
- Template updated: all signal properties called with `()`, including `meta()?.activityMeta?.getDsommVersion()` and `remoteReleaseCheck().latestRelease?.tagName`-style chains.
- Spec updated: `component.meta.set({...})` and `component.selectedMaxLevel()` assertions.

**TeamsComponent**
- `dataStore`, `canEdit`, `teams`, `teamGroups`, `progressTitleImplemented`, `infoTitle`, `infoTeams`, `info`, `allColumnNames`, and `progressColumnNames` converted to `signal()`.
- `onSelectionChanged` and `onTeamsChanged` reworked to derive a new `info`/`currentInfo` object and commit it via `.set()`, rather than mutating the existing record in place (avoids the same stale-reference class of bug fixed in the heatmap migration).
- `setYamlData()`, `updateColumnNames()`, `onExportTeamGroups()`, `onResetTeamGroups()`, `makeTeamSummary()` updated to read signals via `()`.
- Template updated: `teams()`, `teamGroups()`, `canEdit()`, `dataStore()`, `infoTitle()`, `infoTeams()`, `info()`, `allColumnNames()`, `progressColumnNames()` called as functions throughout.
- Spec updated: `component.teams()`, `component.teamGroups()` assertions.

- **Files:** `mapping.component.ts`, `mapping.component.html`, `settings.component.ts`, `settings.component.html`, `settings.component.spec.ts`, `teams.component.ts`, `teams.component.html`, `teams.component.spec.ts` (8 files)

</details>

<details>

<summary><strong>Zoneless application and tests</strong></summary>

- The application now uses `provideZonelessChangeDetection()` instead of `provideZoneChangeDetection()`.
- Removed `zone.js` from the application dependencies and from the build/test polyfills, including the `zone.js/testing` test bootstrap import.
- Replaced the remaining Zone-dependent `fakeAsync` / `tick` test setup with native `async` / `await fixture.whenStable()`.
- Migrated the remaining loading and rendered-content state in `ActivityDescriptionPageComponent`, `ReportComponent`, `UsageComponent`, and `MarkdownViewerComponent` to signals so their templates update correctly without Zone.js.
- <b> DSOMM is now completely zoneless at runtime and in its test configuration 🎉. </b>
- **Files:** `angular.json`, `package.json`, `package-lock.json`, `src/main.ts`, `src/test.ts`, `src/app/pages/settings/settings.component.spec.ts`, `src/app/component/markdown-viewer/*`, `src/app/pages/activity-description/*`, `src/app/pages/report/*`, `src/app/pages/usage/*`

</details>

---

## Backlog

| # | Area | Issue | Priority | Notes |
|---|-----------|-------|----------|-------|
| 1 | `xlsx` (SheetJS) dependency | Prototype pollution + ReDoS vulnerability, no upstream fix available (maintainers stopped publishing security patches) | Medium | Requires code changes wherever `xlsx` is imported for spreadsheet export. Options: replace with `exceljs` or `xlsx-js-style` (community fork), or accept risk if only used for non-sensitive data export. <b>Needs a dedicated PR.</b> |
| 2 | `CircularHeatmapComponent` | • **Layout shift on scroll:** Heatmap shifts vertically at certain viewport widths. | Low | Remaining issue after signal migration. The three chip/filter bugs (order-sensitive group highlight, group selection wipe, stale group deselection) were resolved in the `CircularHeatmapComponent` signal migration. |
| 3 | Logging | Replace `console.log()` and boolean `environment.production` checks with a proper logging library using log-level feature toggles. Preferred Library: [Winston](https://github.com/winstonjs/winston). | Low | Discussed in team meeting. |

> [!NOTE]
> Add new backlog items here as they are discovered during future upgrades. Remove items once resolved.

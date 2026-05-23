
# Migration Log: DSOMM Modernization

  

This log tracks the progress of the Angular modernization project from version 13 towards version 21.

  

<details>

<summary><strong>Angular 13 → 14</strong></summary>

  

### Summary

The initial upgrade from Angular 13 to 14 was performed using `ng update`. This phase focused on establishing a stable v14 base, resolving immediate template warnings, and adopting the new Typed Forms feature.

  

### Commit History

  

#### 1. Chore: Upgrade Angular 13 to 14 ([c68f708b](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/c68f708b))

- Executed `npx ng update @angular/core@14 @angular/cli@14 @angular-eslint/schematics@14`. [[logs](logs/angular-core-14.txt)]

- This was followed by a `npx ng update @angular/cdk@14 @angular/material@14` [[logs](logs/angular-cdk-14.txt)]

  
  

#### 2. Fix: Remove Unnecessary Optional Chaining ([387be213](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/387be213))

-  **Action:** Cleaned up template code to resolve `NG8107` warnings.

-  **Reason:** Angular 14's improved template type checking flagged optional chaining (`?.`) on properties that are guaranteed to be defined (or where the parent is not null/undefined). This "chore" was necessary to clear the console of noise and ensure clean build outputs.

-  **Log Reference:** [`npx ng serve` Warnings logs after prev commit - c68f708b](logs/13-14_warnings.txt)

  

#### 3. Refactor: Migrate to Typed Reactive Forms ([3d36885e](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/3d36885e))

-  **Action:** Converted `UntypedFormControl`, `UntypedFormGroup`, etc., to their typed counterparts.

-  **Reason:** One of the major benefits of Angular 14. This improves type safety across the application and catches potential form-related errors at compile time.

  

#### 4. Fix: Update SettingsComponent Spec to Resolve Test Failures ([31aef4ab](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/31aef4ab))

-  **Action:** Fixed 3 failing tests in `settings.component.spec.ts` by providing missing mock data.

-  **Reason:** Removing `?.` in commit `031ef6a1` exposed that the test environment never provided a `meta` object to the component. Since `MockLoaderService` returns no `meta`, `this.meta` stayed `undefined` at render time, causing Angular's template engine to crash with `Cannot read properties of undefined (reading 'activityMeta')`. Added a `meta` stub on the component instance before `detectChanges()`, and provided a `GithubService` spy which was also missing from the test providers.

-  **Log Reference** [Test failures logs before this commit](logs/13-14_regression_test_failures.txt)

  

---

  

#### N. Fix: Correct Typography Configuration in Custom Theme ([commit_hash])

-  **Action:** Replaced `mat.define-typography-level()` with `mat.define-legacy-typography-config()`

and set the font-family to `Roboto, "Helvetica Neue", sans-serif`.

-  **Reason:** The original code used `mat.define-typography-level()`, which creates a *single*

typography level (one set of font properties). However, `mat.core()` (and its v15 successor

`mat.all-legacy-component-typographies()`) expects a *full typography config* — a map containing

styles for every text category (headline, body, caption, etc.). Because of this type mismatch,

Angular Material silently ignored the custom config and fell back to its default font stack

(`Roboto, "Helvetica Neue", sans-serif`). The `Montserrat` font declared in the original code

was never actually rendered in production. Switching to `mat.define-legacy-typography-config()`

fixes the function signature, and using Roboto preserves visual parity with the live site.

-  **Additional Change:** Reordered `@include` statements so `mat.legacy-core()` runs before

`mat.all-legacy-component-typographies()`, which is the documented correct order in v15

(foundation before typography).

  

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


  

---

  

  

---

  

## Backlog

  

Known issues deferred from the Angular 14 → 15 migration. These should be addressed alongside or after the upgrade to Angular 21.

| # | Component | Issue | Priority | Notes |
|---|-----------|-------|----------|-------|
| 1 | `ProgressSliderComponent` | Slider styling doesn't fully match the pre-migration look. The main issue is in the progress slider's background color in light mode: contrast is lesser. Also the discrete tick marks for completion levels were removed during the MDC migration. The legacy slider supported `[tickInterval]="1"` to render visible notch lines at each step, helping users distinguish between progress levels.. | Medium | The MDC `<mat-slider>` uses a nested `<input matSliderThumb>` pattern with different internal CSS classes (`.mdc-slider__track--active_fill`, `.mdc-slider__thumb-knob`). Current overrides work functionally but the visual fidelity can be improved. |  



> [!NOTE]

> Add new backlog items here as they are discovered during future upgrades. Remove items once resolved.
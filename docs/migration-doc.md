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
- **Action:** Cleaned up template code to resolve `NG8107` warnings.
- **Reason:** Angular 14's improved template type checking flagged optional chaining (`?.`) on properties that are guaranteed to be defined (or where the parent is not null/undefined). This "chore" was necessary to clear the console of noise and ensure clean build outputs.
- **Log Reference:** [`npx ng serve` Warnings logs after prev commit - c68f708b](logs/13-14_warnings.txt)

#### 3. Refactor: Migrate to Typed Reactive Forms ([3d36885e](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/3d36885e))
- **Action:** Converted `UntypedFormControl`, `UntypedFormGroup`, etc., to their typed counterparts.
- **Reason:** One of the major benefits of Angular 14. This improves type safety across the application and catches potential form-related errors at compile time.

#### 4. Fix: Update SettingsComponent Spec to Resolve Test Failures ([31aef4ab](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/commit/31aef4ab))
- **Action:** Fixed 3 failing tests in `settings.component.spec.ts` by providing missing mock data.
- **Reason:** Removing `?.` in commit `031ef6a1` exposed that the test environment never provided a `meta` object to the component. Since `MockLoaderService` returns no `meta`, `this.meta` stayed `undefined` at render time, causing Angular's template engine to crash with `Cannot read properties of undefined (reading 'activityMeta')`. Added a `meta` stub on the component instance before `detectChanges()`, and provided a `GithubService` spy which was also missing from the test providers.
- **Log Reference** [Test failures logs before this commit](logs/13-14_regression_test_failures.txt)

---

#### N. Fix: Correct Typography Configuration in Custom Theme ([commit_hash])
- **Action:** Replaced `mat.define-typography-level()` with `mat.define-legacy-typography-config()` 
  and set the font-family to `Roboto, "Helvetica Neue", sans-serif`.
- **Reason:** The original code used `mat.define-typography-level()`, which creates a *single* 
  typography level (one set of font properties). However, `mat.core()` (and its v15 successor 
  `mat.all-legacy-component-typographies()`) expects a *full typography config* — a map containing 
  styles for every text category (headline, body, caption, etc.). Because of this type mismatch, 
  Angular Material silently ignored the custom config and fell back to its default font stack 
  (`Roboto, "Helvetica Neue", sans-serif`). The `Montserrat` font declared in the original code 
  was never actually rendered in production. Switching to `mat.define-legacy-typography-config()` 
  fixes the function signature, and using Roboto preserves visual parity with the live site.
- **Additional Change:** Reordered `@include` statements so `mat.legacy-core()` runs before 
  `mat.all-legacy-component-typographies()`, which is the documented correct order in v15 
  (foundation before typography).

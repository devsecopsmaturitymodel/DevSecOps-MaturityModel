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


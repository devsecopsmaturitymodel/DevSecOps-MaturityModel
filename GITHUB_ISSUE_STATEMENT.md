# Clean Up Legacy `generated.yaml` References

## Issue Description
The codebase contains references to the deprecated `generated.yaml` file format that has been replaced by the newer `model.yaml` structure. While the code handles legacy format gracefully, these outdated references should be removed for code cleanliness and to avoid confusion for new contributors.

## Current State
The application transitioned from a monolithic `generated.yaml` to a split architecture:
- `generated.yaml` (deprecated) → `model.yaml` (activities) + `team-progress.yaml` (progress)

However, legacy references remain in the codebase.

## References to Clean Up

### 1. **File: `src/assets/YAML/meta.yaml` (Line 29)**
**Current:**
```yaml
activityFiles:
    # - generated/generated.yaml # Old structure -  No longer used
    - default/model.yaml
```

**Action:** Remove the commented-out reference to `generated/generated.yaml`

**Proposed Fix:**
```yaml
activityFiles:
    - default/model.yaml
```

---

### 2. **File: `src/app/component/modal-message/modal-message.component.ts` (Lines 24-31)**

**Current:** The component has a hardcoded error template specifically for the legacy `generated.yaml` file:
```typescript
if (this.dialogInfo?.title === 'generated_yaml') {
  this.template = { ...this.generatedYamlTemplate };
  // ... template for downloading generated.yaml
}
```

**Issue:** This template references the deprecated file format and is no longer relevant.

**Action:** Consider whether this template should be:
1. Removed entirely (preferred, since it's legacy)
2. Kept for backward compatibility with existing error handling

**Recommended Fix:** Remove this conditional block and the associated `generatedYamlTemplate` definition.

---

### 3. **File: `src/app/service/loader/data-loader.service.ts` (Lines 158, 177-178)**

**Current:** Special handling for legacy validation errors:
```typescript
usingLegacyYamlFile ||= filename.endsWith('generated/generated.yaml');

// Legacy generated.yaml has several data validation problems. Do not report these
if (!usingLegacyYamlFile) {
  throw new DataValidationError(...);
}
```

**Action:** This code can be removed once:
1. All users have migrated from `generated.yaml` to `model.yaml`
2. The legacy error template is removed
3. Only `model.yaml` is actively supported

**Recommended Fix:** Remove the `usingLegacyYamlFile` flag and the conditional error suppression once legacy format is no longer needed.

---

## Impact
- **Scope:** Minor cleanup, no functional impact
- **Risk:** Very low — only affects code clarity and maintainability
- **Breaking Changes:** None
- **Dependencies:** None

## Testing
1. Verify the application loads correctly with `model.yaml` (the current standard)
2. Ensure no error messages reference the deprecated `generated.yaml` format
3. Confirm all existing functionality remains intact

## Related Documentation
- Migration notes should clarify that `generated.yaml` is deprecated in favor of `model.yaml` + `team-progress.yaml`
- INSTALL.md can be updated to remove any references to manual `generated.yaml` download if not needed

# OWASP DSOMM Enhancement Proposal

## Overview

This proposal outlines key enhancements to the OWASP DevSecOps Maturity Model (DSOMM) to improve its functionality, usability, and integration with other security frameworks. The total estimated effort for all proposed features is 268 hours (33.5 days).

## Proposed Enhancements

### 1. Vulnerability Management and Patch Management Expansion

**Problem:** Current vulnerability management coverage is incomplete, particularly lacking metrics.
**Solution:** Integrate concepts from the Vulnerability Management Maturity Model and "Effective Vulnerability Management" book to add:
- New activities mapped to SAMM, ISO, and OpenCRE 
- Risk and measure descriptions
- Implementation guidance
- Level justifications based on effort and security value

**Estimated Effort:** 32 hours

### 2. Compliance Date Integration 

**Problem:** Activity implementation status doesn't account for time-based assessment/compliance requirements.

**Solution:** 
As a security architect, I want teams to perform threat modeling quaterly.
As a project team, I perform a threat modeling and the status is DSOMM for that team is changed to "implemented". As there is no automatic removal of the status, it stays "implemented".

Tasks:
- Add `threshold` attribute to activities for time-based assessment/compliance
- Enhance `teamsImplemented` attribute to track implementation dates
- Update UI to display assessment/compliance status based on dates and thresholds

Sample `threshold`:
```
   threshold:
       targets:
          - type: "count"
            minValue: 1
        period:
          periodType: sliding
          timeframe: "2Y"
```
The `teamsImplemented` attribute, to be filled out by teams:
```
   teamsImplemented:
     - teamA:
       conductionDate: 2024-08-08 00:00:00
     - teamB:
       conductionDate: 2024-08-08 00:00:00
     - teamB:
       implemented: true
```

**Estimated Effort:** 80 hours

### 3. Score Calculation

**Problem:** Current visualization can be difficult to interpret quickly.

**Solution:** Implement an overall score calculation for each sub-dimension, showing implemented vs. maximum possible activities for teams.

**Estimated Effort:** 8 hours

### 4. Customization Capabilities

**Problem:** Organizations need to adapt DSOMM for their specific security programs, which is currently challenging.

**Solution:** Make the DSOMM application customizable:
- Auto-adjust levels in visualizations when changed
- Allow hiding/adding attributes for activity descriptions
- Ensure consistent updates across linked elements (e.g., overview tables, detailed descriptions)

**Estimated Effort:** 80 hours

### 5. OpenCRE Integration Enhancement

**Problem:** Current OpenCRE chatbot lacks comprehensive DSOMM content integration.

**Solution:**
- Customize OpenCRE content with DSOMM-specific information
- Provide sample pre-questions for improved DSOMM coverage
- Create a guide for enhancing OpenCRE content for other projects

The solution needs to be implemented together with openCRE team.

**Estimated Effort:** 60 hours

### 6. Status `notApplicable`
**Problem:** An application security program defines activities to be implemented by product teams. Sometimes, the activities are not applicable to a product/application.

**Solution:** Add the status `notApplicable` for teams

**Estimated Effort:** 8 hours

## Total Estimated Effort

268 hours (33.5 days)

## Benefits

- Improved vulnerability management guidance
- Better compliance tracking and reporting
- Enhanced data visualization and interpretation
- Increased flexibility for organizational adoption
- Tighter integration with broader security ecosystems

## Conclusion

These enhancements will significantly improve the usability, adaptability, and value of OWASP DSOMM for organizations implementing DevSecOps practices. The proposed changes will make DSOMM a more comprehensive and user-friendly tool for assessing and improving security maturity.

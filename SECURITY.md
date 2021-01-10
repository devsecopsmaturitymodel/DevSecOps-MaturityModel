# Responsible disclosure policy

## Introduction

We take security very seriously.
We welcome any review of the latest release of all our open source code to ensure that these components can not be compromised.
In case you identified a security related issue with severity of _low_ to _medium_, please create a GitHub issue. 


## Security related bugs with severity _high_ or _critical_

In case you identified a security related issue with severity of _high_ or _critical_, please disclose information about the issue non public via email to `timo.pagel@owasp.org`.

We encourage researchers to include a Proof-of-Concept, supported by screenshots or videos.
For each given security related issue with severity _high_ or _critical_ (based on own assessment), we will respond within one week.


# Supported versions and update policy

Please be aware that only the most recent version will be subject of security patches.

# Known security gaps and future enhancements

There is no format in commits to identify security related fixes and it is not planned yet.

# Production Usage
The patch management process of the application is weak. It is recommended to not use the application with production data in public. Please use at least authentication/authorization in front of the application (e.g. https://github.com/oauth2-proxy/oauth2-proxy).

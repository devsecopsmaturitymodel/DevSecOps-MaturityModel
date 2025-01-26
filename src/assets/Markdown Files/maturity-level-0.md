# Pre-Requirements

Before you start using DSOMM in your organization, there are a few activities that might help you to implement a better security regime.


These pre-requirements are highly based on (mostly copied)
 from AppSecure NRW's first level of [security-belts](https://github.com/AppSecure-nrw/security-belts/tree/master/white).

## Risk management
Understand what the term _risk_ means in this context.
<details><summary>Definition of risk</summary>
NIST defines risk as:

> a measure of the extent to which an entity is threatened by a potential circumstance or event, and typically is a function of:
> 1.  the adverse impact, or magnitude of harm, that would arise
>    if the circumstance or event occurs; and
> 2. the likelihood of occurrence.

_Source: https://csrc.nist.gov/glossary/term/risk_
</details>

<details><summary>Definition of risk in a information security context</summary>
In information security, risks arise from the loss of:

- confidentiality,
- integrity,
- or availability

of information or information systems and reflect the
potential adverse impacts to:

- organizational operations
  (including: - mission, - functions, - image, - or reputation),
- organizational assets,
- individuals,
- other organizations
(see [NIST.SP.800-53Ar4](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53Ar4.pdf).

A risk then tied to a **threat**, its **probability** and its **impacts**.

If you are interested in Risk Management frameworks and
strategies, you can start from
[FISMA](https://csrc.nist.gov/Projects/risk-management/).
</details>

<details><summary>Definition of risk appetite</summary>
Risk appetite is defined as:

> The types and amount of risk, on a broad level, [an organization] is willing to accept in its pursuit of value

_Source: https://csrc.nist.gov/glossary/term/risk_appetite_

Organizations have different risk appetite. It is important to understand what risks your organization is willing to accept, and which are not acceptable. Understanding this will 
 - help you translate application security risks for your management
 - help you focus on risks that matters the most for your organization
</details>

<details><summary>Definition of risk tolerance</summary>
Risk <i>tolerance</i> is highly connected to risk <i>appetite</i>. NIST's definition is almost identical to its own definition for risk appetit. 

[ISACA](https://en.wikipedia.org/wiki/ISACA), however, defines <i>risk tolerance</i> as:

> the acceptable deviation from the level set by the risk appetite and business objectives.

Explaining that:

> Risk appetite and risk tolerance can be viewed as the “two sides of the same coin” as they relate to organizational performance over time. Risk appetite is about “taking risk” and risk tolerance is about “controlling risk.” For risk appetite to be adopted successfully in decision making, it must be integrated with control environment of the organization through risk tolerance

_Source: https://www.isaca.org/resources/news-and-trends/isaca-now-blog/2022/risk-appetite-vs-risk-tolerance-what-is-the-difference_
</details>

## Onboard Product Owner and other managers

To adopt a DSOMM in a product or a project, it is important to identify
the person or the team which is responsible to ensure
that risk-related considerations reflects the organizational
risk appetite and tolerance
(see [Risk Executive](https://csrc.nist.gov/glossary/term/risk_executive)
for a more complete view).

Depending on the project, this "Risk Manager" - which in layman's terms
is responsible for judging "risks vs. costs" of the product -
can be the `Project Manager`, the `Product Owner` or else:
it is important that he has the proper risk management
knowledge and, receive a proper training.

The "Risk Manager" must be convinced that continuously improving
security through DSOMM is an effective way to
to minimize risk and build better products.

The first steps for deploying DSOMM are then the following:

1. identify the persons in charge for risk decisions
1. ask them about their _risk appetite_
1. make them aware of information security risks
   - show the impacts of threats and their probability
1. convince them that security requires _continuous_ efforts

### Benefits

- The "Risk Manager" is aware that all software have security vulnerabilities,
  and that the related risks should be minimized
- Knowing the risk appetite XXXXXX
- Resources must be allocated to improve security and
  to avoid, detect and fix vulnerabilities
- Management can perform well informed risk decisions
- The "Risk Manager" has transparent knowledge on how secure the product is

## Get to Know Security Policies

Identify the security policies of your organization and adhere to them.

Share with the Security Champion Guild how you perform the required activities
from the policies, so others can benefit from your experience.

In addition, provide feedback to the policy owner.

Communicate discrepancies with the defined security policies
to the "Risk Manager"
so that he can take proper measures.

### Benefits

- Adopting security policies addressing threats
  simplifies building secure software.
- Basic security risks are handled.

## Continuously Improve your Security Belt Rank

Security is like a big pizza.
You cannot eat it as a whole,
but you can slice it and continuously eat small slices.

Ensure that the "Risk Manager" continuously prioritizes
the security belt activities for the next belt highly
within the product backlog.

Security belt activities make "good slices" because they are of reasonable
size and have a defined output.

Celebrate all your implemented security belt activities!

### Benefits

- The team has time to improve its software security.
- The team's initially high motivation and momentum can be used.
- The Risk Manager has visibility on the investment
  and the benefits of security belts.
- The team is improving its software security.

## Review Security Belt Activities

Let the Security Champion Guild review your implementations of security belt
activities (or concepts of these implementations) as soon as possible.
This helps to eradicate misunderstandings of security belt activities early.

### Benefits

- The quality of the implementation increases.
- Successes can be celebrated intermediately.
- Early feedback before the belt assessment.

## Utilize Pairing when starting an activity
When implementing a security belt activity, approach a peer
from the Security Champion Guild to get you started.

## Benefits

- Knowledge how to implement security belt activities is spread,
  so everyone benefits of prior knowledge.
- Starting to implement security belt activities with guidance is easier.
- The team is improving its software security while avoiding previously
  made mistakes.

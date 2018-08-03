<?php

$title = gettext("Information");
include_once "head.php";
?>
<body>
<?php
include_once "data.php";
include_once "navi.php";

echo "<h1>Information</h1>";
?>
<h2>Description</h2>
From a startup to a multinational corporation the software development industry is currently dominated by agile frameworks and product teams and as part of it DevOps strategies. It has been observed that during the implementation, security aspects are usually neglected or are at least not sufficient taken account of. It is often the case that standard safety requirements of the production environment are not utilized or applied to the build pipeline in the continuous integration environment with containerization or concrete docker. Therefore, the docker registry is often not secured which might result in the theft of the entire company’s source code.
<br />
The  DevSecOps Maturity Model, which is presented in the talk, shows security measures which are applied when using DevOps strategies and how these can be prioritized.
<br />
With the help of DevOps strategies security can also be enhanced. For example, each component such as application libraries and operating system libraries in docker images can be tested for known vulnerabilities.
<br />
Attackers are intelligent and creative, equipped with new technologies and purpose. Under the guidance of the forward-looking DevSecOps Maturity Model, appropriate principles and measures are at hand implemented which counteract the attacks.

<h2>Who is using the DevSecOps Maturity Model (DSOMM)</h2>
One of the biggest insurances in europe based his own maturity model on DSOMM. An other big german insurance is using the "Test and Verification" part to enhance the security in that area. There are other anonymous companies using the DevSecOps Maturity Model.

<h2>Slides and talks</h2>
<ul>
    <li><a href="https://docs.google.com/presentation/d/1dAewXIHgBEKHKwBPpM5N_G2eM6PRpduoGJrp6R6pNUI/edit?usp=sharing">Dynamic Application Security Testing for Enterprise</a>, 14.07.2018</li>
    <li><a href="https://www.youtube.com/watch?v=gWjGWebWahE&t=448s">Security in DevOps-Strategies</a>, 28.09.2017, Hamburg, Germany</li>
</ul>


<h2>Credits</h2>
<ul>
    <li>The dimension <i>Test and Verifiacation</i> is based on Christian Schneiders <a href="https://www.christian-schneider.net/SecurityDevOpsMaturityModel.html"><i>Security DevOps Maturity Model (SDOMM)</i></a>. <i>Application tests</i> and <i>Infrastructure tests</i> are added by Timo Pagel. Also, the sub-dimension <i>Static depth</i> has been evaluated by security experts at <a href="https://www.owasp.org/index.php/OWASP_German_Chapter_Stammtisch_Initiative/Hamburg">OWASP Stammtisch Hamburg</a>.</li>
    <li>The sub-dimension <i>Process</i> has been added after a discussion with <a href="https://www.linkedin.com/in/francoisraynaud/">Francois Raynaud</a> at <a href="https://opensecsummit.org">OpenSecuritySummit 2018</a> that reactive activities are missing.</li>
    <li>Enhancement of my basic translation is performed by <a href="https://github.com/clazba">Claud Camerino</a></li>
</ul>

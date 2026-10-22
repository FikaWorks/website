+++
date = '2026-10-22T00:00:00+02:00'
draft = false
title = 'FikaWorks Argus'
description = 'FikaWorks Argus is an AI agent that keeps learning your infrastructure, holds every environment at the security baseline you choose, contains attacks and tests its own defences. A person approves every change.'
eyebrow = 'Products · Piloting with organisations'
hero_title = 'FikaWorks Argus'
hero_subtitle = 'An AI agent that keeps learning your infrastructure. It holds every environment at the security baseline you choose and closes the gaps itself, watches for attacks and contains them, and tests its own defences on purpose. A person approves every change.'
cta_text = 'Ask for early access'
cta_url = '/contact/?topic=product-fikaworks-argus'
cta2_text = 'All products'
cta2_url = '/products/'

[intro]
title = 'From finding gaps to closing them'
text = 'Most security tools stop at the report: dashboards, findings and tickets that pile up faster than anyone can close them, and nobody checks that a fix reached every environment. Argus works on the gaps themselves, and checks that each fix holds.'

# ------------------------------------------------------------ how it works
[how]
title = 'How it works'
text = 'Three agents work on one map, towards one target, behind one gate.'
[[how.items]]
title = 'The map'
color = 'blue'
text = 'Everything in your environments and how it connects: cloud resources, clusters, workloads, images, repositories and identities. Every change and scan keeps it current. Each thing has one identity across environments, so one fix closes a gap everywhere it appears.'
[[how.items]]
title = 'The target'
color = 'yellow'
text = 'A security baseline you choose. Argus works every environment towards it and keeps it there, not only until the next audit.'
[[how.items]]
title = 'The gate'
color = 'green'
text = 'Every change waits for an approval: a card a person answers, a plan they approved or a rule the team set. Exact diffs and a ledger of every action let you raise autonomy step by step.'

# ------------------------------------------------------------ agents
[agents]
title = 'Three agents, one map'
text = 'The agents never message each other. They share records, such as issues, plans and their revisions, and the platform checks every one.'
[[agents.items]]
name = 'Plans'
role = 'Fixes what was found'
status = 'Available'
text = 'Turns issues into a plan for each environment and changes what is wrong where it comes from: in the repository, as a change you review.'
features = [
  'One fix per issue, applied everywhere the issue appears',
  'An exact diff for every change, waiting for approval',
  'Checks that each fix reached every environment',
]
[[agents.items]]
name = 'Scout'
role = 'Watches for attacks and contains them'
status = 'Signals live · response next'
text = 'Follows each environment’s runtime and audit signals as they happen, and contains attacks within the limits you set.'
features = [
  'Runtime detection with Falco, the Kubernetes audit log and response agents',
  'Contains in three tiers, from pre-approved to ask first',
  'Proves every signal source with a canary',
]
[[agents.items]]
name = 'Prowl'
role = 'Attacks your own infrastructure, on purpose'
status = 'Next'
text = 'Runs authorized engagements against your own infrastructure to prove what holds, and turns what it finds into issues for the plan.'
features = [
  'Scans clusters, images, networks and web apps',
  'From inside the cluster or from outside',
  'Authorized on a card, with a kill switch',
]

# ------------------------------------------------------------ deep dives
[[details]]
eyebrow = 'Scout'
title = 'It watches, and contains within the limits you set'
text = 'Scout follows each environment’s own signals as they happen. Noise is filtered inside the cluster and raw signals never reach the model. Signals are grouped and checked against the map before anything wakes the agent, so an attacker can’t talk to it through a log line.'
list_title = 'Containment in three tiers'
list = [
  'Responses your team approved in advance run at once, with no model in the path.',
  'Reversible containment you allow per environment, such as isolating a pod, scaling to zero or blocking an address, runs without asking.',
  'Everything else goes on a card with its exact effect. The lasting fix, such as an upgrade, a library or an architecture change, goes to the environment’s plan.',
]
note = 'For each environment, Scout shows whether it can see: Active, Degraded or Off. Every signal source is proven every 30 minutes by a canary, a harmless event that must reach Argus within 5 minutes. A missing source becomes an issue for the plan to fix.'
[[details]]
eyebrow = 'Prowl'
title = 'It tests your defences on purpose'
text = 'Prowl runs engagements against your own infrastructure. An owner authorizes each one on a card, with its scope, its time window and its rules. A kill switch stops every scan at once, and every scan is recorded in the ledger.'
list_title = 'What it covers'
list = [
  'Clusters, images, networks and web apps, from inside the cluster or from outside.',
  'Each finding becomes an issue about one affected thing, with its evidence.',
  'The environment’s plan fixes it like any other gap.',
]
[[details]]
eyebrow = 'Scout and Prowl together'
title = 'A built-in purple team'
text = 'Scout is never told an engagement is running; the platform enforces it. When an engagement closes, Argus scores every scan: did Scout detect it, how fast, and did it contain it? Each miss becomes a detection issue, so your defences improve the same way vulnerabilities get fixed.'
note = 'A person answering a Scout card is told when the activity matches an authorized engagement, so nobody blocks their own test by mistake.'

# ------------------------------------------------------------ baselines
[baselines]
title = 'Choose a baseline. Argus gets you there, and keeps you there.'
text = 'Argus works your environments towards one of these baselines, or collects the technical-control evidence a framework asks for. Frameworks also need people and an auditor; Argus covers the technical side.'
[[baselines.groups]]
title = 'Hardening baselines'
items = [
  'CIS Benchmarks',
  'Kubernetes Pod Security Standards',
  'NSA/CISA Kubernetes Hardening',
  'NIST SP 800-190',
  'OWASP Kubernetes Top 10',
]
[[baselines.groups]]
title = 'Frameworks'
items = [
  'SOC 2',
  'ISO 27001',
  'NIST CSF 2.0',
  'NIST 800-53',
  'PCI DSS 4.0',
  'HIPAA',
  'NIS2',
  'DORA',
  'BSI IT-Grundschutz',
]

# ------------------------------------------------------------ works with
[integrations]
title = 'Works with'
groups = [
  { title = 'Runs on and changes', items = ['Kubernetes', 'Helm', 'Argo CD', 'Flux', 'GitLab'] },
  { title = 'Reads', items = ['Trivy', 'Kyverno', 'Falco'] },
]
note = 'Kubernetes and Git environments today, with multiple organisations from day one. Azure is next, then other clouds and Terraform.'

# ------------------------------------------------------------ deployment
[deploy]
title = 'Where it runs'
[[deploy.items]]
name = 'We run it for you'
status = 'Available'
text = 'Connect your environments and Argus does the rest from our infrastructure.'
[[deploy.items]]
name = 'In your cloud'
status = 'Available'
text = 'Argus runs inside your own cloud account or Kubernetes, installed with Helm, on a model you host or choose.'
[[deploy.items]]
name = 'The private box'
status = 'Next'
text = 'An appliance in your own infrastructure with our own fine-tuned model built in. Nothing leaves the building, even air-gapped.'

# ------------------------------------------------------------ closing
[closing]
title = 'Try Argus with our people'
text = 'We are running Argus with pilot organisations. Our people set it up in your environment, alongside our Security & Compliance service, and review what it finds and does with you.'
link_text = 'About Security & Compliance'
link_url = '/solutions/security-compliance/'
+++

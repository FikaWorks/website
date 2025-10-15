+++
author = 'Catalin Jora'
date = '2025-10-15T12:20:17+02:00'
draft = false
aliases = ["/blog/lessons-learned-from-going-live-with-kubernetes/"]
image = 'lessons_learned_from_going_live_on_kubernetes.png'
tags = ['platform engineering', 'IDPs', 'platform readiness', 'kubernetes', 'cloud native', 'docker', 'planning', 'consulting', ]
title = 'Accelerating Cloud-Native Adoption: A Platform Engineering Roadmap to Production Readiness'
+++

After taking a set of applications live on a new in-house build platform (based on Kubernetes), I want to reflect on what it really takes to get to “production readiness.” There’s plenty of content about Day 2 operations, but far less on the foundations you need before go-live. This post outlines the essential steps to become platform-ready: the capabilities, guardrails, and golden paths that turn infrastructure into a reliable product for engineers. Like training for a marathon, you can’t skip base runs and expect race day to go well. If you cut corners up front, Day 2 will be painful.

Standing up a cluster or a few sample services is easy; building a resilient, secure, and usable platform is not. So getting the Platform Foundations or Platform Readiness is actually what we're striving for; and this takes time and deliberate sequencing. You’ll need to ensure both the applications are optimized for the platform and the platform is properly prepared to support the applications. You don’t need to do everything at once: decouple, deliver incrementally, and validate with real teams. That’s how you de-risk, keep momentum, and continuously deliver value stakeholders can see. Building something and having it adopted by the teams are also 2 different things and a lot of platform implementations fail miserably at this. This post covers only the very basics of the foundational concepts.

## Constructing the Enterprise-Grade Platform Core

While this may seems counterintuitive for some people that adopt Kubernetes,
building an enterprise production grade platform will take months and will
require dedicated team(s). This is valid also if you will consume a managed
Kubernetes solution (like [GKE](https://cloud.google.com/kubernetes-engine),
[EKS](https://cloud.google.com/kubernetes-engine),
[AKS](https://azure.microsoft.com/en-us/services/kubernetes-service/)). The main
2 factors that will influence the delivery of the new infrastructure are:

- the level of automation of your company (current cloud footprint, networking
  setup, compliance and security processes, infrastructure programming languages
  standards, IT infra cooperation/blockers)

- the implementation team skills (familiarity with Kubernetes/net platform, experience with the cloud they're building against,
  infrastructure as code programming skills: ansible/terraform/cloud
  formation/etc)

Aim for progressive deliverables for the new platform, it will help
validate assumptions and expose problems early. To facilitate the platform
adoption, involve the developers teams early in the process, you're actually
building this platform for them. Don't assume you know best how applications
should run, what 3rd party components are needed or what dependencies they have.

The team who builds the platform will (most of the time) be responsible for
maintaining and updating it. Kubernetes moves fast, so the team will have the
chance to test and architect scenarios for updates and upgrades before
they will go live. This will make the so-called Day 2 operations easier on the
long run. [GitOps](https://about.gitlab.com/topics/gitops/) practices are
becoming the golden standard in managing the lifecycle of the infrastructure.

### Standardizing Application Delivery

Containers are the standard unit for packaging and distributing applications. 
Most applications today are already containerized, and with the help of AI tooling, 
the process has become almost trivial for those that are not.
When it comes to enterprise software, vendors typically distribute their applications as container images.
If you do need to build from scratch, start with official base images — they’re a great reference for best practices in layering, 
configuration management, parameter injection and permissions. These images are already battle-tested,
 optimized and scanned for vulnerabilities, so you benefit from a solid and secure foundation. 
 Minimalism is key here:

- the smaller the image the better (less area to attack, faster start-time, less
  storage consumed, data transfer costs, etc)

- the user that runs in the container should get only the permissions required
  to run the application and nothing more

There is excellent documentation around that part, and quite a few developers
are already familiar with this topic.

### Providing a Secure Artifact Management Service

Once you can build the images, you'll need to store them somewhere. If you
will run Kubernetes in a public cloud, your registry should be in the same
region (for latency and cost purposes). You can either use your current artifact
registry if you have one that can handle container images (Artifactory, Nexus etc),
or better use the one from the cloud provider (simpler integration with kubernetes,
auto-scale storage, no hassle with backups and updates). A few things you will
need to consider:

- Implement image scanning, preferably from Day 0. Procedures for fixing the
  discovered vulnerabilities should be created as well (what are you gonna do
  with the compromised images, who is going to patch them). Start with a free
  tool like [trivy](https://github.com/aquasecurity/trivy) or
  [clair](https://github.com/quay/clair).

- You will need to decide how to consume public images, what images you can
  trust. Who can pull images and from where? Tools like
  [notary](https://docs.docker.com/notary/getting_started/) can help here.

- Clean-up is important especially if you run your own registry and you need to
  keep an eye on the storage and backups.

- Storage and transfer costs are cheap if you consume the images in the same
  (cloud) region. Don't need to over optimize here. But do avoid a hybrid setup
  (like registry on prem and platform in the cloud) due to transfer costs and
  latency (especially with AI images)

### Embedding Security as a Platform Service

Kubernetes is not good at keeping secrets. The default secret primitives are
not actually secret, and can be quickly cause major security incidents. There
are a few options for handling the management of sensitive data in Kubernetes:

- consumming the secret management solution from the cloud provider (has native
  integration with the managed Kubernetes from the same vendor)
- use a 3rd party tool like [Hashicorp Vault](https://www.vaultproject.io/) that
  can be either consumed as SaaS or self managed
- make your enterpise solution for secret management talk to Kubernetes (if that
  can be achieved at all)

Next to storing the secrets themselve, you need to figure who will have access
and based on what roles/policies to consume them.

### Delivering Observability Capabilities

All vendors support and can consume Kubernetes metrics and logs, but
this migration is a good opportunity to catch up and get rid of legacy.
Consuming the standard cloud provided logging/monitoring is the easiest way to
go, especially if you're using a managed Kubernetes (native integration, no
headache with administration, backups, storage, etc). Open source tools are also
a valid option (ELK stack, Grafana stack, Prometheus, etc), but they do need to be managed,
backed-up and upgraded. The other alternatives are the SaaS solutions (DataDog,
Sysdig, NewRelic, Grafana, etc) which will scale your costs in line with your
cluster size.

Migration to Kubernetes brings most of the time the "you build it you run it"
paradigm, so you'll need to be confident you're monitoring the right things, and
don't wake up people in the middle of the night for things that are not urgent.

### Automating Progressive Delivery

Migrating to a new platform doesn’t necessarily require adopting an entirely new software delivery tool. 
However, some products are better optimized and provide deeper integration with the new infrastructure.
 There's a momentum towards GitOps practices (even without Git), basically versioning the state of everything that runs in
Kubernetes (including the infrastructure itself), storing it in git and
reconciling to the desired state. To follow this path, there are  tools (like
[argo-cd](https://argoproj.github.io/argo-cd/),
[flux](https://github.com/fluxcd/flux)) that facilitate those patterns and
allow progressive delivery of the application.

 Depending on how significant the shift is from your previous platform, you may be able to carry over some of the tools you’re already using. 
 First of all, you will need to cover the basics and ensure your applications can build, run tests and can be deployed using
containers. The fancy stuff may or may not be needed at
all, don't over engineer the CI/CD, it should be trivial to deploy.

To manage the so-called “YAML hell,” you’ll likely need a tool that supports templating or helps you customize Kubernetes manifests. This simplifies application updates and maintenance.

You’ll need to consider how to introduce new environment variables, promote new container images or releases, and create new environments — all without duplicating large portions of configuration. It’s also important to decide how much of this complexity you want to expose to your development teams.

### Map Out Dependencies (Enterprise Spaghetti)

Often, a new platform based on Kubernetes is linked to a broader ambition for enterprises to
consume/migrate to cloud and eventually use more open source. If you worked in
any company that's been on the market for more than 10 years, you experienced
some sort of (legacy) enterprise software. Those stacks are still there because
they are reliable (maybe years of uptime with 1-2 instances ?), the companies
behind them offer support, upgrades and SLA (thus taking most of the risk). But
at the same time those software are not always cloud friendly, not container
friendly (things started to change), they are resource savvy, expensive
(licensing, account managers, etc) and hard to operate. On top of that, over the
years, there were several layers of code, business logic, architecture and
"temporary solutions" applied that made it hard to migrate or blend them with
modern architectural patterns. Also those software "don't just float" in the
datacenter. They are usually highly coupled with other enterprise software,
batch jobs, databases, storage systems, mainframes etc. This may become a
blocker, so it's better to discover your dependencies early in the process.

There is a few options for fixing it:

- Connect directly from new platform to those systems if possible (easiest)

- Containerize the source systems and run them in Kubernetes

- Use a 3rd party tool as an integration framework like Apache Camel

- Operate the changes at the legacy system (hard)

### Platform adoption

No matter how well-designed or feature-rich your platform is, it won’t deliver value if your development teams aren’t actively using it. 
Building without short feedback loops risks project failure 
and creates an opportunity for vendors to convince management that their tool is a silver bullet.
Platform adoption should be integrated throughout the entire migration process — arguably the most critical factor for success. 
Kubernetes is just the foundation of your new technology stack;
how your development teams leverage it will ultimately determine the business impact. 
There are a few things that will facilitate the adoption:

**Train the people** - Don't expect to get adoption without investing the right
amount of time into training the people. There are a lot of new technologies and
concepts that come together bundled with Kubernetes, developers will need some
guidance and dedicated time to make sense of it, even if Kubernetes is not directly exposed to them.

**Internally evangelize the new platform** - Identify the teams that are usually
early adopters of technologies and work with those first. They will champion the
platform and will become the examples others will want to follow. Organise
events (demo's, hackathons, knowledge sharing sessions) where people can see the
new platform in action. Allow development teams to "try before they buy".

**DevEx - Developer Experience** - A good developer experience will increase adoption
and keep the developers teams happy. This includes good documentation and
examples, FAQ's, easy access, usability and in general a focus on the removal of
friction in using the platform. This is your chance to adopt [InnerSource](https://about.gitlab.com/topics/version-control/what-is-innersource/) best practices.

### Platform Go-Live Enablement

With all those in place, you are ready to go live. There are a few possible
scenarios that will help to minimise the risks of failure at this stage. If you
covered the previous steps, this part shouldn't be painful. Start with the
simplest applications and create a plan to migrate what can be migrated based on
previous application learnings, common sense and complexity. Good luck with your
migration and enjoy the ride!

#### Where to go next from here?
A platform is never done. Requirements evolve, new tooling and practices emerge all the time. A deeper description of the following tools and concepts is outside the scope of this article, but these are the next steps in hardening your platform:

> - Real Developer portal and golden paths (e.g., Backstage) for self‑service and standards
> - Policy‑as‑code and governance (OPA Gatekeeper/Kyverno, Conftest, Checkov/tfsec)
> - Software supply chain security (SBOMs, signing with Sigstore Cosign, provenance/SLSA)
> - Identity, multi‑tenancy, and isolation (SSO/OIDC, RBAC, workload identity, NetworkPolicies, Pod Security Standards)
> - Networking and zero‑trust traffic (Cilium, service mesh, cert‑manager, egress controls)
> - Disaster recovery and resilience (Velero, chaos engineering, autoscaling/capacity)
> - Cost management / FinOps (OpenCost/Kubecost, showback, rightsizing)
> - Fleet and lifecycle management (Cluster API, Argo CD ApplicationSet/Flux)
> - Runtime security (Falco/eBPF) and vulnerability management
> - SLOs as code and end‑to‑end observability (OpenTelemetry)



_Photo Notes: I took this picture at Utrecht Central Station while commuting to the Rabobank HQ, where the project that inspired this post was delivered!_

_Refreshed: This post was revisited and updated to keep the information timely and relevant._

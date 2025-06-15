---
title: 'Lessons learned from going live on Kubernetes'
date: 2021-02-24T18:20:17+02:00
image: 'lessons_learned_from_going_live_on_kubernetes.png'
draft: false
author: Catalin Jora
tags: ['kubernetes', 'cloud native', 'docker', 'planning', 'consulting']
---

As I've just finalized the deployment of a few production grade applications to
[Kubernetes](https://kubernetes.io) for my current project, I want to take the
opportunity to talk about this journey. There are a lot of resources that cover
the so-called Day 2 operations for Kubernetes, but there is not so much
information about what happens before you go live. In this blogpost I’ll cover
the fundamental steps one needs to do to become Kubernetes “ready”. Chances to
finish a marathon are very small if you have never run 5 or 10 km before.
Similarly, Day 2 for Kubernetes will be painful if you cut corners during
implementation.

K8s is quite complex and it comes with its own challenges and “aha” moments.
Spoiled by the Docker developer experience, one may think that after you
containerize an application it will be easy to run it on top of Kubernetes.
Unless you are in the business of building “Hello World!” applications,
Kubernetes is hard (especially in the enterprises). It is trivial to provision a
cluster from the command line interface on all major cloud providers and to
deploy a few dummy web servers, but that is not how your applications and
infrastructure are looking like. Here are the parts you will need to solve to
become Kubernetes ready. I’m calling them the Day -1 operation, but those can
actually take more than 1 year to implement. They don’t need to be executed in
this exact order, but as for every big project, try to decouple and deliver
incrementally. This will help you to “move the needle” and most importantly, to
de-risk the project and continuously deliver real value during the
implementation. Stakeholders will also appreciate it.

## Build the new infrastructure

While this seems counterintuitive for most people that adopt Kubernetes,
building an enterprise production grade cluster(s) will take months and will
require a dedicated team. This is valid also if you will consume a managed
Kubernetes solution (like [GKE](https://cloud.google.com/kubernetes-engine),
[EKS](https://cloud.google.com/kubernetes-engine),
[AKS](https://azure.microsoft.com/en-us/services/kubernetes-service/)). The main
2 factors that will influence the delivery of the new infrastructure are:

- the level of automation of your company (current cloud footprint, networking
  setup, compliance and security processes, infrastructure programming languages
  standards, IT infra cooperation/blockers)

- the implementation team skills (familiarity with Kubernetes or other
  containerised platforms, experience with the cloud they’re building against,
  infrastructure as code programming skills: ansible/terraform/cloud
  formation/etc)

Aim for progressive deliverables for the new infrastructure, it will help
validate assumptions and expose problems early. To facilitate the platform
adoption, involve the developers teams early in the process, you’re actually
building this platform for them. Don’t assume you know best how applications
should run, what 3rd party components are needed or what dependencies they have.

The team who builds the platform will (most of the time) be responsible for
maintaining and updating it. Kubernetes moves fast, so the team will have the
chance to test and architect scenarios for cluster updates and upgrades before
they will go live. This will make the so-called Day 2 operations easier on the
long run. [GitOps](https://www.weave.works/technologies/gitops/) practices are
becoming the golden standard in managing the lifecycle of the infrastructure.

## Containerize the applications

[Docker](https://docs.docker.com/) is available on all platforms now, so
developers can work on containerising their apps while the platform is being
built. Writing a Dockerfile doesn’t have to be complicated. Also, if we talk
about enterprise applications, the vendors started to distribute their
applications as container images. If you do need to start from scratch, build on
top of official images, and use them as inspiration in regards to layering
structure, configuration management, parameter injection, permissions. There’s
work done on optimising those images already and they’re also tested against
vulnerabilities. Minimalism is key here:

- the smaller the image the better (less area to attack, faster start-time, less
  storage consumed, data transfer costs, etc)

- the user that runs in the container should get only the permissions required
  to run the application and nothing more

There is excellent documentation around that part, and quite a few developers
are already familiar with this topic. Every application has some configuration
that needs to be injected at runtime, so you’ll need to figure out how to handle
that. Tools like [dockerize](https://github.com/jwilder/dockerize) can help
here.

## Setup a container registry

Once you can build Docker images, you’ll need to store them somewhere. If you
will run Kubernetes in a public cloud, your registry should be in the same
region (for latency and cost purposes). You can either use your current artifact
registry if you have one that can handle docker images (Artifactory, Nexus etc),
or better use the one from the cloud provider (simpler integration with k8s,
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
  (cloud) region. Don’t need to over optimize here. But do avoid a hybrid setup
  (like registry on prem and k8s in the cloud) due to transfer costs and
  latency.

## Security and secret management

Kubernetes is not good at keeping a secret. The default secret primitives are
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

## Logging and monitoring

Most vendors support and can consume Kubernetes metrics and logs by now, but
this migration is a good opportunity to catch up and get rid of legacy.
Consuming the standard cloud provided logging/monitoring is the easiest way to
go, especially if you’re using a managed Kubernetes (native integration, no
headache with administration, backups, storage, etc). Open source tools are also
a valid option (ELK stack, Prometheus, etc), but they do need to be managed,
backed-up and upgraded. The other alternatives are the SaaS solutions (DataDog,
Sysdig, NewRelic, Elastic, etc) which will scale your costs in line with your
cluster size.

Migration to Kubernetes brings most of the time the “you build it you run it”
paradigm, so you’ll need to be confident you’re monitoring the right things, and
don’t wake up people in the middle of the night for things that are not urgent.

## Setup CI/CD pipelines for building the container images

Migration to Kubernetes doesn’t necessarily mean you will need a completely new
CI/CD stack, but there are new products that have better understanding of the
new infrastructure compared to the good old Jenkins. There’s a momentum towards
GitOps practices, basically versioning the state of everything that runs in
Kubernetes (including the infrastructure itself), storing it in git and
reconciling to the desired state. To follow this path, there are new tools (like
[argo cd](https://argoproj.github.io/argo-cd/),
[weave flux](https://github.com/fluxcd/flux)) that facilitate those patterns and
allow progressive delivery of the application.

Think first at your current requirements in regards to CI/CD, maybe there are
tools you currently use that you can take with you (e.g. a tightly coupled
Jenkins for test automation). First of all, you will need to cover the basics
and ensure your applications can build, run tests and can be deployed using
containers. The fancy stuff (like service meshes) may or may not be needed at
all, don’t over engineer the CI/CD, it should be trivial to deploy.

To handle the yaml hell you will probably need to use a tool that can template
or help you customize the Kubernetes manifests. This is needed to facilitate
application updates. You will need to think about how to introduce a new
environment variable, promote a new container image/release or how to create a
new environment without duplicating the number of lines of configuration.

## Figure out the dependencies (enterprise spaghetti)

Often, Kubernetes adoption is linked to a broader ambition for enterprises to
consume/migrate to cloud and eventually use more open source. If you worked in
any company that's been on the market for more than 10 years, you experienced
some sort of (legacy) enterprise software. Those stacks are still there because
they are reliable (maybe years of uptime with 1-2 instances ?), the companies
behind them offer support, upgrades and SLA (thus taking most of the risk). But
at the same time those software are not always cloud friendly, not container
friendly (things started to change), they are resource savvy, expensive
(licensing, account managers, etc) and hard to operate. On top of that, over the
years, there were several layers of code, business logic, architecture and
“temporary solutions” applied that made it hard to migrate or blend them with
modern architectural patterns. Also those software “don’t just float” in the
datacenter. They are usually highly coupled with other enterprise software,
batch jobs, databases, storage systems, mainframes etc. This may become a
blocker, so it’s better to discover your dependencies early in the process.

There is a few options for fixing it:

- Connect directly from Kubernetes to those systems if possible (easiest)

- Containerize the source systems and run them in Kubernetes

- Use a 3rd party tool as an integration framework like Apache Camel

- Operate the changes at the legacy system (hard)

## Platform adoption

It doesn’t really matter how beautiful the new infrastructure is if the
developers are not using it. The platform adoption should happen during the
entire migration process, and it is arguably the most important part. Kubernetes
is just the bottom layer of your new technology stack, the way your development
teams are leveraging it, will be the differentiator for the business at the end
of the day. There are a few things that will facilitate the adoption:

**Train the people** - Don’t expect to get adoption without investing the right
amount of time into training the people. There are a lot of new technologies and
concepts that come together bundled with Kubernetes, developers will need some
guidance and dedicated time to make sense of it.

**Internally evangelise the new platform** - Identify the teams that are usually
early adopters of technologies and work with those first. They will champion the
platform and will become the examples others will want to follow. Organise
events (demo’s, hackathons, knowledge sharing sessions) where people can see the
new platform in action. Allow development teams to “try before they buy”.

**Developer Experience** - A good developer experience will increase adoption
and keep the developers teams happy. This includes good documentation and
examples, FAQ’s, easy access, usability and in general a focus on the removal of
friction in using the platform.

## Go Live (Day 0)

With all those in place, you are ready to go live. There are a few possible
scenarios that will help to minimise the risks of failure at this stage. If you
covered the previous steps, this part shouldn’t be painful. Start with the
simplest applications and create a plan to migrate what can be migrated based on
previous application learnings, common sense and complexity. Good luck with your
migration and enjoy the ride!

_Notes: The picture is made by me at Utrecht Central Station while I was on my
way to the Rabobank HQ_

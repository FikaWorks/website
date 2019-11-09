---
title: "Deploying Kubernetes addons with Makefiles"
date: 2019-11-08T14:39:16+06:00
author: Etienne Tremel
image: images/blog/deploying-kubernetes-addons-with-makefiles.jpg
description: "Deploying Kubernetes addons using make and Makefile"
tags: ["kubernetes", "deployment", "makefile", "cluster-addons"]
---

This article demonstrate how applications together with their configuration can
be organized in a repository and deployed using [Make][make]. In this case, all
the applications that form the required eco-system to run an environment
([nginx ingress controller][nginx-ingress], [prometheus][prometheus],
[rbac][rbac], [pod security policies][psp], etc.). In Kubernetes such
application are called addons and are usually managed by a cluster
administrator.

For the one that are impatient, the source code of such structure is available
on [Github][deploy-kubernetes-addons-makefile-example].

But first, what is [Make][make]?

## What is Make?

[Make][make] is an utility to maintain groups of programs. In a normal setup,
[Make][make] is used to automatically determine which pieces of a large program
need to be recompiled but it is not only tight to building applications. There
is a bunch of other build utilies ([Ant][ant], [Rake][rake], [Bazel][bazel],
etc.) but [Make][make] is the most widespread amongst them.

## How can it be used to deploy Kubernetes addons?

[Make][make] can be used as command line utility to execute tasks in a specific
order therefore it can also be used to orchestrate the deployment of
applications.

When working in a cloud-native environment, the installation and maintenance of
an application varies depending on the technology. Most of the time, the
configuration already exist out there ([Helm charts][helm-charts],
[Kustomize][kustomize] packages, [Terraform][terraform], [AWS
Cloudformation][aws-cloudformation], etc.) and only a small piece of this
application needs to be changed to have it adjusted to work in your own
environment.

Additionally, application configuration can differ from one environment to
another (security policies, role base access control, etc.) which can be
difficult to manage and prone to error. Re-using configuration and only
changing a piece of it for the targetted environment is essential. Keep it DRY.

## How do we organize all of this?

The method described below is fairly simple and lets you decide what
application and which version can be deployed to a given environment.
Configuration can be shared accross environment. The steps to execute the
deployment of an application are independant from each other which provide
flexibility.

Each application configuration is stored in its own directory.

```md
├── external-dns/
│   ├── Makefile
│   ├── README.md
│   ├── values.common.yaml
│   ├── values.development.yaml
│   └── values.minikube.yaml
│   └── values.production.yaml
|
├── limit-ranges/
├── namespaces/
├── nginx-ingress/
├── psp/
├── rbac/
|
├── env.development.mk                  <  Environment files
├── env.minikube.mk
├── env.production.mk
|
├── Makefile
├── README.md
└── common.mk                           < Common make functions/variables
```

It uses inheritance (aka overlays) where you have a common configuration (the
base) and an environment configuration which override any settings from the
common configuration.

The following `Makefile` demonstrate how the configuration is being applied to
a [Kubernetes][kubernetes] cluster using `kubectl`.

```make
include ../env.$(ENVIRONMENT).mk
include ../common.mk

.PHONY: deploy
deploy:
  kubectl apply -f ./$(ENVIRONMENT).yaml
```

Note the first includes instruction which loads configuration for the
environment.

The environment configuration could look like this:
```make
# Basic example of what the env.development.mk could look like
KUBE_CONTEXT = aks-development

# Azure Keyvault name where secrets are stored (ie: cloudflare password)
AZURE_KEY_VAULT_NAME = my-infra

# Applications to deploy. Each application is a directory in the repository.
# (order is important)
APPS = \
  namespaces \
  limit-ranges \
  nginx-ingress \
  external-dns \
  psp \
  rbac

# Ref: https://github.com/helm/charts/tree/master/stable/nginx-ingress
NGINX_INGRESS_CHART_VERSION = 1.24.3

# Ref: https://github.com/helm/charts/blob/master/stable/external-dns
EXTERNAL_DNS_CHART_VERSION = 2.6.4
```

The following is an example of directory structure for a
[Helm][helm] chart deployment:
```md
└── external-dns
    ├── Makefile
    ├── README.md
    ├── values.common.yaml
    ├── values.development.yaml
    └── values.minikube.yaml
    └── values.production.yaml
```

And below is a directory structure for deploying [Kubernetes][kubernetes]
manifests. It can also be used to deploy overlays using [Kustomize][kustomize].
```md
└── rbac
    ├── common
    │   └── cicd-user.yaml
    ├── development
    │   ├── cicd-user.yaml
    │   ├── user-1.yaml
    │   └── user-2.yaml
    ├── minikube
    │   ├── cicd-user.yaml
    │   ├── user-1.yaml
    │   └── user-2.yaml
    ├── production
    │   └── cicd-user.yaml
    ├── Makefile
    └── README.md
```

## How to deploy using this framework?

From this, you can provision a full environment with one command (to be
executed from the root directory):
```bash
$ ENVIRONMENT=development make deploy-all
```

You can also deploy one application at a time:
```bash
$ ENVIRONMENT=development make deploy-nginx-ingress
```

The next step would be to have these tasks executed as part of your CI/CD
process. For example the development environment can be applied when changes
are made to the master branch of this configuration repository and the
production deployment can be triggered when a tag is created via the release
page in Github.

Some might find it funky. It is definitely not perfect but gets things done in
a really simple way. Perfect for prototyping!

Hope that helps, make sure to check the full example on Github:

[https://github.com/thecloudnatives/deploy-kubernetes-addons-makefile-example][deploy-kubernetes-addons-makefile-example]


[ant]: https://ant.apache.org
[aws-cloudformation]: https://aws.amazon.com/cloudformation/
[bazel]: https://bazel.build
[deploy-kubernetes-addons-makefile-example]: https://github.com/thecloudnatives/deploy-kubernetes-addons-makefile-example
[helm-charts]: https://github.com/helm/charts
[helm]: https://helm.sh
[kubernetes]: https://kubernetes.io
[kustomize]: https://github.com/kubernetes-sigs/kustomize
[make]: https://www.gnu.org/software/make/
[nginx-ingress]: https://github.com/kubernetes/ingress-nginx
[prometheus]: https://prometheus.io
[psp]: https://kubernetes.io/docs/concepts/policy/pod-security-policy/
[rake]: https://github.com/ruby/rake
[rbac]: https://kubernetes.io/docs/reference/access-authn-authz/rbac/
[terraform]: https://terraform.io

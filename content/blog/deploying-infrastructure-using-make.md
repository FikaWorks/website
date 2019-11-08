---
title: "Deploying infrastructure using Make and Makefiles"
date: 2019-11-08T14:39:16+06:00
author: Etienne Tremel
image: images/blog/deploying-infrastructure-using-make.jpg
description : "Deploying an infrastructure eco-system using Make and Makefile"
---

This article is a demonstration on how applications, configurations and
dependencies can be organized in a repository and deployed using Make. In this
case, all the applications that form an eco-system required to run an
environment (nginx, prometheus, rbac, pod security policies, etc.).

The source code is available on
[Github](https://github.com/thecloudnatives/infrastructure-deployment-makefile-example).

But first, what is Make?

## What is Make?

[Make](https://en.wikipedia.org/wiki/Make_(software) is an utility to maintain
groups of programs. In a normal setup, Make is used to automatically determine
which pieces of a large program need to be recompiled but it is not only tight
to building applications. There is a bunch of other build utilies (Ant, Rake,
Bazel, etc.) but Make is the most widespread amongst them.

## How can it be used for deploying infrastructure?

Make is not only tight to building applications. It can be abused as command
line utility to execute task in a specific order therefore it can also be used
to orchestrate the deployment of applications.

When working in a cloud-native environment installation/maintenance of
application vary depending on the technology. Most of the time, the
configuration already exist out there an (Helm charts, Kustomize packages, AWS
Cloudformation, etc.), only a little piece of this application need to be
changed to have it adjusted to work in your own environment.

Additionally, application configuration can differ from one environment to
another (security policies, role base access control, etc.) which can be
difficult to manage and prone to error. Re-using configuration and only
changing piece of it for the targetted environment is essential. Keep it DRY.

## How do we organize all of this?

The method described below is fairly simple and let you decide what application
and which version can be deployed to a given environment. Configuration can be
shared accross environment. The steps to execute the deployment of an
application are independant from each other which provide flexibility.

Each application configuration is stored in its own directory.

```
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
a [Kubernetes](https://kubernetes.io) cluster using `kubectl`.

```make
include ../env.$(ENVIRONMENT).mk
include ../common.mk

.PHONY: deploy
deploy:
  kubectl apply -f ./$(ENVIRONMENT).yaml
```

Note the first include instruction which load configuration for the
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
[Helm](https://helm.sh) chart deployment:
```
└── external-dns
    ├── Makefile
    ├── README.md
    ├── values.common.yaml
    ├── values.development.yaml
    └── values.minikube.yaml
    └── values.production.yaml
```

And below is a directory structure for deploying Kubernetes manifests, it can
also be used to deploy overlays using Kustomize.
```
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

From this, you can spinnup a full environment with one command (to be executed
from the root directory):
```bash
$ ENVIRONMENT=development make deploy-all
```

You can also deploy one application at a time:
```bash
$ ENVIRONMENT=development make deploy-nginx-ingress
```

The next step would be to have these tasks executed as part of your CI/CD
process. For example the development environment can be applied when changes
are applied to the master branch of this configuration repository and the
production deployment can be triggered when a tag is created via the release
page in Github.

Some might find it funcky. It is definitely not perfect but get the things done
in a really simple way. Perfect for prototyping!

Hope that help, make sure to check the full example in Github:
[https://github.com/thecloudnatives/infrastructure-deployment-makefile-example](https://github.com/thecloudnatives/infrastructure-deployment-makefile-example)

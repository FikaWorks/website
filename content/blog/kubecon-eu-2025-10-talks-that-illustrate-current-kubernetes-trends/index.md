+++
author = 'Adam Otto'
date = '2025-04-23T10:00:00+02:00'
draft = false
image = 'kubecon-eu-2025-london.jpg'
tags = ['Kubernetes', 'Technology']
title = 'KubeCon EU 2025: 10 Talks That Illustrate Current Kubernetes Trends'
+++

KubeCon EU 2025 is over, and the CNCF has made all the talks available on
YouTube. This is a good chance to go back and see what was shared, especially
the main cloud-native - kubernetes trends from this year. The FikaWorks team
watched many of the sessions and picked 10 talks that we thought were especially
interesting and useful. These talks are not ranked in any particular
order—instead, we grouped them by theme. From platform engineering to AI, this
list shows some of the talks we think are most worth your time.

## **Platform engineering:**

Is 2025 the year when Jeff Bezos’ API mandate finally becomes a reality? Judging
by the number of talks focused on multi-cluster setups and Kubernetes API
extensions, it certainly seems that way. Projects like KCP are gaining traction,
sending a strong signal that Kubernetes is no longer just about pods and
containers. Instead, it's increasingly seen as a powerful and flexible API
platform that can serve as the backbone of modern enterprise infrastructure.

One great talk that explores this is:

- **Extending Kubernetes Resource Model (KRM) Beyond Kubernetes Workloads** -
  Mangirdas Judeikis, Cast AI & Nabarun Pal, Independent

{{< youtube "y0JgZ-hQ-Bo" >}}

One of the key advantages of using a Kubernetes-style API is the ability to
build operators, helping organizations move closer to infrastructure
hyper-automation. In this talk, Nick Young shares a lot of practical insight
into the common issues you might face when writing controllers and operators. A
surprising (and encouraging) moment came when he asked the audience how many had
already written an operator—about 60–70% raised their hands. It’s a strong sign
that the shift toward automation using operators is well underway. At FikaWorks,
we were especially glad to see this, as we’ve been advocating for the operator
pattern since the early days of Kubernetes.

- **Don't Write Controllers Like Charlie Don't Does: Avoiding Common Kubernetes
  Controller Mistakes** - Nick Young, Isovalent at Cisco

{{< youtube "tnSraS9JqZ8" >}}

One of the long-time goals for many platform teams is having the ability to
manage everything from a single, centralized place. In the following talk,
Marvin Beckers and Stefan Schimanski present a proof of concept for adding
multi-cluster support to the well-known controller-runtime library. If this idea
gains traction in the community, it could be a real game changer for platform
engineering, making it much easier to build organization-wide control planes.

- **Dynamic Multi-Cluster Controllers With Controller-runtime** - Marvin Beckers
  & Stefan Schimanski

{{< youtube "Tz8IcMSY7jw" >}}

If you're wondering whether organization-wide operators can actually handle that
scale, Tim Ebert’s talk is a must-watch. He dives into how to implement resource
sharding for Kubernetes operators, which allows them to scale horizontally and
manage large amounts of resources more effectively.

- **Beyond the Limits: Scaling Kubernetes Controllers Horizontally** - Tim
  Ebert, STACKIT

{{< youtube OTzd9eTtLRA >}}

If both of these ideas continue to mature and move beyond the proof-of-concept
stage, they could significantly expand what’s possible with Kubernetes and how
it’s used at scale.

Another important talk to catch is the one about Helm 4, which is planned for
release later this year. This new version brings several improvements, including
better support for using Helm as a library—not just as a command-line tool. For
more details on what’s coming and how it can improve your workflows, we
recommend watching the presentation by Matt Farina and Andrew Block.

- **Helm 4 You** - Matt Farina, SUSE & Andrew Block, Red Hat

{{< youtube "rdTPbm9f_fc" >}}

The final talk we’d like to highlight in the platform engineering section comes
from engineers at Bloomberg, who shared their experience running Trino—a
distributed SQL query engine—on Kubernetes. It’s always encouraging to see
Java-heavy workloads like Trino successfully integrated into the Kubernetes
ecosystem. This was made possible through the use of custom resources, an
operator, and established cloud-native tools like OPA and Envoy. It’s a great
example of the operator pattern being applied in the data analytics space. Talks
like this are a good reminder that with the right approach, even complex
software can be made Kubernetes-native.

- **Trino and Data Governance on Kubernetes** - Sung Yun & Aki Sukegawa,
  Bloomberg

{{< youtube "vCfehltPKxk" >}}

## **AI:**

We start the AI section with a talk from Justin Santa Barbara and Walter Fender
of Google, who showed how large language models can go beyond code suggestions
to generate production-grade Kubernetes controllers. By breaking the work into
smaller steps—such as generating KRM types and reconcilers—and using fine-tuned
models with custom tooling, their team built controllers for over a thousand
Google Cloud resources, something not easily achievable with tools like
Terraform. This talk offers a practical look at how AI can support real-world
infrastructure automation code.

- **AI Beyond Autocomplete: Using LLMs To Create 1000 Kubernetes Controller**s
  - Justin Santa Barbara & Walter Fender, Google

{{< youtube "_oIoaW5i-xE" >}}

AI depends heavily on high-performance computing, but connecting HPC systems
with Kubernetes isn’t easy. In this talk, Dennis Marttinen from Aalto University
introduces _Supernetes_, a tool that maps Slurm-managed HPC jobs directly to
Kubernetes using thousands of virtual kubelets. Tested on LUMI, one of the
world’s top supercomputers, it shows that Kubernetes is ready for HPC—and that
bridging the two is key for future AI workloads.

- **Thousands of Virtual Kubelets: 1-to-1 Mapping a Supercomputer To Kubernetes
  With Supernetes** - Dennis Marttinen, Aalto University

{{< youtube "QbR908kgk1Y" >}}

GPUs are powerful—but expensive—so making the most of them is critical for
running AI workloads at scale. In this talk, Yuan Chen (NVIDIA) and Chen Wang
(IBM Research) offer a hands-on guide to benchmarking GPU performance in
Kubernetes. They walk through practical tools and benchmarks for training,
inference, and stress testing, using frameworks like NVIDIA Triton, MLPerf, and
fmperf. This session provides valuable insights for teams looking to optimize
GPU utilization and improve the efficiency of AI workloads in Kubernetes
environments.

- **A Practical Guide To Benchmarking AI and GPU Workloads in Kubernetes** -
  Yuan Chen, NVIDIA & Chen Wang, IBM Research

{{< youtube "OnqzoBf7dUE" >}}

Last but not least, don’t miss the talk from FikaWorks collective member Andrea
Giardini, who shared how Kubernetes is used to power AI systems for wildfire
prevention. The session covers processing large volumes of satellite and
environmental data, using GPUs effectively, and building a reliable, scalable
platform. It’s a strong example of how Kubernetes can support real-world,
high-impact use cases beyond traditional IT.

- **Kubernetes and AI To Protect Our Forests: A Cloud Native Infrastructure for
  Wildfire Prevention** - Andrea Giardini, Crossover Engineering BV

{{< youtube "1rtyQaTfbdM" >}}

## KubeCon EU 2025 made it clear:

Kubernetes is no longer just the foundation of cloud infrastructure — it’s
becoming the platform where organizations build everything from internal tooling
to AI-powered systems. Whether it was pushing the limits of multi-cluster
controllers, automating infrastructure with operators, or bridging HPC and AI,
this year’s talks showed just how much innovation is happening across the
ecosystem.

At FikaWorks, we’re always looking for practical ideas that teams can build
on,and we hope this list helps you catch up on the most relevant trends.  Let us
know if any of these talks sparked new ideas for you!

+++
author = 'Alex Giurgiu'
date = '2026-03-24T10:00:00+02:00'
draft = false
tags = ['AI agents', 'AI governance', 'enterprise AI', 'platform engineering', 'MCP', 'architecture']
title = 'From RAG to Agents: Why AI Governance Is an Architecture Problem'
+++

The last few enterprises I talked to are somewhere on the AI adoption curve.
Some started a year ago, some two years ago, but the pattern is always the same.
They start with something simple — a chatbot over internal docs, a summarisation
tool, maybe a coding assistant. Then they get more ambitious. Then things get
complicated.

Not technically complicated. Organisationally complicated.

This post is about that progression, and why the companies that treat governance
as an architecture problem — not a policy problem — are the ones that will
actually scale their AI efforts.

## The adoption curve everyone follows

There's a natural gravity to how companies adopt AI, and it looks roughly the
same everywhere:

**Phase 1: RAG and copilots.** RAG (Retrieval-Augmented Generation) is a
technique where an LLM pulls in relevant chunks of your own data — internal
docs, knowledge bases, support tickets — before generating a response. It's
useful because it lets companies get accurate, context-specific answers from a
model without having to fine-tune it. In practice, someone builds a proof of
concept that lets people ask questions over internal documentation. It works
surprisingly well. Leadership gets excited. More teams want it. You stand up a
few more use cases — maybe customer support, maybe internal knowledge bases,
maybe code assistance. This phase is relatively safe. The AI reads and
summarises. It doesn't do anything.

**Phase 2: Task-specific agents.** The obvious next question after "can it
answer questions?" is "can it do things?" So you give the LLM access to tools.
It can now query databases, file tickets, update CRM records, trigger
deployments. This is where function-calling and tool use come in. Each agent
does one thing, and it does it within a controlled scope. Still manageable.

**Phase 3: Multi-agent orchestration.** This is where it gets interesting. You
have agents that coordinate with other agents. An incident response agent that
talks to a monitoring agent, which talks to a runbook agent. The orchestration
complexity grows fast — almost exponentially when agents start delegating to
other agents. And this is where most organisations hit a wall.

The pattern is consistent because the incentives are consistent. RAG is low-risk
high-reward. Agents are higher-risk higher-reward. Multi-agent systems are where
the real payoff is, but also where things can go sideways in ways that are hard
to predict.

[Gartner expects](https://www.gartner.com/en/newsroom/press-releases/2025-08-26-gartner-predicts-40-percent-of-enterprise-apps-will-feature-task-specific-ai-agents-by-2026-up-from-less-than-5-percent-in-2025)
40% of enterprise apps to embed task-specific AI agents by the end of 2026, up
from less than 5% in 2025. That's a massive jump. But here's the uncomfortable
number:
[according to MIT](https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/),
95% of generative AI pilots fail to reach production. Not because the technology
doesn't work. Because the organisation isn't set up to operate it safely.

## The governance gap

When you're doing RAG, governance is straightforward. You control what data goes
into the retrieval pipeline. You review outputs. The blast radius of a bad
response is someone getting a wrong answer. Annoying, but not dangerous.

When you move to agents, the blast radius changes completely. An agent with
write access to your production systems can do real damage. An agent that can
send emails on behalf of your company can create legal liability. An agent that
processes personal data without proper controls can put you on the wrong side of
the EU AI Act, which starts enforcing high-risk system requirements in
August 2026.

And yet, most companies I see are building agents with the same governance
posture they had during the RAG phase. Which is to say, almost none.

68% of employees are already using AI tools without IT approval. Shadow AI is
not a hypothetical — it's the current state of affairs in most enterprises. Only
about 10% of organisations report having a strategy for managing autonomous AI
systems. That's a problem when you consider that non-human identities (service
accounts, agent identities, API keys) are expected to exceed 45 billion by end
of 2026. That's 12x the human global workforce.

The question shifts from "is the model accurate?" to "who is accountable when
the system acts?" That's a different kind of question, and most governance
frameworks built for traditional software don't have a good answer for it.

## Governance is not a committee

Here's where I see companies get stuck. They recognise they need governance, so
they form a committee. The committee meets monthly. They write policies. They
create approval workflows. And then delivery teams route around the committee
because it's too slow.

This doesn't work. Not because governance is wrong, but because implementing it
as a human process that sits outside the delivery pipeline doesn't scale.

The companies that actually make this work treat governance as an engineering
problem. They build it into the architecture. The same way you wouldn't deploy a
web application without authentication, you shouldn't deploy an agent without
permission scoping, action logging, and human-in-the-loop checkpoints for
high-impact operations.

Three patterns I keep seeing in organisations that do this well:

**Intake and classification.** Every AI use case gets registered, classified by
risk tier and data sensitivity, and routed to the appropriate approval path
before anyone starts building. Not a heavyweight process — a lightweight one
that's embedded in the project kickoff. A chatbot over public docs gets
fast-tracked. An agent that processes financial data gets a deeper review. The
point is that everything is known and classified.

**Continuous assurance.** Testing doesn't happen once before launch. You test
throughout the lifecycle. You red-team your agents regularly. You monitor for
drift in behaviour. You version your prompts the same way you version your code,
because they are code.

**Runtime governance.** The governance doesn't stop when the agent is deployed.
Every action is logged immutably. There are circuit breakers for when an agent
starts behaving outside its expected boundaries. There are clear escalation
paths. This is where defence-in-depth matters most — no single guardrail is
sufficient. A landmark 2025 paper from OpenAI, Anthropic, and Google DeepMind
tested 12 published prompt injection defences and bypassed all of them with over
90% success rate. You can't rely on a single layer of defence.

## What the architecture actually needs to look like

So what does this mean concretely? What does a platform architecture look like
when governance is a first-class concern?

**An AI gateway as the control plane.** Every LLM request — whether from a
simple RAG app or a complex multi-agent workflow — flows through a centralised
gateway. This is where you enforce rate limits, content policies, access
controls, cost management, and audit logging. Think of it as the API gateway
pattern, but for AI. You can't govern what you can't see, and the gateway gives
you visibility into everything.

**Per-agent permission scoping.** Each agent gets the minimum permissions it
needs. Read vs write vs execute are separate grants. Tool access is an explicit
allow-list, not a default-allow. If your incident response agent needs to read
Kubernetes pod logs, it gets read access to the logs API. It doesn't get kubectl
exec. This is least-privilege applied to agents, and it maps directly to how MCP
servers work — each server exposes a controlled set of capabilities, and the
agent can only use what's been explicitly made available.

**Human-in-the-loop for consequential actions.** Not everything needs human
approval. An agent that summarises a document? Let it run. An agent that's about
to execute a database migration or send a customer communication? That needs a
human checkpoint. The architecture needs to support tiered autonomy — routine
decisions flow automatically, high-stakes decisions pause for review.

**Immutable action logging.** Every agent action — every model call, every tool
invocation, every decision — gets logged in a way that can't be tampered with.
This isn't just for compliance. It's for debugging. When an agent does something
unexpected, you need to be able to reconstruct exactly what happened. Think
distributed tracing, but for agent decisions — and it remains one of the biggest
unsolved problems in the space.

**Isolation and blast radius containment.** Agents should run in isolated
environments. If an agent goes rogue or gets compromised through prompt
injection, the damage should be contained. This means network segmentation,
dedicated execution environments, and clear boundaries between what different
agents can access. The same principles we apply to microservices — loose
coupling, independent deployability, failure isolation — apply here.

**Supply chain security.** You're pulling models from Hugging Face, using
open-source frameworks, connecting to third-party MCP servers. Each of these is
an attack surface. In 2024, there was a 6.5x increase in malicious models on
Hugging Face alone. Model signing, AI bills of materials, safe serialisation
formats — these aren't nice-to-haves. This is software supply chain security all
over again, and it needs the same rigour.

## The platform team's role

If you squint, this looks a lot like platform engineering. And that's not a
coincidence.

The same way platform teams built paved roads for deploying containers and
managing Kubernetes clusters, they now need to build paved roads for deploying
and operating AI agents. The platform should make the right thing easy and the
wrong thing hard. Teams shouldn't have to figure out governance, security, and
observability for each agent they build. They should inherit it from the
platform.

This is the "platform as product" model applied to AI. The platform team
provides: model access through the gateway, pre-configured guardrails, standard
deployment patterns, evaluation harnesses, monitoring dashboards, and incident
playbooks. Domain teams build their agents on top of this foundation. They focus
on the business logic, not the infrastructure and governance plumbing.

The organisations I see making real progress with AI aren't the ones with the
most ambitious use cases. They're the ones that built the foundations first.
Gateway. Permissions. Logging. Monitoring. Then they open it up to teams who can
move fast because the guardrails are already in place.

## The uncomfortable truth

Here's what I think a lot of companies don't want to hear: moving from RAG to
agents is not primarily a technology challenge. The models are capable enough.
The frameworks exist. MCP and A2A are maturing fast.

The challenge is building the organisational and architectural muscle to operate
AI safely at scale. That means investing in platform capabilities that aren't
exciting — gateways, permission systems, audit logs, evaluation pipelines —
before investing in the flashy agent use cases.

It's the same lesson we learned with Kubernetes. The companies that succeeded
weren't the ones that adopted it fastest. They were the ones that built proper
platforms around it — with CI/CD, observability, security, and developer
experience baked in from the start.

AI is following the same pattern. The technology is the easy part. The hard part
is everything around it.

If your organisation is moving from RAG to agents, start with the architecture.
Build governance into the platform. Make it invisible to the teams building on
top of it. That's how you actually make this work.

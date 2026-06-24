export type KeywordSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export type KeywordFaq = {
  question: string
  answer: string
}

export type KeywordPage = {
  path: string
  eyebrow: string
  title: string
  description: string
  h1: string
  lede: string
  intent: string
  ctaLabel: string
  sections: KeywordSection[]
  faqs: KeywordFaq[]
}

export const keywordPages: KeywordPage[] = [
  {
    path: '/deer-flow-ai',
    eyebrow: 'DeerFlow AI',
    title: 'DeerFlow AI Managed Workspace',
    description:
      'Understand how DeerFlow AI turns sub-agents, memory, skills, and sandbox execution into a managed workspace for long-horizon research, coding, and operations.',
    h1: 'DeerFlow AI for long-horizon agent work that needs a real operating loop',
    lede:
      'DeerFlow AI is a managed workspace inspired by DeerFlow 2.0: a super agent harness built around sub-agents, memory, skills, tools, and sandboxed execution. The point is not another chat box. The point is a safer way to finish work that takes many steps.',
    intent: 'For teams comparing DeerFlow, deer flow style agents, and managed agent workspaces before choosing a plan.',
    ctaLabel: 'Choose Flow annual',
    sections: [
      {
        heading: 'What makes the DeerFlow approach useful',
        paragraphs: [
          'Classic agent demos often stop after one prompt or one tool call. DeerFlow is more interesting because it treats the agent as a harness: a lead process can coordinate specialist sub-agents, remember context, call skills, and run work in a sandbox.',
          'That shape maps well to serious work. A research task can search, crawl, compare, cite, and write. A coding task can plan, edit, test, and summarize. An operations task can monitor, triage, and wait for approval before acting.',
        ],
        bullets: [
          'Sub-agents divide work without losing the main thread.',
          'Memory keeps repeat work from starting cold.',
          'Sandbox execution keeps powerful tools inside a defined boundary.',
          'Skills make tools reusable instead of one-off prompts.',
        ],
      },
      {
        heading: 'Where a managed workspace helps',
        paragraphs: [
          'The open-source repository is the right place to inspect the architecture and run a local evaluation. A managed workspace becomes useful when the team wants onboarding, plan choice, payment, analytics, and a simpler path from evaluation to operation.',
          'The homepage planner starts with the mission shape before it asks for payment. That is deliberate: the right plan depends on the type of work, memory needs, channel, and safety level.',
        ],
      },
      {
        heading: 'The buying path',
        paragraphs: [
          'Flow annual is selected by default because most real DeerFlow AI evaluations need more than a tiny demo but do not need enterprise private runners on day one.',
          'Checkout opens in a centered Polar popup. The original DeerFlow site stays visible behind a blurred backdrop, which keeps the decision context in place while payment is completed.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is DeerFlow AI the same as the open-source DeerFlow repository?',
        answer:
          'No. The open-source project remains available on GitHub. This site packages a managed SaaS buying and onboarding path around DeerFlow-style agent workflows.',
      },
      {
        question: 'What plan is selected by default?',
        answer:
          'The middle Flow plan is selected by default with annual billing on. Annual billing is 50% cheaper than the monthly run-rate.',
      },
      {
        question: 'Why does checkout stay in a popup?',
        answer:
          'It lets the buyer keep the product page, plan context, and trust signals open while finishing the hosted Polar payment.',
      },
    ],
  },
  {
    path: '/deer-flow-vs-openclaw',
    eyebrow: 'Comparison',
    title: 'Deer Flow vs OpenClaw',
    description:
      'Compare Deer Flow and OpenClaw for long-horizon agent work, local access, message channels, sandboxing, memory, and managed deployment choices.',
    h1: 'Deer Flow vs OpenClaw: choose by workflow shape, not hype',
    lede:
      'Deer Flow and OpenClaw are both part of the modern agent stack conversation, but they tend to fit different decisions. DeerFlow is strongest when you need a harness for long-running research, coding, memory, skills, and sandboxed execution. OpenClaw is often discussed as a personal or multi-channel agent gateway.',
    intent: 'For buyers deciding whether a DeerFlow AI workspace or an OpenClaw-style assistant fits the job they actually need done.',
    ctaLabel: 'Start Flow annual',
    sections: [
      {
        heading: 'The practical distinction',
        paragraphs: [
          'If your main job is to coordinate a complex task from planning through execution and final output, DeerFlow-style orchestration is a natural fit. It is built around a harness that can route work through sub-agents, memory, tools, and sandbox execution.',
          'If your main job is to connect a personal assistant to many message channels and day-to-day services, an OpenClaw-style gateway may be closer to the starting point. The right choice depends less on brand and more on the trust boundary around the work.',
        ],
        bullets: [
          'Choose DeerFlow AI for long research, code creation, report generation, and controlled tool runs.',
          'Choose an OpenClaw-style path when messaging channels and personal assistant workflows are the center.',
          'Use stricter sandboxing whenever either system can read files, run commands, or call external tools.',
        ],
      },
      {
        heading: 'Security and trust questions',
        paragraphs: [
          'Both categories can become risky if they are given broad local access without boundaries. The question is not whether an agent sounds capable. The question is what it can touch, who can trigger it, what it remembers, and where approval is required.',
          'The managed DeerFlow AI flow keeps strict sandboxing visible in the planner because serious buyers often need to explain safety before they explain automation.',
        ],
      },
      {
        heading: 'When to pay for the managed path',
        paragraphs: [
          'Pay when the first workflow is clear, repeatable, and valuable enough to justify onboarding. Do not pay just because an agent framework is trending.',
          'The Flow annual plan is the default because it covers the most common serious evaluation: a real mission, long-term memory, sandboxed tools, analytics, and a hosted checkout path that does not interrupt review.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is Deer Flow better than OpenClaw?',
        answer:
          'Not universally. DeerFlow AI is better for long-horizon task orchestration. OpenClaw-style systems may be better when the center of gravity is a personal assistant gateway or message-channel access.',
      },
      {
        question: 'Can a team use both?',
        answer:
          'Yes. Some teams use one system as the channel or gateway and another as the long-running execution harness. The integration should be designed around permissions and auditability.',
      },
      {
        question: 'Which plan should comparison shoppers start with?',
        answer:
          'Start with Flow annual if the mission planner shows a good fit. Use Scale only when private runners, API embedding, or heavier operations are already required.',
      },
    ],
  },
  {
    path: '/deer-flow-docker',
    eyebrow: 'Docker',
    title: 'Deer-Flow Docker Deployment Guide',
    description:
      'A useful Deer-Flow Docker guide covering sandbox sizing, local evaluation, managed workspace tradeoffs, and when Docker is the right path.',
    h1: 'Deer-Flow Docker is the safest first serious evaluation path',
    lede:
      'The open-source DeerFlow project recommends Docker for practical development and production-style runs because sandboxed agent work needs more control than a single local process. This page explains when Docker is enough and when a managed workspace is faster.',
    intent: 'For technical users searching Deer-flow docker before deciding whether to self-host or use a managed DeerFlow AI plan.',
    ctaLabel: 'Compare with Flow annual',
    sections: [
      {
        heading: 'Why Docker matters for DeerFlow',
        paragraphs: [
          'A long-running agent can browse, call tools, write files, run scripts, and coordinate sub-agents. Docker gives that work a clearer execution boundary than running everything directly on a personal machine.',
          'Docker is also helpful when a team needs repeatable setup, shared runtime assumptions, and a cleaner path from local evaluation to a persistent server.',
        ],
        bullets: [
          'Use Docker when sandboxed execution is part of the trust model.',
          'Use local development for quick inspection and small experiments.',
          'Use managed cloud when onboarding speed matters more than owning every component.',
        ],
      },
      {
        heading: 'Sizing expectations',
        paragraphs: [
          'Agent harnesses are not tiny static sites. They need CPU, memory, storage, model/API configuration, and enough room for sandbox containers and generated files.',
          'A team should size the environment around the longest expected mission, not only the first prompt. If the workflow includes coding, crawling, report generation, and artifacts, leave headroom.',
        ],
      },
      {
        heading: 'Managed workspace tradeoff',
        paragraphs: [
          'Self-hosting gives maximum control and is the right choice for teams with infrastructure capacity. Managed DeerFlow AI removes setup friction and gives a clearer commercial path for teams that already know what they want to run.',
          'The homepage planner helps make this decision visible: if the mission needs Docker and strict safety but not private infrastructure yet, Flow annual is usually enough to start.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Do I need Docker to use DeerFlow?',
        answer:
          'For serious sandboxed runs, Docker is usually the safest practical default. Lightweight local evaluation can work, but high-privilege tools deserve stronger boundaries.',
      },
      {
        question: 'Can this SaaS replace self-hosted Docker?',
        answer:
          'It can replace the setup path for many teams, but teams that require full private infrastructure may still choose self-hosting or the Scale path.',
      },
      {
        question: 'Does checkout require leaving the page?',
        answer:
          'No. Polar checkout opens in a centered popup while the DeerFlow AI pricing page stays visible.',
      },
    ],
  },
  {
    path: '/deer-flow-github',
    eyebrow: 'GitHub',
    title: 'Deer-Flow GitHub Guide',
    description:
      'A practical Deer-flow GitHub guide for inspecting ByteDance DeerFlow, understanding 2.0 features, and deciding when a managed workspace helps.',
    h1: 'Deer-Flow GitHub is where trust starts. The workspace is where work continues.',
    lede:
      'The public bytedance/deer-flow repository is the right first stop for technical review. It shows the 2.0 architecture, setup path, Docker guidance, memory, skills, sub-agents, and safety notes. This SaaS path is for teams that want to move from inspection to a managed operating workflow.',
    intent: 'For users coming from GitHub who need a concise next step after reviewing the open-source DeerFlow project.',
    ctaLabel: 'Choose Flow annual',
    sections: [
      {
        heading: 'What to inspect in the repository',
        paragraphs: [
          'Start with the README, installation notes, configuration example, Docker folder, backend and frontend directories, and security notice. Those files tell you how the project expects models, tools, memory, and sandbox execution to be configured.',
          'Also inspect the active development branch and release notes. DeerFlow 2.0 is positioned as a ground-up rewrite, so old 1.x assumptions may not apply.',
        ],
        bullets: [
          'Check model provider configuration before planning a run.',
          'Check sandbox mode before enabling shell or file tools.',
          'Check memory behavior before using DeerFlow for repeated work.',
          'Check message-channel configuration before exposing tasks to chat tools.',
        ],
      },
      {
        heading: 'When GitHub is enough',
        paragraphs: [
          'GitHub is enough when you only need to inspect the code, run a local demo, or decide whether the architecture fits your team.',
          'GitHub stops being enough when the buyer needs onboarding, plan choice, a production checkout path, analytics, and a focused commercial workflow that non-maintainers can understand.',
        ],
      },
      {
        heading: 'How the managed site complements GitHub',
        paragraphs: [
          'This site keeps the public repo link visible but does not force every visitor into a code-first path. The mission planner turns repository curiosity into a concrete buying decision.',
          'That is useful for technical founders, automation teams, and operators who already understand DeerFlow but need a quicker way to package the first serious workflow.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is this the official DeerFlow GitHub project?',
        answer:
          'No. The official open-source repository is bytedance/deer-flow on GitHub. This site is a managed SaaS workflow built around DeerFlow-style capabilities.',
      },
      {
        question: 'Why mention GitHub on a paid site?',
        answer:
          'Technical buyers want to inspect the upstream project before paying. Clear access to the repository improves trust and reduces bad-fit clicks.',
      },
      {
        question: 'What is the next step after GitHub review?',
        answer:
          'Use the homepage mission planner, confirm the default Flow annual plan, then open the Polar checkout popup when the fit is clear.',
      },
    ],
  },
  {
    path: '/deer-flow-reddit',
    eyebrow: 'Community',
    title: 'Deer Flow Reddit Discussion Guide',
    description:
      'A useful guide to reading Deer Flow Reddit discussions, separating excitement from deployment reality, and choosing a safe evaluation path.',
    h1: 'Deer Flow Reddit discussions are useful when you read them like field notes',
    lede:
      'Reddit threads about DeerFlow 2.0 are good for spotting interest, rough edges, deployment questions, and real user expectations. They are less useful as a final buying guide. Use them to form questions, then verify the repo, safety model, and workflow fit.',
    intent: 'For people researching Deer flow reddit before deciding whether the project is worth testing or buying around.',
    ctaLabel: 'Plan a safe evaluation',
    sections: [
      {
        heading: 'What community threads can tell you',
        paragraphs: [
          'Community posts tend to surface the parts that matter to evaluators: whether setup felt heavy, which models worked, how Docker behaved, what broke, and whether long-running tasks felt reliable.',
          'That kind of feedback is valuable because agent frameworks often look polished in demos but reveal their real shape during setup, permissions, and repeat runs.',
        ],
        bullets: [
          'Look for repeated setup issues, not one-off complaints.',
          'Separate model-quality problems from harness or sandbox problems.',
          'Watch for security questions around tools, files, and external actions.',
          'Treat viral excitement as a signal to investigate, not a reason to skip review.',
        ],
      },
      {
        heading: 'What Reddit cannot decide for you',
        paragraphs: [
          'A Reddit thread cannot know your data, tool permissions, approval process, or risk tolerance. Those determine whether DeerFlow AI should be a lightweight pilot, a Flow annual workspace, or a private Scale rollout.',
          'The mission planner on this site is built to answer that missing context before checkout appears.',
        ],
      },
      {
        heading: 'A cleaner evaluation path',
        paragraphs: [
          'Read the discussions, inspect GitHub, choose one mission, set strict sandboxing, and measure whether the agent produces a useful handoff without excessive supervision.',
          'If that first mission has clear value, Flow annual is the default commercial path. If it needs private infrastructure or API embedding immediately, Scale may be the better conversation.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Should I trust Deer Flow Reddit posts?',
        answer:
          'Use them as qualitative field notes. Verify claims against the repository, docs, and your own test mission before making a buying decision.',
      },
      {
        question: 'What question should I ask after reading Reddit?',
        answer:
          'Ask what exact mission you want DeerFlow AI to complete, what tools it needs, and what safety boundary keeps that mission acceptable.',
      },
      {
        question: 'Can I start with the middle plan?',
        answer:
          'Yes. Flow annual is selected by default because it fits the most common serious evaluation path.',
      },
    ],
  },
  {
    path: '/deer-flow-bytedance',
    eyebrow: 'ByteDance',
    title: 'Deer Flow ByteDance Project Context',
    description:
      'Understand the ByteDance DeerFlow open-source project, why DeerFlow 2.0 drew attention, and how a managed SaaS workspace differs from the upstream repo.',
    h1: 'Deer Flow from ByteDance made the agent harness conversation more concrete',
    lede:
      'ByteDance open-sourced DeerFlow as a super agent harness for long-horizon work. The 2.0 direction focuses attention on sub-agents, memory, skills, sandboxing, setup, and deployment safety. This site turns those ideas into a managed SaaS buying path.',
    intent: 'For users searching Deer flow ByteDance and trying to understand the upstream project before choosing a managed product.',
    ctaLabel: 'Choose Flow annual',
    sections: [
      {
        heading: 'Why the ByteDance context matters',
        paragraphs: [
          'A large open-source release can change how buyers frame a category. DeerFlow gives teams a concrete project to inspect instead of vague promises about autonomous agents.',
          'The repository also makes the limits visible: setup, model configuration, Docker, message channels, sandbox choices, and security policy all matter before a long-running agent should touch important work.',
        ],
      },
      {
        heading: 'How the SaaS path differs',
        paragraphs: [
          'The managed DeerFlow AI site is not a replacement for reading upstream code. It is a conversion path for teams that already understand the value and want onboarding, plan clarity, payment, analytics, and a product-first workflow.',
          'That difference matters. The site should help a buyer move from interest to action without pretending the open-source project and the commercial workflow are the same thing.',
        ],
      },
      {
        heading: 'A good first mission',
        paragraphs: [
          'Pick one mission that is useful but bounded: a research brief, a repository change, a report pipeline, or an operations triage workflow. Give it explicit tools and approval points.',
          'If the mission planner returns a good fit, Flow annual is the recommended default and checkout stays in a centered Polar popup.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is DeerFlow by ByteDance?',
        answer:
          'The upstream open-source repository is published under ByteDance on GitHub. This managed SaaS site is a separate productized workflow around DeerFlow-style agent capabilities.',
      },
      {
        question: 'Does the ByteDance repo include Docker guidance?',
        answer:
          'Yes. The upstream materials include Docker-oriented setup and deployment guidance because sandboxed long-running agent work needs real runtime planning.',
      },
      {
        question: 'Why use a managed product if the project is open source?',
        answer:
          'Use managed DeerFlow AI when speed, onboarding, payment, analytics, and a focused workflow matter more than self-hosting every layer yourself.',
      },
    ],
  },
  {
    path: '/deer-flow-2-0-github',
    eyebrow: 'DeerFlow 2.0',
    title: 'Deer Flow 2.0 GitHub Guide',
    description:
      'A concise Deer flow 2.0 GitHub guide covering the rewrite, super agent harness features, setup expectations, and managed SaaS path.',
    h1: 'Deer Flow 2.0 GitHub review: what changed and what to do next',
    lede:
      'DeerFlow 2.0 is described upstream as a ground-up rewrite. That matters for evaluators because 2.0 is not just a patch release. It reframes DeerFlow as a super agent harness with sub-agents, memory, skills, tools, sandboxing, and channels.',
    intent: 'For technical buyers who searched Deer flow 2.0 github and need a fast, useful review path.',
    ctaLabel: 'Start Flow annual',
    sections: [
      {
        heading: 'What to look for in 2.0',
        paragraphs: [
          'Focus on the parts that change operational value: the agent harness, skill system, memory, sandbox mode, model provider configuration, and message gateway. Those decide whether DeerFlow can run real work rather than only showcase a demo.',
          'Also compare setup paths. A project that can run locally, in Docker, and behind a gateway gives teams more realistic choices.',
        ],
        bullets: [
          'Sub-agent orchestration for splitting complex work.',
          'Skills and tools for reusable actions.',
          'Sandbox and file system boundaries for safer execution.',
          'Context engineering and long-term memory for continuity.',
        ],
      },
      {
        heading: 'What a buyer should verify',
        paragraphs: [
          'Verify which models you plan to use, how API keys are stored, what tools are enabled, whether web crawling is needed, and who can trigger a run.',
          'If the workflow includes command execution or external actions, verify the approval policy before the first paid deployment. A better checkout flow cannot compensate for a vague trust boundary.',
        ],
      },
      {
        heading: 'The managed next step',
        paragraphs: [
          'After a GitHub review, the best next step is not a generic demo. It is one bounded mission with strict safety and a clear output.',
          'The DeerFlow AI homepage planner turns that mission into a plan recommendation. The middle Flow annual plan is selected by default, annual billing is 50% cheaper, and checkout returns to the homepage after payment succeeds.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is DeerFlow 2.0 compatible with 1.x assumptions?',
        answer:
          'Do not assume that. Upstream describes 2.0 as a ground-up rewrite, so evaluators should inspect the current repository and docs directly.',
      },
      {
        question: 'What is the most important 2.0 feature for buyers?',
        answer:
          'The harness shape: sub-agents, memory, skills, tools, and sandboxed execution together make long-horizon work more realistic.',
      },
      {
        question: 'What is the default commercial path?',
        answer:
          'Flow annual with annual billing enabled. It is the middle plan and is priced at a 50% annual discount versus monthly.',
      },
    ],
  },
]

export function findKeywordPageByPath(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '') || '/'
  return keywordPages.find((page) => page.path === normalized) ?? null
}

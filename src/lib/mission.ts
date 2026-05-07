export type PlanId = 'starter' | 'flow' | 'scale'

export type Option<T extends string = string> = {
  id: T
  label: string
  summary: string
}

export type MissionSelection = {
  goal: 'research' | 'code' | 'ops' | 'report'
  runtime: 'docker' | 'cloud' | 'hybrid'
  memory: 'session' | 'long'
  safety: 'standard' | 'strict'
  channel: 'web' | 'api' | 'im'
  output: 'brief' | 'repo' | 'asset'
}

export type MissionResult = {
  fitScore: number
  fitLabel: string
  headline: string
  recommendedPlanId: PlanId
  architecture: string
  runShape: string
  confidence: string
  reasons: string[]
  watchouts: string[]
  modules: Array<{ label: string; detail: string }>
  nextSteps: string[]
  operatorMessage: string
}

export const goalOptions: Option<MissionSelection['goal']>[] = [
  { id: 'research', label: 'Deep research', summary: 'Multi-source investigation, citations, notes, and final reports.' },
  { id: 'code', label: 'Code creation', summary: 'Plan, edit, run tests, and package changes with a review trail.' },
  { id: 'ops', label: 'Operations', summary: 'Recurring checks, tool calls, triage, and handoff summaries.' },
  { id: 'report', label: 'Briefing', summary: 'Long-form synthesis from web, docs, data files, and memory.' },
]

export const runtimeOptions: Option<MissionSelection['runtime']>[] = [
  { id: 'docker', label: 'Docker sandbox', summary: 'The practical default for isolated tools and longer runs.' },
  { id: 'cloud', label: 'Managed cloud', summary: 'Fastest route when the team wants a hosted workflow.' },
  { id: 'hybrid', label: 'Hybrid', summary: 'Cloud orchestration with private runners or controlled sandboxes.' },
]

export const memoryOptions: Option<MissionSelection['memory']>[] = [
  { id: 'session', label: 'Session memory', summary: 'Enough for short tasks and demos that do not need continuity.' },
  { id: 'long', label: 'Long-term memory', summary: 'Better for repeatable work, project context, and agent handoffs.' },
]

export const safetyOptions: Option<MissionSelection['safety']>[] = [
  { id: 'standard', label: 'Standard guardrails', summary: 'Good for low-risk research and supervised code runs.' },
  { id: 'strict', label: 'Strict sandbox', summary: 'Recommended when file writes, shell, or external tools are involved.' },
]

export const channelOptions: Option<MissionSelection['channel']>[] = [
  { id: 'web', label: 'Web app', summary: 'Best for focused plan review and product onboarding.' },
  { id: 'api', label: 'API', summary: 'Better for workflow embedding, agent gateways, and internal tools.' },
  { id: 'im', label: 'IM channel', summary: 'Useful when Slack, Lark, Telegram, or similar channels start tasks.' },
]

export const outputOptions: Option<MissionSelection['output']>[] = [
  { id: 'brief', label: 'Decision brief', summary: 'A structured result humans can approve or continue.' },
  { id: 'repo', label: 'Repository change', summary: 'Code, tests, and deployment notes in a tracked workflow.' },
  { id: 'asset', label: 'File package', summary: 'Reports, spreadsheets, generated assets, and delivery bundles.' },
]

export const defaultMissionSelection: MissionSelection = {
  goal: 'research',
  runtime: 'docker',
  memory: 'long',
  safety: 'strict',
  channel: 'web',
  output: 'brief',
}

export function analyzeMissionSelection(selection: MissionSelection): MissionResult {
  let score = 74
  const reasons: string[] = []
  const watchouts: string[] = []

  if (selection.runtime === 'docker') {
    score += 8
    reasons.push('Docker sandboxing matches DeerFlow-style long tasks that need tools without exposing the host directly.')
  } else if (selection.runtime === 'cloud') {
    score += 4
    reasons.push('Managed cloud is the fastest route for teams that want DeerFlow value without running the whole stack.')
  } else {
    score += 2
    watchouts.push('Hybrid deployments should define which tools can run in cloud and which stay private.')
  }

  if (selection.memory === 'long') {
    score += 7
    reasons.push('Long-term memory helps repeated deer flow work avoid starting from zero every session.')
  } else {
    score -= 4
    watchouts.push('Session-only memory is fine for trials, but it weakens repeatable multi-day workflows.')
  }

  if (selection.safety === 'strict') {
    score += 6
    reasons.push('Strict sandboxing is the right default when sub-agents can code, browse, or operate files.')
  } else {
    score -= selection.goal === 'ops' || selection.goal === 'code' ? 6 : 1
    watchouts.push('Standard guardrails should stay supervised for coding, shell access, and external actions.')
  }

  if (selection.goal === 'code') {
    score += 4
    reasons.push('DeerFlow 2.0 is well aligned with code creation when planning, execution, and review stay connected.')
  }

  if (selection.goal === 'ops') {
    score += 1
    watchouts.push('Operations flows need clear approval points before sending messages, changing data, or triggering production actions.')
  }

  if (selection.channel === 'api') {
    score += 3
    watchouts.push('API access is powerful, but rate limits and audit trails should be defined before production.')
  } else if (selection.channel === 'im') {
    score += 1
    watchouts.push('Message channels should authenticate users and treat inbound content as untrusted data.')
  }

  if (selection.output === 'repo') score += 3
  if (selection.output === 'asset') score += 1

  score = Math.max(42, Math.min(96, score))

  const recommendedPlanId: PlanId =
    selection.runtime === 'hybrid' || selection.channel === 'api' || selection.goal === 'ops' ? 'scale' : 'flow'
  const fitLabel = score >= 86 ? 'Strong fit' : score >= 72 ? 'Good fit' : score >= 58 ? 'Pilot first' : 'Needs scoping'
  const confidence = score >= 86 ? 'High' : score >= 72 ? 'Moderate' : 'Cautious'
  const architecture =
    selection.runtime === 'cloud'
      ? 'Managed DeerFlow workspace with hosted checkout'
      : selection.runtime === 'hybrid'
        ? 'Hybrid orchestration with private sandbox lanes'
        : 'Docker-backed DeerFlow workspace with managed onboarding'
  const runShape =
    selection.goal === 'code'
      ? 'Plan -> edit -> test -> review'
      : selection.goal === 'research'
        ? 'Search -> crawl -> synthesize -> report'
        : selection.goal === 'ops'
          ? 'Monitor -> triage -> approve -> act'
          : 'Collect -> compare -> brief -> handoff'

  const modules = [
    { label: 'Agent harness', detail: 'Lead agent coordinates specialist sub-agents and tool skills.' },
    { label: 'Execution lane', detail: architecture },
    { label: 'Memory', detail: selection.memory === 'long' ? 'Long-term memory is part of the default Flow setup.' : 'Session memory keeps the first pilot lightweight.' },
    { label: 'Safety', detail: selection.safety === 'strict' ? 'Sandbox-first with explicit approval moments.' : 'Supervised run with limited tool permissions.' },
  ]

  const nextSteps = [
    'Confirm the first mission template and the tools it is allowed to use.',
    'Start with Flow annual unless hybrid API operations already require Scale.',
    'Keep checkout in the popup, then return to the homepage for onboarding.',
    'Move only repeatable, safe workflows into scheduled or message-channel runs.',
  ]

  return {
    fitScore: score,
    fitLabel,
    headline:
      score >= 72
        ? 'This mission is ready for a managed DeerFlow workspace.'
        : 'Tighten the tool and safety boundaries before starting a paid run.',
    recommendedPlanId,
    architecture,
    runShape,
    confidence,
    reasons,
    watchouts: watchouts.length ? watchouts : ['Keep high-impact external actions behind approval until the workflow is proven.'],
    modules,
    nextSteps,
    operatorMessage:
      recommendedPlanId === 'scale'
        ? 'Flow annual is still the right first checkout unless private runners or API rollout are already required.'
        : 'Flow annual is the cleanest default for a serious DeerFlow AI evaluation.',
  }
}

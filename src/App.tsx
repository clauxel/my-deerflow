import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Boxes,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Code2,
  ExternalLink,
  FileText,
  Github,
  Layers3,
  LockKeyhole,
  Network,
  Play,
  Rocket,
  Route,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  X,
  Zap,
} from 'lucide-react'

import { findKeywordPageByPath, keywordPages, type KeywordPage } from './content/keyword-pages'
import { trackEvent, trackPageView } from './lib/analytics'
import {
  analyzeMissionSelection,
  channelOptions,
  defaultMissionSelection,
  goalOptions,
  memoryOptions,
  outputOptions,
  runtimeOptions,
  safetyOptions,
  type MissionSelection,
  type PlanId,
} from './lib/mission'
import { buildSeoDocument, syncSeoDocument } from './lib/seo'
import { deriveRouteView, normalizePathname, scrollToHashTarget, type RouteView } from './lib/routing'

const defaultPublicAppOrigin = 'https://deerflow.site'
const pagesApiBaseUrl = 'https://my-deerflow.yangdengkui01.workers.dev'

type Billing = 'monthly' | 'annual'

type CheckoutModalState = {
  planId: PlanId
  billing: Billing
  loadingKey: string
  status: 'loading' | 'popup' | 'retry'
  checkoutUrl?: string
}

const ctaPrimary = 'Choose Flow annual'
const ctaCheckout = 'Checkout Flow annual'

const plans: Array<{
  id: PlanId
  name: string
  shortName: string
  tagline: string
  monthlyUsd: number
  bullets: string[]
  popular?: boolean
}> = [
  {
    id: 'starter',
    name: 'Lab',
    shortName: 'Lab',
    tagline: 'A focused pilot for one DeerFlow mission and a small review group.',
    monthlyUsd: 39,
    bullets: ['One mission template', 'Session and run notes', 'Sandbox readiness review', 'Email onboarding support'],
  },
  {
    id: 'flow',
    name: 'Flow',
    shortName: 'Flow',
    tagline: 'The default managed workspace for serious deer flow evaluation.',
    monthlyUsd: 99,
    popular: true,
    bullets: ['Long-term memory workflow', 'Sub-agent mission planning', 'Docker sandbox guidance', 'Priority checkout onboarding'],
  },
  {
    id: 'scale',
    name: 'Ops',
    shortName: 'Ops',
    tagline: 'For API embedding, private runners, and higher-touch operational controls.',
    monthlyUsd: 249,
    bullets: ['Private runner planning', 'API and channel rollout notes', 'Approval and audit design', 'Dedicated workflow support'],
  },
]

const proofItems = [
  { label: 'Upstream signal', value: '65k+', detail: 'GitHub stars on the public ByteDance DeerFlow repository' },
  { label: 'Default plan', value: 'Flow', detail: 'Middle tier selected before checkout' },
  { label: 'Annual savings', value: '50%', detail: 'Annual billing is active by default' },
  { label: 'Payment flow', value: 'Popup', detail: 'Creem opens centered while the page stays visible' },
]

const workflowCards = [
  {
    title: 'Sub-agent orchestration',
    body: 'Start with a lead agent, then split research, coding, verification, and handoff into specialist lanes.',
    icon: <Network size={21} />,
  },
  {
    title: 'Memory that compounds',
    body: 'Keep project context, decisions, and repeat workflow notes available instead of rebuilding every run.',
    icon: <BrainCircuit size={21} />,
  },
  {
    title: 'Sandbox-first execution',
    body: 'Treat shell, file, browser, and tool access as explicit runtime choices rather than hidden defaults.',
    icon: <ShieldCheck size={21} />,
  },
  {
    title: 'Checkout without losing context',
    body: 'Payment opens in a centered Creem window, with the original plan page blurred in the background.',
    icon: <BadgeCheck size={21} />,
  },
]

const trustLinks = [
  {
    label: 'ByteDance GitHub',
    href: 'https://github.com/bytedance/deer-flow',
    icon: <Github size={17} />,
  },
  {
    label: 'DeerFlow website',
    href: 'https://deerflow.tech',
    icon: <ExternalLink size={17} />,
  },
  {
    label: 'Docker guide',
    href: '/deer-flow-docker',
    icon: <TerminalSquare size={17} />,
    internal: true,
  },
]

const legalPrivacySections = [
  {
    title: 'What we collect',
    paragraphs: [
      'This site collects limited analytics events, checkout metadata, and information submitted through hosted payment or support flows.',
      'The public mission planner runs in the browser from your selections. It does not require uploading private repositories, credentials, files, or task data.',
    ],
  },
  {
    title: 'Why we collect it',
    paragraphs: [
      'Analytics help us understand which pages, calls to action, and plan choices create confidence or confusion.',
      'Payment metadata is used to confirm purchases, return users to the homepage, and support onboarding after checkout.',
    ],
  },
]

const legalTermsSections = [
  {
    title: 'Service scope',
    paragraphs: [
      'The managed DeerFlow AI site covers mission planning, plan selection, hosted checkout, and related onboarding around DeerFlow-style agent workflows.',
      'The upstream open-source repository remains independently available through its own GitHub and documentation channels.',
    ],
  },
  {
    title: 'Payments and returns',
    paragraphs: [
      'Payments are processed by Creem in a hosted popup window. Successful checkouts return the user to the homepage.',
      'Displayed annual pricing reflects a 50% discount versus the monthly run-rate for the same plan.',
    ],
  },
]

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)
}

function resolveApiBaseUrl() {
  const configured = (import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '')
  if (configured) return configured
  if (window.location.hostname.endsWith('.pages.dev')) return pagesApiBaseUrl
  return ''
}

function resolveApiUrl(path: string) {
  const apiBaseUrl = resolveApiBaseUrl()
  return apiBaseUrl ? `${apiBaseUrl}${path}` : path
}

async function readJsonResponse<T>(response: Response): Promise<T | null> {
  const rawText = await response.text()
  if (!rawText.trim()) return null
  try {
    return JSON.parse(rawText) as T
  } catch {
    return null
  }
}

async function createCheckoutSession(planId: PlanId, billing: Billing) {
  const response = await fetch(resolveApiUrl('/api/checkout'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId, billing }),
  })

  const payload = await readJsonResponse<{ ok?: boolean; checkoutUrl?: string; error?: string }>(response)
  if (!response.ok || !payload?.ok || !payload.checkoutUrl) {
    throw new Error(payload?.error || 'Checkout could not be started.')
  }

  return payload.checkoutUrl
}

function openCenteredCheckoutWindow() {
  const width = 560
  const height = 760
  const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2))
  const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2))
  const popup = window.open(
    'about:blank',
    'deerflow-checkout',
    `popup=yes,width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
  )

  if (popup) {
    try {
      popup.document.title = 'Opening secure checkout'
      popup.document.body.innerHTML =
        '<main style="min-height:100vh;display:grid;place-items:center;background:#111714;color:#f5fbf6;font-family:ui-sans-serif,system-ui,sans-serif;text-align:center;padding:32px"><div><h1 style="font-size:22px;margin:0 0 8px">Opening secure checkout...</h1><p style="margin:0;color:#bfd3c8">Your DeerFlow AI payment window is being prepared.</p></div></main>'
    } catch {
      /* Existing named checkout windows can be cross-origin. */
    }
  }

  return popup
}

function sendPopupToCheckout(popup: Window | null, url: string) {
  if (!popup || popup.closed) return false

  try {
    popup.location.replace(url)
    popup.focus()
    return true
  } catch {
    return false
  }
}

function useRouteSignal() {
  const [pathname, setPathname] = useState(() => window.location.pathname)
  const [search, setSearch] = useState(() => window.location.search)

  function navigate(to: string) {
    const url = new URL(to, window.location.origin)
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
    setPathname(url.pathname)
    setSearch(url.search)

    if (url.hash) {
      requestAnimationFrame(() => scrollToHashTarget(url.hash))
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const onPop = () => {
      setPathname(window.location.pathname)
      setSearch(window.location.search)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return { pathname, search, navigate }
}

function CheckoutDoneBridge({ publicAppOrigin }: { publicAppOrigin: string }) {
  useEffect(() => {
    const origin = window.location.origin || new URL(publicAppOrigin).origin

    if (window.parent !== window) {
      window.parent.postMessage({ type: 'deerflow-checkout-complete' }, origin)
      return
    }

    if (window.opener) {
      try {
        window.opener.postMessage({ type: 'deerflow-checkout-complete' }, origin)
      } catch {
        /* The opener may be closed or cross-origin. */
      }
      window.close()
      return
    }

    window.location.replace(`${origin}/?payment=success`)
  }, [publicAppOrigin])

  return (
    <main className="df-main">
      <section className="df-center-panel">
        <p className="df-eyebrow">Checkout</p>
        <h1>Finishing checkout...</h1>
        <p className="df-muted">You will return to the DeerFlow AI homepage when the hosted payment session closes.</p>
      </section>
    </main>
  )
}

export default function App() {
  const { pathname, search, navigate } = useRouteSignal()
  const routeView: RouteView = useMemo(() => deriveRouteView(pathname), [pathname])
  const normalizedPath = normalizePathname(pathname)
  const keywordPage = useMemo(() => findKeywordPageByPath(pathname), [pathname])

  const [publicAppOrigin, setPublicAppOrigin] = useState(defaultPublicAppOrigin)
  const [headerCompact, setHeaderCompact] = useState(() => window.scrollY > 18)
  const [billing, setBilling] = useState<Billing>('annual')
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>('flow')
  const [checkoutLoadingKey, setCheckoutLoadingKey] = useState<string | null>(null)
  const [checkoutModal, setCheckoutModal] = useState<CheckoutModalState | null>(null)
  const [missionSelection, setMissionSelection] = useState<MissionSelection>(defaultMissionSelection)

  const mission = useMemo(() => analyzeMissionSelection(missionSelection), [missionSelection])

  useEffect(() => {
    let cancelled = false
    fetch(resolveApiUrl('/api/runtime'))
      .then((response) => readJsonResponse<{ publicAppOrigin?: string }>(response))
      .then((payload) => {
        if (!cancelled && payload?.publicAppOrigin) {
          setPublicAppOrigin(payload.publicAppOrigin)
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const seo = buildSeoDocument({
      pathname,
      routeView,
      publicAppOrigin,
      keywordPage,
    })
    syncSeoDocument(seo)
  }, [keywordPage, pathname, publicAppOrigin, routeView])

  useEffect(() => {
    const onScroll = () => setHeaderCompact(window.scrollY > 18)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    trackPageView(`${pathname}${search}`)
  }, [pathname, search])

  useEffect(() => {
    const allowed = new Set([window.location.origin, new URL(publicAppOrigin).origin])
    const onMessage = (event: MessageEvent) => {
      if (!allowed.has(event.origin)) return
      if (event.data?.type === 'deerflow-checkout-complete') {
        setCheckoutModal(null)
        trackEvent('checkout_complete_return', { path: pathname })
        navigate('/?payment=success')
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [navigate, pathname, publicAppOrigin])

  useEffect(() => {
    const hash = window.location.hash
    if (hash) requestAnimationFrame(() => scrollToHashTarget(hash))
  }, [pathname])

  function updateMissionSelection<Key extends keyof MissionSelection>(key: Key, value: MissionSelection[Key]) {
    setMissionSelection((current) => ({ ...current, [key]: value }))
    trackEvent('mission_planner_change', { key, value })
  }

  async function startHostedCheckout(planId: PlanId, nextBilling: Billing, loadingKey: string) {
    setSelectedPlanId(planId)
    setBilling(nextBilling)
    setCheckoutLoadingKey(loadingKey)
    setCheckoutModal({ planId, billing: nextBilling, loadingKey, status: 'loading' })
    trackEvent('checkout_start', { planId, billing: nextBilling })

    const popup = openCenteredCheckoutWindow()

    try {
      const url = await createCheckoutSession(planId, nextBilling)
      const popupOpened = sendPopupToCheckout(popup, url)
      if (!popupOpened) {
        try {
          if (popup && !popup.closed) popup.close()
        } catch {}
        throw new Error('Popup could not be opened.')
      }

      setCheckoutModal({ planId, billing: nextBilling, loadingKey, status: 'popup', checkoutUrl: url })
      trackEvent('checkout_popup_opened', { planId, billing: nextBilling })
    } catch (error) {
      try {
        if (popup && !popup.closed) popup.close()
      } catch {}
      setCheckoutModal({ planId, billing: nextBilling, loadingKey, status: 'retry' })
      trackEvent('checkout_error', {
        planId,
        billing: nextBilling,
        message: error instanceof Error ? error.message : 'unknown',
      })
    } finally {
      setCheckoutLoadingKey(null)
    }
  }

  function chooseFlowAnnual(source: string) {
    setSelectedPlanId('flow')
    setBilling('annual')
    trackEvent('choose_flow_annual', { source })
    navigate('/pricing#pricing')
  }

  function openPage(path: string) {
    trackEvent('internal_page_open', { path })
    navigate(path)
  }

  const renderHeader = () => (
    <header className={`df-header${headerCompact ? ' compact' : ''}`}>
      <div className="df-header-inner">
        <a
          className="df-brand"
          href="/"
          onClick={(event) => {
            event.preventDefault()
            navigate('/')
          }}
        >
          <span className="df-brand-mark" aria-hidden>
            <Route size={20} />
          </span>
          <span className="df-brand-copy">
            <strong>DeerFlow AI</strong>
            <span>Managed agent harness</span>
          </span>
        </a>

        <nav className="df-nav" aria-label="Primary">
          <a
            href="/#planner"
            onClick={(event) => {
              event.preventDefault()
              navigate('/#planner')
            }}
          >
            Planner
          </a>
          <a
            href="/deer-flow-github"
            onClick={(event) => {
              event.preventDefault()
              openPage('/deer-flow-github')
            }}
          >
            GitHub
          </a>
          <a
            href="/deer-flow-docker"
            onClick={(event) => {
              event.preventDefault()
              openPage('/deer-flow-docker')
            }}
          >
            Docker
          </a>
          <a
            href="/pricing"
            onClick={(event) => {
              event.preventDefault()
              openPage('/pricing')
            }}
          >
            Pricing
          </a>
        </nav>

        <button type="button" className="df-btn df-btn-primary df-header-cta" onClick={() => chooseFlowAnnual('header')}>
          <Rocket size={16} />
          {ctaPrimary}
        </button>
      </div>
    </header>
  )

  const renderCheckoutModal = () => {
    if (!checkoutModal) return null

    const checkoutUrl = checkoutModal.status === 'popup' ? checkoutModal.checkoutUrl : undefined

    return (
      <div className="df-checkout-backdrop" role="presentation">
        <section className="df-checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
          <button
            type="button"
            className="df-checkout-close"
            aria-label="Close checkout"
            onClick={() => {
              setCheckoutModal(null)
              trackEvent('checkout_overlay_closed', { status: checkoutModal.status })
            }}
          >
            <X size={18} />
          </button>
          {checkoutUrl ? (
            <div className="df-checkout-copy">
              <p className="df-eyebrow">Secure checkout</p>
              <h2 id="checkout-title">Creem checkout opened.</h2>
              <p className="df-muted">
                Complete payment in the centered popup. This page stays in place and returns to the homepage after success.
              </p>
              <div className="df-checkout-actions">
                <a className="df-btn df-btn-primary" href={checkoutUrl} target="_blank" rel="noreferrer noopener">
                  Focus payment window
                </a>
                <button type="button" className="df-btn df-btn-ghost" onClick={() => setCheckoutModal(null)}>
                  Keep reviewing
                </button>
              </div>
            </div>
          ) : checkoutModal.status === 'loading' ? (
            <div className="df-checkout-loading" aria-live="polite">
              <span />
              Preparing secure checkout...
            </div>
          ) : (
            <div className="df-checkout-copy">
              <p className="df-eyebrow">Popup needed</p>
              <h2 id="checkout-title">Checkout could not open yet.</h2>
              <p className="df-muted">
                Allow the payment popup and try again. DeerFlow AI keeps payment in a separate Creem window so the original page is not replaced.
              </p>
              <div className="df-checkout-actions">
                <button
                  type="button"
                  className="df-btn df-btn-primary"
                  onClick={() => void startHostedCheckout(checkoutModal.planId, checkoutModal.billing, checkoutModal.loadingKey)}
                >
                  Try checkout again
                </button>
                <button type="button" className="df-btn df-btn-ghost" onClick={() => setCheckoutModal(null)}>
                  Close
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    )
  }

  const renderOptionButtons = <Key extends keyof MissionSelection>(
    key: Key,
    options: Array<{ id: MissionSelection[Key]; label: string; summary: string }>,
  ) => (
    <div className="df-option-grid">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className="df-option"
          data-active={missionSelection[key] === option.id ? 'true' : 'false'}
          onClick={() => updateMissionSelection(key, option.id)}
        >
          <strong>{option.label}</strong>
          <span>{option.summary}</span>
        </button>
      ))}
    </div>
  )

  const renderFlowMap = () => (
    <div className="df-flow-map" aria-hidden>
      <div className="df-flow-node lead">
        <Bot size={22} />
        <strong>Lead agent</strong>
      </div>
      <div className="df-flow-rail" />
      <div className="df-flow-node">
        <Sparkles size={19} />
        <span>Skills</span>
      </div>
      <div className="df-flow-node">
        <BrainCircuit size={19} />
        <span>Memory</span>
      </div>
      <div className="df-flow-node">
        <Boxes size={19} />
        <span>Sandbox</span>
      </div>
      <div className="df-flow-node">
        <FileText size={19} />
        <span>Output</span>
      </div>
    </div>
  )

  const renderMissionPanel = () => (
    <aside className="df-workspace-panel" id="planner" aria-label="DeerFlow AI mission planner">
      <div className="df-panel-top">
        <div>
          <p className="df-eyebrow">Mission planner</p>
          <h2>{mission.headline}</h2>
        </div>
        <div className="df-score">
          <strong>{mission.fitScore}</strong>
          <span>{mission.fitLabel}</span>
        </div>
      </div>

      {renderFlowMap()}

      <div className="df-choice-stack">
        <section>
          <div className="df-choice-label">Mission</div>
          {renderOptionButtons('goal', goalOptions)}
        </section>
        <section className="df-split-options">
          <div>
            <div className="df-choice-label">Runtime</div>
            {renderOptionButtons('runtime', runtimeOptions)}
          </div>
          <div>
            <div className="df-choice-label">Memory</div>
            {renderOptionButtons('memory', memoryOptions)}
          </div>
        </section>
        <section className="df-split-options">
          <div>
            <div className="df-choice-label">Safety</div>
            {renderOptionButtons('safety', safetyOptions)}
          </div>
          <div>
            <div className="df-choice-label">Channel</div>
            {renderOptionButtons('channel', channelOptions)}
          </div>
        </section>
        <section>
          <div className="df-choice-label">Output</div>
          {renderOptionButtons('output', outputOptions)}
        </section>
      </div>

      <div className="df-result-grid">
        {mission.modules.map((module) => (
          <article key={module.label}>
            <span>{module.label}</span>
            <strong>{module.detail}</strong>
          </article>
        ))}
      </div>

      <div className="df-next-box">
        <div>
          <p className="df-eyebrow">Recommended next move</p>
          <h3>{mission.operatorMessage}</h3>
          <p>
            {mission.runShape} with {mission.confidence.toLowerCase()} fit confidence.
          </p>
        </div>
        <button type="button" className="df-btn df-btn-primary" onClick={() => chooseFlowAnnual('planner')}>
          <Play size={18} />
          {ctaPrimary}
        </button>
      </div>
    </aside>
  )

  const renderPricingSection = (standalone = false) => (
    <section className={`df-section df-pricing-section${standalone ? ' standalone' : ''}`} id="pricing">
      <div className="df-section-head df-pricing-head">
        <div>
          <p className="df-eyebrow">Pricing</p>
          <h2>The middle Flow plan is selected because serious DeerFlow work needs memory, sandboxing, and enough room to finish.</h2>
          <p>Annual billing is active by default and is 50% cheaper than paying month to month.</p>
        </div>
        <div className="df-cycle" role="group" aria-label="Billing cycle">
          <button
            type="button"
            data-active={billing === 'monthly' ? 'true' : 'false'}
            onClick={() => {
              setBilling('monthly')
              trackEvent('billing_cycle_change', { billing: 'monthly' })
            }}
          >
            Monthly
          </button>
          <button
            type="button"
            data-active={billing === 'annual' ? 'true' : 'false'}
            onClick={() => {
              setBilling('annual')
              trackEvent('billing_cycle_change', { billing: 'annual' })
            }}
          >
            Annual - 50% off
          </button>
        </div>
      </div>

      <div className="df-plan-grid">
        {plans.map((plan) => {
          const monthly = billing === 'annual' ? plan.monthlyUsd * 0.5 : plan.monthlyUsd
          const strike = billing === 'annual' ? plan.monthlyUsd : null
          const loadingKey = `plan-${plan.id}-${billing}`
          const active = selectedPlanId === plan.id

          return (
            <article className="df-plan-card" data-popular={plan.popular ? 'true' : 'false'} data-active={active ? 'true' : 'false'} key={plan.id}>
              {plan.popular ? <span className="df-plan-badge">Default choice</span> : null}
              <h3>{plan.name}</h3>
              <p>{plan.tagline}</p>
              <div className="df-price-line">
                {formatMoney(monthly)}
                <small>/mo</small>
                {strike ? <span>{formatMoney(strike)}</span> : null}
              </div>
              <strong className="df-billing-note">
                {billing === 'annual' ? `${formatMoney(monthly * 12)} billed annually` : 'Billed monthly'}
              </strong>
              <ul>
                {plan.bullets.map((bullet) => (
                  <li key={bullet}>
                    <Check size={15} />
                    {bullet}
                  </li>
                ))}
              </ul>
              <div className="df-plan-actions">
                <button
                  type="button"
                  className={plan.popular ? 'df-btn df-btn-primary' : 'df-btn df-btn-ghost'}
                  onClick={() => void startHostedCheckout(plan.id, billing, loadingKey)}
                  onMouseEnter={() => setSelectedPlanId(plan.id)}
                  disabled={checkoutLoadingKey !== null}
                >
                  {checkoutLoadingKey === loadingKey ? 'Opening secure checkout...' : plan.id === 'flow' ? ctaCheckout : `Checkout ${plan.shortName} ${billing}`}
                </button>
                {active ? <span className="df-plan-selected">Selected</span> : null}
              </div>
            </article>
          )
        })}
      </div>

      {standalone ? (
        <div className="df-faq-grid">
          <article>
            <h3>Why is Flow selected first?</h3>
            <p>Most buyers need memory, sandbox guidance, and a real mission workflow. Lab is useful for a pilot, but Flow is the practical default.</p>
          </article>
          <article>
            <h3>Why annual by default?</h3>
            <p>Long-horizon agent evaluation usually takes more than a month. Annual pricing cuts the monthly run-rate by 50%.</p>
          </article>
          <article>
            <h3>Does payment replace this page?</h3>
            <p>No. Checkout opens in a centered Creem popup and the product page stays visible behind a blurred overlay.</p>
          </article>
        </div>
      ) : null}
    </section>
  )

  const renderHome = () => {
    const paymentSuccess = new URLSearchParams(search).get('payment') === 'success'

    return (
      <main className="df-main">
        {paymentSuccess ? (
          <section className="df-success-banner">
            <CheckCircle2 size={18} />
            Payment received. DeerFlow AI onboarding will continue from the email used at checkout.
          </section>
        ) : null}

        <section className="df-hero">
          <div className="df-hero-copy">
            <p className="df-eyebrow">DeerFlow AI managed workspace</p>
            <h1>Turn long agent runs into work your team can trust.</h1>
            <p className="df-lede">
              DeerFlow AI helps teams evaluate DeerFlow and deer flow style automation with a mission planner, sandbox-first operating model, and a clean path to the Flow annual plan.
            </p>

            <div className="df-hero-actions">
              <button type="button" className="df-btn df-btn-primary" onClick={() => chooseFlowAnnual('hero')}>
                <Rocket size={18} />
                {ctaPrimary}
              </button>
              <button
                type="button"
                className="df-btn df-btn-ghost"
                onClick={() => {
                  trackEvent('pricing_review', { source: 'hero-secondary' })
                  navigate('/pricing#pricing')
                }}
              >
                <Layers3 size={18} />
                Review plans
              </button>
              <button type="button" className="df-btn df-btn-subtle" onClick={() => openPage('/deer-flow-github')}>
                <Github size={18} />
                Inspect GitHub path
              </button>
            </div>
            <p className="df-payment-note">
              <CheckCircle2 size={16} />
              Flow annual is selected. Annual saves 50%.
            </p>

            <div className="df-trust-row">
              {trustLinks.map((link) =>
                link.internal ? (
                  <a
                    href={link.href}
                    key={link.href}
                    onClick={(event) => {
                      event.preventDefault()
                      openPage(link.href)
                    }}
                  >
                    {link.icon}
                    {link.label}
                    <ChevronRight size={13} />
                  </a>
                ) : (
                  <a href={link.href} key={link.href} target="_blank" rel="noreferrer">
                    {link.icon}
                    {link.label}
                    <ExternalLink size={13} />
                  </a>
                ),
              )}
            </div>

            <div className="df-hero-proof">
              <div>
                <span>Default path</span>
                <strong>Mission planner to Flow annual to Creem popup to homepage return</strong>
              </div>
              <div>
                <span>Best-fit work</span>
                <strong>Research, code creation, reports, and operations with explicit tool boundaries</strong>
              </div>
            </div>
          </div>

          {renderMissionPanel()}
        </section>

        <section className="df-proof-strip" aria-label="DeerFlow AI proof points">
          {proofItems.map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </section>

        <section className="df-section">
          <div className="df-section-head">
            <p className="df-eyebrow">Why it converts</p>
            <h2>The first screen answers the buyer's real question: is this agent workflow safe and useful enough to start?</h2>
            <p>
              People arriving from DeerFlow GitHub, Docker, Reddit, or comparison searches need a practical path, not a wall of abstract agent claims.
            </p>
          </div>

          <div className="df-card-grid">
            {workflowCards.map((card) => (
              <article className="df-card" key={card.title}>
                <div className="df-card-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="df-section df-signal-section">
          <div className="df-section-head">
            <p className="df-eyebrow">Operating discipline</p>
            <h2>DeerFlow AI is strongest when the mission, tools, memory, and approval points are visible before payment.</h2>
          </div>
          <div className="df-signal-grid">
            <article>
              <Clock3 size={20} />
              <h3>Start with one bounded mission</h3>
              <p>A focused first workflow beats a vague promise that the agent can do everything.</p>
            </article>
            <article>
              <Code2 size={20} />
              <h3>Keep execution inspectable</h3>
              <p>Code, files, and tool calls need a review trail so teams can trust the handoff.</p>
            </article>
            <article>
              <LockKeyhole size={20} />
              <h3>Default to safer boundaries</h3>
              <p>Sandbox, credentials, and external actions should be explicit before long runs begin.</p>
            </article>
          </div>
        </section>

        {renderPricingSection(false)}

        <section className="df-section">
          <div className="df-section-head">
            <p className="df-eyebrow">Useful pages</p>
            <h2>Each common DeerFlow search path gets an answer that helps the visitor decide.</h2>
            <p>AI, Docker, GitHub, Reddit, ByteDance, 2.0, and OpenClaw comparison searches all carry different intent.</p>
          </div>
          <div className="df-guide-grid">
            {[
              ...keywordPages,
              {
                path: '/pricing',
                eyebrow: 'Pricing',
                h1: 'DeerFlow AI pricing',
                intent: 'Choose Lab, Flow, or Ops with Flow annual already selected.',
              },
            ].map((page) => (
              <a
                className="df-guide-card"
                href={page.path}
                key={page.path}
                onClick={(event) => {
                  event.preventDefault()
                  openPage(page.path)
                }}
              >
                <span>{page.eyebrow}</span>
                <strong>{page.h1}</strong>
                <p>{page.intent}</p>
                <ChevronRight size={18} />
              </a>
            ))}
          </div>
        </section>
      </main>
    )
  }

  const renderKeywordPage = (page: KeywordPage) => (
    <main className="df-main">
      <article className="df-article">
        <a
          className="df-back-link"
          href="/"
          onClick={(event) => {
            event.preventDefault()
            navigate('/')
          }}
        >
          <ArrowRight size={16} />
          Back to DeerFlow AI
        </a>
        <p className="df-eyebrow">{page.eyebrow}</p>
        <h1>{page.h1}</h1>
        <p className="df-lede">{page.lede}</p>
        <div className="df-article-intent">
          <strong>Best for</strong>
          <span>{page.intent}</span>
        </div>

        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets ? (
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <section>
          <h2>Common questions</h2>
          <div className="df-faq-list">
            {page.faqs.map((faq) => (
              <article key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="df-article-cta">
          <div>
            <p className="df-eyebrow">Recommended next step</p>
            <h2>Use the planner first, then keep Flow annual selected if the mission fit is clear.</h2>
            <p>Checkout stays in a centered Creem popup, with annual billing selected by default.</p>
          </div>
          <div className="df-article-cta-actions">
            <button type="button" className="df-btn df-btn-primary" onClick={() => chooseFlowAnnual(`article-${page.path}`)}>
              <Play size={18} />
              {page.ctaLabel}
            </button>
            <button type="button" className="df-btn df-btn-ghost" onClick={() => navigate('/#planner')}>
              <Zap size={18} />
              Run planner
            </button>
          </div>
        </aside>
      </article>
    </main>
  )

  const renderPricingPage = () => (
    <main className="df-main">
      <section className="df-pricing-page-hero">
        <p className="df-eyebrow">Pricing</p>
        <h1>DeerFlow AI pricing starts with the middle plan selected and annual billing already on.</h1>
        <p className="df-lede">
          Lab is for one bounded pilot. Flow is the default for a serious DeerFlow workspace. Ops is for private runners, API embedding, and operational controls.
        </p>
      </section>
      {renderPricingSection(true)}
    </main>
  )

  const renderLegalPage = (title: string, intro: string, sections: typeof legalPrivacySections) => (
    <main className="df-main">
      <article className="df-article">
        <p className="df-eyebrow">Legal</p>
        <h1>{title}</h1>
        <p className="df-lede">{intro}</p>
        {sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </article>
    </main>
  )

  const renderNotFound = () => (
    <main className="df-main">
      <section className="df-center-panel">
        <p className="df-eyebrow">404</p>
        <h1>Page not found</h1>
        <p className="df-muted">That route is not available.</p>
        <button type="button" className="df-btn df-btn-primary" onClick={() => navigate('/')}>
          Return home
        </button>
      </section>
    </main>
  )

  let body: React.ReactNode
  if (routeView === 'home' && normalizedPath === '/') {
    body = renderHome()
  } else if (routeView === 'keyword' && keywordPage) {
    body = renderKeywordPage(keywordPage)
  } else if (routeView === 'pricing') {
    body = renderPricingPage()
  } else if (routeView === 'privacy') {
    body = renderLegalPage(
      'Privacy Policy',
      'This policy covers how the managed DeerFlow AI site handles analytics, checkout, and related user interactions.',
      legalPrivacySections,
    )
  } else if (routeView === 'terms') {
    body = renderLegalPage(
      'Terms of Service',
      'These terms describe the limits and responsibilities of the managed DeerFlow AI site and its hosted payment flow.',
      legalTermsSections,
    )
  } else if (routeView === 'checkout-done') {
    body = <CheckoutDoneBridge publicAppOrigin={publicAppOrigin} />
  } else {
    body = renderNotFound()
  }

  return (
    <div className="df-shell">
      <div className="df-page-texture" aria-hidden />
      {renderHeader()}
      {body}
      {renderCheckoutModal()}
      <footer className="df-footer">
        <div className="df-footer-inner">
          <span>DeerFlow AI</span>
          <a
            href="/privacy"
            onClick={(event) => {
              event.preventDefault()
              navigate('/privacy')
            }}
          >
            Privacy
          </a>
          <a
            href="/terms"
            onClick={(event) => {
              event.preventDefault()
              navigate('/terms')
            }}
          >
            Terms
          </a>
          <a href="https://github.com/bytedance/deer-flow" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://deerflow.tech" target="_blank" rel="noreferrer">
            Upstream
          </a>
        </div>
      </footer>
    </div>
  )
}

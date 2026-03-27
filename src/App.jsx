import { useMemo, useState } from 'react'
import {
  LayoutDashboard,
  FileJson2,
  Settings,
  Plus,
  ChevronRight,
  Presentation,
  Wrench,
} from 'lucide-react'
import RuleList from './RuleList.jsx'
import RuleModal from './RuleModal.jsx'
import { compileFullRule } from './types.js'
import { generateMockRules, plainRegulatorySummary } from './generateMockRules.js'
import { countryName, regionForCountry } from './countries.js'

const NAV = [
  { id: 'rules', label: 'Compliance rules', icon: LayoutDashboard },
  { id: 'json', label: 'Legacy JSON', icon: FileJson2 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const MOCK_COUNT = 1000

function enrichRule(r) {
  const compiledExpression = compileFullRule(r.activation ?? {}, r.validationRows ?? [])
  return { ...r, compiledExpression }
}

export default function App() {
  const [rules, setRules] = useState(() => generateMockRules(MOCK_COUNT).map(enrichRule))
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [createNonce, setCreateNonce] = useState(0)
  const [regulatoryMode, setRegulatoryMode] = useState(true)

  const tableRules = useMemo(
    () =>
      rules.map((r) => ({
        id: r.id,
        country: r.country,
        countryName: r.countryName ?? countryName(r.country),
        region: r.region ?? regionForCountry(r.country),
        entity: r.entity,
        status: r.status,
        regulatorySummary: r.regulatorySummary ?? plainRegulatorySummary(r.activation ?? {}, r.entity),
      })),
    [rules],
  )

  function openCreate() {
    setEditing(null)
    setCreateNonce((n) => n + 1)
    setModalOpen(true)
  }

  function openEdit(rule) {
    const full = rules.find((x) => x.id === rule.id)
    setEditing(full ?? rule)
    setModalOpen(true)
  }

  function handleSave(payload) {
    const entity =
      payload.activation?.collectionAgent != null && payload.activation.collectionAgent !== ''
        ? `Agent ${payload.activation.collectionAgent}`
        : 'Unassigned'
    const cn = countryName(payload.activation?.country)
    const reg = regionForCountry(payload.activation?.country)
    const summary = plainRegulatorySummary(payload.activation ?? {}, entity)

    if (editing) {
      setRules((prev) =>
        prev.map((r) =>
          r.id === editing.id
            ? enrichRule({
                ...r,
                activation: payload.activation,
                validationRows: payload.validationRows,
                compiledExpression: payload.compiledExpression,
                country: payload.activation?.country ?? r.country,
                countryName: cn,
                region: reg,
                entity,
                regulatorySummary: summary,
              })
            : r,
        ),
      )
    } else {
      const id = `NEW-${String(rules.length + 1).padStart(4, '0')}`
      const country = payload.activation?.country || '—'
      setRules((prev) => [
        ...prev,
        enrichRule({
          id,
          country,
          countryName: cn,
          region: reg,
          entity,
          status: 'Active',
          regulatorySummary: summary,
          activation: payload.activation,
          validationRows: payload.validationRows,
        }),
      ])
    }
  }

  return (
    <div className="flex min-h-dvh bg-slate-100">
      <aside className="flex w-60 shrink-0 flex-col border-r border-slate-800/80 bg-[#0c1e3d] text-slate-100">
        <div className="border-b border-white/10 px-5 py-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Traffic monitoring
          </p>
          <p className="mt-1 text-lg font-semibold tracking-tight text-white">Compliance</p>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          {NAV.map((item) => {
            const Icon = item.icon
            const active = item.id === 'rules'
            return (
              <button
                key={item.id}
                type="button"
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="size-4 shrink-0 opacity-90" aria-hidden />
                {item.label}
                {active && <ChevronRight className="ml-auto size-4 opacity-60" aria-hidden />}
              </button>
            )
          })}
        </nav>
        <div className="border-t border-white/10 p-4 text-xs text-slate-500">
          SNS Core News rules engine
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-slate-200/80 bg-white px-8 py-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Compliance rule management
              </h1>
              {regulatoryMode ? (
                <p className="mt-1 max-w-2xl text-sm text-slate-600">
                  Browse rules by country for audits and regulatory briefings. Technical validation details stay one click
                  away when you need them.
                </p>
              ) : (
                <p className="mt-1 max-w-2xl text-sm text-slate-600">
                  Scoped activation and visual validation. Expressions compile to SNS path checks such as{' '}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800">
                    string(corenewssns.data.gateway.collection_agent_id) == &apos;174&apos;
                  </code>
                  .
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 shadow-sm">
                <button
                  type="button"
                  onClick={() => setRegulatoryMode(true)}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition ${
                    regulatoryMode
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Presentation className="size-3.5" aria-hidden />
                  Regulatory view
                </button>
                <button
                  type="button"
                  onClick={() => setRegulatoryMode(false)}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition ${
                    !regulatoryMode
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Wrench className="size-3.5" aria-hidden />
                  Technical view
                </button>
              </div>
              <button
                type="button"
                onClick={openCreate}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                <Plus className="size-4" aria-hidden />
                New rule
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          <RuleList rules={tableRules} onEdit={openEdit} regulatoryMode={regulatoryMode} />
        </div>
      </main>

      {modalOpen && (
        <RuleModal
          key={editing?.id ?? `new-${createNonce}`}
          onClose={() => setModalOpen(false)}
          initialRule={editing}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

import { useMemo, useState } from 'react'
import {
  LayoutDashboard,
  FileJson2,
  Settings,
  Plus,
  ChevronRight,
} from 'lucide-react'
import RuleList from './RuleList.jsx'
import RuleModal from './RuleModal.jsx'
import { compileFullRule } from './types.js'

const NAV = [
  { id: 'rules', label: 'Compliance rules', icon: LayoutDashboard },
  { id: 'json', label: 'Legacy JSON', icon: FileJson2 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const INITIAL_RULES = [
  {
    id: 'MX174005',
    country: 'MX',
    entity: 'Gateway North',
    status: 'Active',
    activation: {
      country: 'MX',
      collectionAgent: '174',
      paymentMethod: 'card',
      industry: 'retail',
    },
    validationRows: [
      {
        id: 'v1',
        joinBefore: null,
        fieldKey: 'processingEntity',
        operator: '==',
        value: 'PSP_CORE',
      },
    ],
  },
  {
    id: 'GB201002',
    country: 'GB',
    entity: 'EU Clearing',
    status: 'Inactive',
    activation: { country: 'GB', collectionAgent: '201', paymentMethod: '', industry: '' },
    validationRows: [
      { id: 'v1', joinBefore: null, fieldKey: 'fxMode', operator: '!=', value: 'locked' },
    ],
  },
  {
    id: 'US088014',
    country: 'US',
    entity: 'Americas Hub',
    status: 'Active',
    activation: { country: 'US', collectionAgent: '88', paymentMethod: 'bank_transfer', industry: 'fx' },
    validationRows: [
      { id: 'v1', joinBefore: null, fieldKey: 'transactionType', operator: 'contains', value: 'cross' },
    ],
  },
]

function enrichRule(r) {
  const compiledExpression = compileFullRule(r.activation ?? {}, r.validationRows ?? [])
  return { ...r, compiledExpression }
}

export default function App() {
  const [rules, setRules] = useState(() => INITIAL_RULES.map(enrichRule))
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [createNonce, setCreateNonce] = useState(0)

  const tableRules = useMemo(
    () =>
      rules.map((r) => ({
        id: r.id,
        country: r.country,
        entity: r.entity,
        status: r.status,
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
    if (editing) {
      setRules((prev) =>
        prev.map((r) =>
          r.id === editing.id
            ? enrichRule({
                ...r,
                activation: payload.activation,
                validationRows: payload.validationRows,
                compiledExpression: payload.compiledExpression,
              })
            : r,
        ),
      )
    } else {
      const id = `NEW-${String(rules.length + 1).padStart(4, '0')}`
      const country = payload.activation.country || '—'
      const entity = payload.activation.collectionAgent
        ? `Agent ${payload.activation.collectionAgent}`
        : 'Unassigned'
      setRules((prev) => [
        ...prev,
        enrichRule({
          id,
          country,
          entity,
          status: 'Active',
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
              <p className="mt-1 max-w-2xl text-sm text-slate-600">
                Replace manual JSON with scoped activation and visual validation. Expressions compile to SNS path
                checks such as{' '}
                <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800">
                  string(corenewssns.data.gateway.collection_agent_id) == &apos;174&apos;
                </code>
                .
              </p>
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
        </header>

        <div className="flex-1 overflow-auto p-8">
          <RuleList rules={tableRules} onEdit={openEdit} />
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

import { useMemo, useState } from 'react'
import { Plus, X } from 'lucide-react'
import {
  ACTIVATION_FIELDS,
  JOIN_OPERATORS,
  SELECT_OPTIONS,
  VALIDATION_FIELDS,
  VALIDATION_OPERATORS,
  compileFullRule,
} from './types.js'

const emptyActivation = () => ({
  country: '',
  collectionAgent: '',
  paymentMethod: '',
  industry: '',
})

function newConditionRow(joinBefore = 'AND') {
  return {
    id: crypto.randomUUID(),
    joinBefore,
    fieldKey: 'processingEntity',
    operator: '==',
    value: '',
  }
}

const validationFieldEntries = Object.entries(VALIDATION_FIELDS)

function initialConditionsFromRule(initialRule) {
  if (initialRule?.validationRows?.length) {
    return initialRule.validationRows.map((r, i) => ({
      id: r.id ?? crypto.randomUUID(),
      joinBefore: i === 0 ? null : r.joinBefore ?? 'AND',
      fieldKey: r.fieldKey ?? 'processingEntity',
      operator: r.operator ?? '==',
      value: r.value ?? '',
    }))
  }
  return [newConditionRow(null)]
}

export default function RuleModal({ onClose, initialRule, onSave }) {
  const [activation, setActivation] = useState(() => ({
    ...emptyActivation(),
    ...initialRule?.activation,
  }))
  const [conditions, setConditions] = useState(() => initialConditionsFromRule(initialRule))

  const compiled = useMemo(
    () => compileFullRule(activation, conditions),
    [activation, conditions],
  )

  function updateActivation(key, value) {
    setActivation((prev) => ({ ...prev, [key]: value }))
  }

  function updateCondition(id, patch) {
    setConditions((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }

  function addCondition() {
    setConditions((prev) => [...prev, newConditionRow('AND')])
  }

  function removeCondition(id) {
    setConditions((prev) => {
      const next = prev.filter((c) => c.id !== id)
      if (next.length === 0) return [newConditionRow(null)]
      const [first, ...rest] = next
      return [{ ...first, joinBefore: null }, ...rest]
    })
  }

  function handleActivate() {
    onSave?.({
      activation,
      validationRows: conditions,
      compiledExpression: compiled,
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rule-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div className="relative flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 id="rule-modal-title" className="text-lg font-semibold text-slate-900">
              Rule builder
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Activation scope and validation logic compile to SNS path expressions.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <section className="mb-8">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Activation (scope)
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  {ACTIVATION_FIELDS.country.label}
                </span>
                <select
                  value={activation.country}
                  onChange={(e) => updateActivation('country', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Select country…</option>
                  {SELECT_OPTIONS.countries.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  {ACTIVATION_FIELDS.collectionAgent.label}
                </span>
                <select
                  value={activation.collectionAgent}
                  onChange={(e) => updateActivation('collectionAgent', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Select agent…</option>
                  {SELECT_OPTIONS.collectionAgents.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  {ACTIVATION_FIELDS.paymentMethod.label}
                </span>
                <select
                  value={activation.paymentMethod}
                  onChange={(e) => updateActivation('paymentMethod', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Select method…</option>
                  {SELECT_OPTIONS.paymentMethods.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  {ACTIVATION_FIELDS.industry.label}
                </span>
                <select
                  value={activation.industry}
                  onChange={(e) => updateActivation('industry', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Select industry…</option>
                  {SELECT_OPTIONS.industries.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section>
            <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Validation logic
              </h3>
              <button
                type="button"
                onClick={addCondition}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
              >
                <Plus className="size-4" aria-hidden />
                Add condition
              </button>
            </div>
            <p className="mb-4 text-sm text-slate-500">
              Combine rows with <span className="font-medium text-slate-700">AND</span> or{' '}
              <span className="font-medium text-slate-700">OR</span>. Fields map to SNS gateway attributes.
            </p>
            <div className="space-y-3">
              {conditions.map((row, index) => (
                <div
                  key={row.id}
                  className="flex flex-wrap items-end gap-2 rounded-xl border border-slate-200 bg-slate-50/80 p-3"
                >
                  {index > 0 && (
                    <label className="shrink-0">
                      <span className="sr-only">Join with previous</span>
                      <select
                        value={row.joinBefore ?? 'AND'}
                        onChange={(e) =>
                          updateCondition(row.id, { joinBefore: e.target.value })
                        }
                        className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm font-semibold text-slate-800"
                      >
                        {JOIN_OPERATORS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  <label className="min-w-[160px] flex-1">
                    <span className="mb-1 block text-xs font-medium text-slate-600">Field</span>
                    <select
                      value={row.fieldKey}
                      onChange={(e) => updateCondition(row.id, { fieldKey: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-slate-900"
                    >
                      {validationFieldEntries.map(([key, def]) => (
                        <option key={key} value={key}>
                          {def.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="min-w-[120px]">
                    <span className="mb-1 block text-xs font-medium text-slate-600">Operator</span>
                    <select
                      value={row.operator}
                      onChange={(e) => updateCondition(row.id, { operator: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-slate-900"
                    >
                      {VALIDATION_OPERATORS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="min-w-[140px] flex-[2]">
                    <span className="mb-1 block text-xs font-medium text-slate-600">Value</span>
                    <input
                      type="text"
                      value={row.value}
                      onChange={(e) => updateCondition(row.id, { value: e.target.value })}
                      placeholder="e.g. PSP_A"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeCondition(row.id)}
                    className="shrink-0 rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                    aria-label="Remove condition"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Compiled expression
            </h3>
            <pre className="max-h-40 overflow-auto rounded-xl border border-slate-200 bg-slate-900 px-4 py-3 font-mono text-xs leading-relaxed text-emerald-100">
              {compiled || '— Add activation and/or validation to generate output —'}
            </pre>
          </section>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleActivate}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Activate rule
          </button>
        </div>
      </div>
    </div>
  )
}

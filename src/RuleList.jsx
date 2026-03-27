import { Pencil, ShieldCheck, ShieldOff } from 'lucide-react'

function StatusBadge({ active }) {
  if (active) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
        <ShieldCheck className="size-3.5" aria-hidden />
        Active
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
      <ShieldOff className="size-3.5" aria-hidden />
      Inactive
    </span>
  )
}

export default function RuleList({ rules, onEdit }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">Rule inventory</h2>
        <p className="mt-0.5 text-sm text-slate-500">
          Compliance rules scoped by geography and gateway; validation logic runs on SNS Core News payloads.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3">Rule ID</th>
              <th className="px-5 py-3">Country</th>
              <th className="px-5 py-3">Entity</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rules.map((rule) => (
              <tr key={rule.id} className="hover:bg-slate-50/50">
                <td className="px-5 py-3.5 font-mono text-sm font-medium text-slate-900">{rule.id}</td>
                <td className="px-5 py-3.5 text-slate-700">{rule.country}</td>
                <td className="px-5 py-3.5 text-slate-700">{rule.entity}</td>
                <td className="px-5 py-3.5">
                  <StatusBadge active={rule.status === 'Active'} />
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    type="button"
                    onClick={() => onEdit(rule)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    <Pencil className="size-3.5" aria-hidden />
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

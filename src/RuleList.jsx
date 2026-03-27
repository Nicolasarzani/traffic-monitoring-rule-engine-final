import { useMemo, useState } from 'react'
import {
  Pencil,
  ShieldCheck,
  ShieldOff,
  Search,
  Globe2,
  LayoutGrid,
  Code2,
} from 'lucide-react'

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

function matchesSearch(rule, q) {
  if (!q.trim()) return true
  const s = q.trim().toLowerCase()
  return (
    rule.id.toLowerCase().includes(s) ||
    (rule.countryName || '').toLowerCase().includes(s) ||
    (rule.country || '').toLowerCase().includes(s) ||
    (rule.entity || '').toLowerCase().includes(s) ||
    (rule.regulatorySummary || '').toLowerCase().includes(s) ||
    (rule.region || '').toLowerCase().includes(s)
  )
}

export default function RuleList({ rules, onEdit, regulatoryMode = true }) {
  const [query, setQuery] = useState('')
  const [countryFilter, setCountryFilter] = useState('')
  const [regionFilter, setRegionFilter] = useState('')

  const regions = useMemo(() => {
    const set = new Set(rules.map((r) => r.region).filter(Boolean))
    return [...set].sort((a, b) => a.localeCompare(b))
  }, [rules])

  const countriesInData = useMemo(() => {
    const map = new Map()
    for (const r of rules) {
      if (!map.has(r.country)) map.set(r.country, r.countryName || r.country)
    }
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]))
  }, [rules])

  const filtered = useMemo(() => {
    let list = rules
    if (countryFilter) list = list.filter((r) => r.country === countryFilter)
    if (regionFilter) list = list.filter((r) => r.region === regionFilter)
    list = list.filter((r) => matchesSearch(r, query))
    return list
  }, [rules, countryFilter, regionFilter, query])

  const groups = useMemo(() => {
    const map = new Map()
    for (const rule of filtered) {
      const key = rule.country
      if (!map.has(key)) {
        map.set(key, {
          country: key,
          countryName: rule.countryName || key,
          region: rule.region || '',
          rules: [],
        })
      }
      map.get(key).rules.push(rule)
    }
    return [...map.values()].sort((a, b) => a.countryName.localeCompare(b.countryName))
  }, [filtered])

  const stats = useMemo(() => {
    const total = filtered.length
    const active = filtered.filter((r) => r.status === 'Active').length
    const countries = new Set(filtered.map((r) => r.country)).size
    return { total, active, countries }
  }, [filtered])

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                {regulatoryMode ? 'Rules by country' : 'Rule inventory'}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-600">
                {regulatoryMode ? (
                  <>
                    One place to see which markets are covered and what each rule is for — written for policy and
                    compliance review, not engineering.
                  </>
                ) : (
                  <>
                    Compliance rules scoped by geography and gateway; validation logic runs on SNS Core News payloads.
                  </>
                )}
              </p>
            </div>
            <div
              className="flex flex-wrap items-center gap-3 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200/80"
              role="status"
            >
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-900">
                <LayoutGrid className="size-4 text-slate-500" aria-hidden />
                {stats.total.toLocaleString()} rules
              </span>
              <span className="text-slate-300">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Globe2 className="size-4 text-slate-500" aria-hidden />
                {stats.countries} countries
              </span>
              <span className="text-slate-300">·</span>
              <span>
                {stats.active.toLocaleString()} active
                {stats.total > 0 && (
                  <span className="text-slate-500"> ({Math.round((stats.active / stats.total) * 100)}%)</span>
                )}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
            <label className="relative min-w-[min(100%,20rem)] flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search country, rule ID, or keyword…"
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <select
                value={regionFilter}
                onChange={(e) => {
                  setRegionFilter(e.target.value)
                  setCountryFilter('')
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                aria-label="Filter by region"
              >
                <option value="">All regions</option>
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="min-w-[12rem] rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                aria-label="Filter by country"
              >
                <option value="">All countries</option>
                {countriesInData.map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[min(100%,720px)] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3">Rule ID</th>
                {regulatoryMode ? (
                  <>
                    <th className="px-5 py-3">What this rule covers</th>
                    <th className="px-5 py-3">Country</th>
                  </>
                ) : (
                  <>
                    <th className="px-5 py-3">Country</th>
                    <th className="px-5 py-3">Entity</th>
                  </>
                )}
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">
                  <span className="inline-flex items-center gap-1">
                    {regulatoryMode ? <Globe2 className="size-3.5 opacity-60" aria-hidden /> : <Code2 className="size-3.5 opacity-60" aria-hidden />}
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            {groups.map((g) => {
              const activeInGroup = g.rules.filter((r) => r.status === 'Active').length
              return (
                <tbody key={g.country} className="border-t border-slate-200 first:border-t-0">
                  <tr className="bg-gradient-to-r from-slate-100 to-slate-50/90">
                    <td colSpan={5} className="px-5 py-3">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{g.countryName}</p>
                          <p className="text-xs text-slate-500">{g.region}</p>
                        </div>
                        <p className="text-xs font-medium text-slate-600">
                          {g.rules.length} rules · {activeInGroup} active
                        </p>
                      </div>
                    </td>
                  </tr>
                  {g.rules.map((rule) => (
                    <tr key={rule.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="px-5 py-3.5 font-mono text-sm font-medium text-slate-900">{rule.id}</td>
                      {regulatoryMode ? (
                        <>
                          <td className="max-w-md px-5 py-3.5 text-slate-700">
                            {rule.regulatorySummary || '—'}
                          </td>
                          <td className="whitespace-nowrap px-5 py-3.5 text-slate-700">{rule.countryName || rule.country}</td>
                        </>
                      ) : (
                        <>
                          <td className="px-5 py-3.5 text-slate-700">{rule.countryName || rule.country}</td>
                          <td className="px-5 py-3.5 text-slate-700">{rule.entity}</td>
                        </>
                      )}
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
                          {regulatoryMode ? 'Details' : 'Edit'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )
            })}
          </table>
        </div>

        {groups.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-slate-500">No rules match your filters.</div>
        )}
      </div>
    </div>
  )
}

import { compileFullRule } from './types.js'
import { COUNTRIES, countryName } from './countries.js'

const ENTITIES = [
  'Gateway North',
  'EU Clearing',
  'Americas Hub',
  'APAC Processing',
  'MEA Gateway',
  'Nordic Desk',
  'LATAM Bridge',
  'Global Card Rail',
]

const PAYMENT_LABELS = {
  card: 'card payments',
  bank_transfer: 'bank transfers',
  wallet: 'digital wallets',
  '': 'all payment types',
}

const INDUSTRY_LABELS = {
  retail: 'retail',
  gaming: 'gaming',
  fx: 'FX & remittance',
  '': 'all industries',
}

function plainSummary({ countryName, entity, paymentMethod, industry }) {
  const pay = PAYMENT_LABELS[paymentMethod] ?? 'configured payment types'
  const ind = INDUSTRY_LABELS[industry] ?? 'configured sectors'
  return `${ind.charAt(0).toUpperCase() + ind.slice(1)} · ${pay} — ${entity} (${countryName})`
}

/**
 * Deterministic mock inventory for demos (e.g. ~1000 rules grouped by country).
 */
export function generateMockRules(count = 1000) {
  const fieldKeys = ['processingEntity', 'fxMode', 'transactionType']
  const operators = ['==', '!=', 'contains']
  const valuesByField = {
    processingEntity: ['PSP_CORE', 'PSP_ALT', 'BANK_DIRECT'],
    fxMode: ['locked', 'float', 'hedged'],
    transactionType: ['cross', 'domestic', 'payout'],
  }

  const rules = []
  for (let i = 0; i < count; i++) {
    const c = COUNTRIES[i % COUNTRIES.length]
    const entity = ENTITIES[i % ENTITIES.length]
    const paymentMethod = ['card', 'bank_transfer', 'wallet', ''][i % 4]
    const industry = ['retail', 'gaming', 'fx', ''][i % 4]
    const status = i % 11 === 0 ? 'Inactive' : 'Active'
    const agent = String(50 + ((i * 7) % 950)).padStart(3, '0')
    const fk = fieldKeys[i % fieldKeys.length]
    const op = operators[i % operators.length]
    const vals = valuesByField[fk]
    const val = vals[i % vals.length]

    const activation = {
      country: c.code,
      collectionAgent: agent,
      paymentMethod,
      industry,
    }

    const validationRows = [
      {
        id: `v-${i}`,
        joinBefore: null,
        fieldKey: fk,
        operator: op,
        value: val,
      },
    ]

    const id = `${c.code}-${String(i + 1).padStart(5, '0')}`

    rules.push({
      id,
      country: c.code,
      countryName: c.name,
      region: c.region,
      entity,
      status,
      regulatorySummary: plainSummary({
        countryName: c.name,
        entity,
        paymentMethod,
        industry,
      }),
      activation,
      validationRows,
      compiledExpression: '',
    })
  }

  return rules.map((r) => ({
    ...r,
    compiledExpression: compileFullRule(r.activation, r.validationRows),
  }))
}

/** Plain-language one-liner for regulators (also used when saving new rules in App). */
export function plainRegulatorySummary(activation, entity) {
  const cn = countryName(activation?.country)
  return plainSummary({
    countryName: cn,
    entity: entity || '—',
    paymentMethod: activation?.paymentMethod ?? '',
    industry: activation?.industry ?? '',
  })
}

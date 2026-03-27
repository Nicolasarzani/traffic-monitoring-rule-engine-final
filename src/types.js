/**
 * Maps UI labels to SNS Core News paths used in compiled rule expressions.
 * Paths align with transaction payloads from SNS Core News (corenewssns).
 */

import { COUNTRY_SELECT_OPTIONS } from './countries.js'

export const ACTIVATION_FIELDS = {
  country: {
    label: 'Country',
    path: 'corenewssns.data.gateway.country_code',
    wrap: 'string',
  },
  collectionAgent: {
    label: 'Collection Agent',
    path: 'corenewssns.data.gateway.collection_agent_id',
    wrap: 'string',
  },
  paymentMethod: {
    label: 'Payment Method',
    path: 'corenewssns.data.gateway.payment_method',
    wrap: 'string',
  },
  industry: {
    label: 'Industry',
    path: 'corenewssns.data.gateway.industry',
    wrap: 'string',
  },
}

export const VALIDATION_FIELDS = {
  processingEntity: {
    label: 'Processing Entity',
    path: 'corenewssns.data.gateway.processing_entity',
    wrap: 'string',
  },
  fxMode: {
    label: 'FX Mode',
    path: 'corenewssns.data.gateway.fx_mode',
    wrap: 'string',
  },
  transactionType: {
    label: 'Transaction Type',
    path: 'corenewssns.data.gateway.transaction_type',
    wrap: 'string',
  },
}

/** Dropdown options (ids / codes as stored in SNS). */
export const SELECT_OPTIONS = {
  countries: COUNTRY_SELECT_OPTIONS,
  collectionAgents: [
    { value: '174', label: 'Agent 174 (MX174005)' },
    { value: '201', label: 'Agent 201' },
    { value: '88', label: 'Agent 88' },
  ],
  paymentMethods: [
    { value: 'card', label: 'Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'wallet', label: 'Digital Wallet' },
  ],
  industries: [
    { value: 'retail', label: 'Retail' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'fx', label: 'FX / Remittance' },
  ],
}

export const VALIDATION_OPERATORS = [
  { value: '==', label: 'equals (==)' },
  { value: '!=', label: 'not equals (!=)' },
  { value: 'contains', label: 'contains' },
]

export const JOIN_OPERATORS = [
  { value: 'AND', label: 'AND' },
  { value: 'OR', label: 'OR' },
]

function escapeSingleQuotes(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

/** Wrap path for string comparisons, e.g. string(corenewssns.data.gateway.x) */
export function toSnsRef(fieldDef) {
  if (!fieldDef) return ''
  if (fieldDef.wrap === 'string') {
    return `string(${fieldDef.path})`
  }
  return fieldDef.path
}

/**
 * Compile one validation condition to an expression fragment.
 * Example: string(corenewssns.data.gateway.collection_agent_id) == '174'
 */
export function compileValidationAtom(fieldKey, operator, rawValue, fieldsMap = VALIDATION_FIELDS) {
  const def = fieldsMap[fieldKey]
  if (!def || rawValue === undefined || rawValue === '') return ''
  const lhs = toSnsRef(def)
  const v = escapeSingleQuotes(rawValue)
  if (operator === 'contains') {
    return `contains(${lhs}, '${v}')`
  }
  if (operator === '==') {
    return `${lhs} == '${v}'`
  }
  if (operator === '!=') {
    return `${lhs} != '${v}'`
  }
  return ''
}

/**
 * Chain conditions with AND/OR (left-associative with explicit parens).
 * @param {Array<{ joinBefore: 'AND'|'OR'|null, fieldKey: string, operator: string, value: string }>} rows
 */
export function compileValidationChain(rows, fieldsMap = VALIDATION_FIELDS) {
  const atoms = []
  for (const row of rows) {
    const atom = compileValidationAtom(row.fieldKey, row.operator, row.value, fieldsMap)
    if (atom) atoms.push({ atom, joinBefore: row.joinBefore })
  }
  if (atoms.length === 0) return ''
  atoms[0].joinBefore = null
  let acc = atoms[0].atom
  for (let i = 1; i < atoms.length; i++) {
    const join = atoms[i].joinBefore === 'OR' ? '||' : '&&'
    acc = `(${acc}) ${join} (${atoms[i].atom})`
  }
  return acc
}

/**
 * Activation predicates: only include dimensions the user set.
 * @param {Partial<Record<keyof typeof ACTIVATION_FIELDS, string>>} selections
 */
export function compileActivation(selections, fieldsMap = ACTIVATION_FIELDS) {
  const parts = []
  for (const key of Object.keys(fieldsMap)) {
    const val = selections[key]
    if (val === undefined || val === null || val === '') continue
    const def = fieldsMap[key]
    const lhs = toSnsRef(def)
    const v = escapeSingleQuotes(val)
    parts.push(`${lhs} == '${v}'`)
  }
  return parts.join(' && ')
}

/**
 * Full rule preview: activation gate + validation body.
 */
export function compileFullRule(activationSelections, validationRows) {
  const act = compileActivation(activationSelections)
  const val = compileValidationChain(validationRows)
  if (act && val) return `${act} && (${val})`
  if (act) return act
  if (val) return val
  return ''
}

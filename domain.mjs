import { randomUUID } from 'node:crypto';

const transitions = {
  assess: { role: 'privacy_analyst', from: 'submitted', to: 'assessed', field: 'outputAssessmentReference' },
  calibrate: { role: 'privacy_engineer', from: 'assessed', to: 'calibrated', field: 'calibrationReviewReference' },
  approve: { role: 'privacy_authority', from: 'calibrated', to: 'approved', field: 'approvalReference' },
  certify: { role: 'release_certifier', from: 'approved', to: 'certified', field: 'releaseCertificateReference' }
};

function requiredText(value, label) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} is required`);
  return value.trim();
}

function requiredNonnegativeNumber(value, label) {
  if (typeof value !== 'number' || Number.isNaN(value) || value < 0) throw new Error(`${label} must be a nonnegative number`);
  return value;
}

function clone(value) { return JSON.parse(JSON.stringify(value)); }

export class OutputPerturbationControlService {
  constructor(store, clock = () => new Date().toISOString()) { this.store = store; this.clock = clock; }

  list() { return this.store.read().cases.map(clone); }

  submit(input, actor) {
    if (actor?.role !== 'evidence_owner') throw new Error('actor role evidence_owner is required');
    const occurredAt = this.clock();
    const caseRecord = {
      id: randomUUID(),
      supplier: requiredText(input?.supplier, 'supplier'),
      evidenceReference: requiredText(input?.evidenceReference, 'evidence reference'),
      outputPurpose: requiredText(input?.outputPurpose, 'output purpose'),
      noiseScale: requiredNonnegativeNumber(input?.noiseScale, 'noise scale'),
      status: 'submitted',
      createdAt: occurredAt,
      updatedAt: occurredAt,
      auditEvents: [{ type: 'output_perturbation_submitted', actorId: requiredText(actor.id, 'actor id'), occurredAt }]
    };
    const document = this.store.read();
    document.cases.push(caseRecord);
    this.store.write(document);
    return clone(caseRecord);
  }

  transition(id, action, input, actor) {
    const rule = transitions[action];
    if (!rule) throw new Error('unsupported output-perturbation action');
    if (actor?.role !== rule.role) throw new Error(`actor role ${rule.role} is required`);
    const document = this.store.read();
    const caseRecord = document.cases.find((entry) => entry.id === id);
    if (!caseRecord) throw new Error('output-perturbation case not found');
    if (caseRecord.status !== rule.from) throw new Error(`cannot ${action} a case in ${caseRecord.status} status`);
    const occurredAt = this.clock();
    caseRecord.status = rule.to;
    caseRecord.updatedAt = occurredAt;
    caseRecord[rule.field] = requiredText(input?.[rule.field], rule.field);
    caseRecord.auditEvents.push({ type: `output_perturbation_${rule.to}`, actorId: requiredText(actor.id, 'actor id'), occurredAt });
    this.store.write(document);
    return clone(caseRecord);
  }
}

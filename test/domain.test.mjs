import { describe, expect, it } from 'vitest';
import { OutputPerturbationControlService } from '../domain.mjs';

function memoryStore() {
  let document = { cases: [] };
  return { read: () => JSON.parse(JSON.stringify(document)), write: (next) => { document = JSON.parse(JSON.stringify(next)); } };
}

function submittedCase(service) {
  return service.submit({ supplier: 'Perturbation Supplier Ltd', evidenceReference: 'EVD-783', outputPurpose: 'Supplier score publication', noiseScale: 0.3 }, { id: 'owner-1', role: 'evidence_owner' });
}

describe('OutputPerturbationControlService', () => {
  it('certifies a calibrated output only after independent control stages', () => {
    const service = new OutputPerturbationControlService(memoryStore());
    const caseRecord = submittedCase(service);
    service.transition(caseRecord.id, 'assess', { outputAssessmentReference: 'ASM-783' }, { id: 'analyst-1', role: 'privacy_analyst' });
    service.transition(caseRecord.id, 'calibrate', { calibrationReviewReference: 'CAL-783' }, { id: 'engineer-1', role: 'privacy_engineer' });
    service.transition(caseRecord.id, 'approve', { approvalReference: 'APR-783' }, { id: 'authority-1', role: 'privacy_authority' });
    const certified = service.transition(caseRecord.id, 'certify', { releaseCertificateReference: 'CRT-783' }, { id: 'certifier-1', role: 'release_certifier' });
    expect(certified.status).toBe('certified');
    expect(certified.noiseScale).toBe(0.3);
  });

  it('rejects a negative noise scale without persisting a case', () => {
    const service = new OutputPerturbationControlService(memoryStore());
    expect(() => service.submit({ supplier: 'Perturbation Supplier Ltd', evidenceReference: 'EVD-783', outputPurpose: 'Score', noiseScale: -0.1 }, { id: 'owner-1', role: 'evidence_owner' })).toThrow('noise scale');
    expect(service.list()).toHaveLength(0);
  });
});

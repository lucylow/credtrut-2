import { BaseService } from './base.service';

export interface HsmStatus {
  healthy: boolean;
  rotationDaysRemaining: number;
  keysActive: number;
  lastRotated: string;
  nextRotation: string;
  provider: string;
  hsmId: string;
}

export interface KeyInfo {
  id: string;
  algorithm: string;
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'rotating' | 'expired';
}

export class HsmService extends BaseService {
  private keys: KeyInfo[] = [
    {
      id: 'credtrust-master-001',
      algorithm: 'AES-256-GCM',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active'
    },
    {
      id: 'credtrust-signing-001',
      algorithm: 'ECDSA-P256',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active'
    },
    {
      id: 'credtrust-tee-attestation-001',
      algorithm: 'RSA-4096',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 85 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active'
    }
  ];

  constructor() {
    super('HsmService');
  }

  getStatus(): HsmStatus {
    const activeKeys = this.keys.filter(k => k.status === 'active').length;
    const nextRotation = new Date(Date.now() + 67 * 24 * 60 * 60 * 1000);
    const lastRotated = new Date(Date.now() - 23 * 24 * 60 * 60 * 1000);

    return {
      healthy: true,
      rotationDaysRemaining: 67,
      keysActive: activeKeys,
      lastRotated: lastRotated.toISOString(),
      nextRotation: nextRotation.toISOString(),
      provider: 'iExec TEE / Intel SGX',
      hsmId: 'credtrust-hsm-prod-01'
    };
  }

  getKeys(): KeyInfo[] {
    return this.keys;
  }

  rotateKey(keyId: string): KeyInfo | null {
    const keyIndex = this.keys.findIndex(k => k.id === keyId);
    if (keyIndex === -1) return null;

    // Simulate rotation
    this.keys[keyIndex] = {
      ...this.keys[keyIndex],
      status: 'rotating'
    };

    // After "rotation" completes
    setTimeout(() => {
      this.keys[keyIndex] = {
        ...this.keys[keyIndex],
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      };
    }, 2000);

    return this.keys[keyIndex];
  }
}

export const hsmService = new HsmService();

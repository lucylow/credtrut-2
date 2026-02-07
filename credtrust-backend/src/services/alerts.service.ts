import { BaseService } from './base.service';

export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertCategory = 'security' | 'performance' | 'compliance' | 'system';

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  category: AlertCategory;
  timestamp: number;
  acknowledged: boolean;
  metadata?: Record<string, any>;
}

export class AlertsService extends BaseService {
  private alerts: Alert[] = [];
  private alertIdCounter = 1;

  constructor() {
    super('AlertsService');
    this.initializeMockAlerts();
  }

  private initializeMockAlerts() {
    this.createAlert({
      title: 'TEE Attestation Verified',
      message: 'Intel SGX remote attestation completed successfully for enclave 0x1a2b...',
      severity: 'info',
      category: 'security'
    });

    this.createAlert({
      title: 'High Pool Utilization',
      message: 'Junior tranche utilization at 94%. Consider rebalancing.',
      severity: 'warning',
      category: 'performance'
    });
  }

  createAlert(params: Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>): Alert {
    const alert: Alert = {
      id: `alert-${this.alertIdCounter++}`,
      timestamp: Date.now(),
      acknowledged: false,
      ...params
    };

    this.alerts.unshift(alert);
    
    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(0, 100);
    }

    this.log(`Created alert: ${alert.title} [${alert.severity}]`);
    return alert;
  }

  getAlerts(options?: { 
    severity?: AlertSeverity; 
    category?: AlertCategory; 
    acknowledged?: boolean;
    limit?: number;
  }): Alert[] {
    let result = [...this.alerts];

    if (options?.severity) {
      result = result.filter(a => a.severity === options.severity);
    }
    if (options?.category) {
      result = result.filter(a => a.category === options.category);
    }
    if (options?.acknowledged !== undefined) {
      result = result.filter(a => a.acknowledged === options.acknowledged);
    }

    return result.slice(0, options?.limit || 50);
  }

  acknowledgeAlert(alertId: string): Alert | null {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      this.log(`Acknowledged alert: ${alertId}`);
    }
    return alert || null;
  }

  getUnacknowledgedCount(): number {
    return this.alerts.filter(a => !a.acknowledged).length;
  }

  clearAll(): void {
    this.alerts = [];
    this.log('Cleared all alerts');
  }
}

export const alertsService = new AlertsService();

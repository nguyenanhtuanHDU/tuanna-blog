import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertComponent } from 'ngx-bootstrap/alert';
import { Alert } from '../models/all.model';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
})
export class AlertsComponent {
  @Output() methodCon = new EventEmitter<string>();

  alerts: any[] = [];

  // constructor() { }

  addDefault(alert: Alert): void {
    this.alerts.push(alert);
  }

  addAlert(type: string, msg: string, timeout: number) {
    this.addDefault({ type, msg, timeout });
  }

  addAlert2() {
    // this.alerts.push({ type: 'danger', msg: 'hello i am tuan', timeout: 3000 });
    console.log('run');

  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter((alert) => alert !== dismissedAlert);
  }
}

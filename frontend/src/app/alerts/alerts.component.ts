import { Component, Input, OnInit } from '@angular/core';
import { AlertComponent } from 'ngx-bootstrap/alert';
import { Alert } from '../models/all.model';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
})
export class AlertsComponent {
  @Input() typeAlert: string;
  @Input() msgAlert: string;

  alerts: any[] = [];

  // constructor() { }

  add(alert: Alert): void {
    this.alerts.push(alert);
  }

  onClosed(dismissedAlert: AlertComponent): void {
    console.log('run');

    this.alerts = this.alerts.filter((alert) => alert !== dismissedAlert);
  }

  ngOnInit() {
    console.log('run alert', this.alerts);
    this.add({ type: this.typeAlert, msg: this.msgAlert, timeout: 3000 });
  }
}

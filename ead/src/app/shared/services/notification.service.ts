import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private notification: NzNotificationService) {}

  show(
    type: 'success' | 'info' | 'warning' | 'error',
    title: string,
    content: string,
    duration: number = 5000
  ): void {
    const customClass = `custom-notification-${type}`;
    this.notification.create(type, title, content, {
      nzClass: customClass,
      nzDuration: duration,
    });
  }
}

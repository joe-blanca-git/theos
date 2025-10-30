import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private notification: NzNotificationService) {}

  createBasicNotification(
    type: 'success' | 'error' | 'info' | 'warning', 
    bgColor: string,
    textColor: string,
    message: string
  ): void {
    this.notification[type]( '', message, { 
      nzClass: [bgColor, textColor],
      nzDuration: 7000,
      nzPlacement: 'topRight',
      nzAnimate: true
    }).onClick.subscribe(() => {

    });
  }
}

import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pwa-install-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pwa-install-banner.component.html',
  styleUrl: './pwa-install-banner.component.scss'
})
export class PwaInstallBannerComponent implements OnInit {
  deferredPrompt: any;
  showBanner = false;
  isIos = false;
  showIosModal = false;

  ngOnInit(): void {
    const isDismissed = localStorage.getItem('pwa-banner-dismissed');
    if (isDismissed) {
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    this.isIos = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;

    // Check if running as standalone (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    
    if (isStandalone) {
      return; // Already installed
    }

    if (this.isIos) {
      // iOS doesn't have beforeinstallprompt, we just show the banner directly
      // after a few seconds so it's not too aggressive
      setTimeout(() => {
        this.showBanner = true;
      }, 2000);
    }
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e: any) {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    this.deferredPrompt = e;
    // Check if dismissed
    const isDismissed = localStorage.getItem('pwa-banner-dismissed');
    if (!isDismissed) {
      this.showBanner = true;
    }
  }

  installPwa(): void {
    if (this.isIos) {
      // Show iOS instructional modal
      this.showIosModal = true;
      this.showBanner = false; // Hide the floating banner when modal opens
    } else if (this.deferredPrompt) {
      // Show the install prompt native to Android/Chrome
      this.deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      this.deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          this.dismissBanner(); 
        }
        this.deferredPrompt = null;
        this.showBanner = false;
      });
    }
  }

  dismissBanner(): void {
    this.showBanner = false;
    this.showIosModal = false;
    // If user clicked the close 'X', don't bother them again
    localStorage.setItem('pwa-banner-dismissed', 'true');
  }
}

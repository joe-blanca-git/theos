import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthUtil {

    public saveCookieAuth(response: any): void {
        const token = response.token;
        let expiresStr = '';
        try {
            let base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            while (base64.length % 4) {
                base64 += '=';
            }
            const payload = JSON.parse(atob(base64));
            if (payload && payload.exp) {
                const expDate = new Date(payload.exp * 1000);
                expiresStr = `; expires=${expDate.toUTCString()}`;
            }
        } catch (e) {}
        document.cookie = `pat_accessToken=${token}; path=/${expiresStr}; samesite=strict; secure`;
    }

    public getCookieAuth(): string {
        if (typeof document === 'undefined') {
    return '';
  }
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('pat_accessToken='))
            ?.split('=')[1];
        return token || '';
    }

    public removeCookieAuth(): void {
        document.cookie = "pat_accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    public decodeToken(token: string): any {
        try {
            let base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            while (base64.length % 4) {
                base64 += '=';
            }
            return JSON.parse(atob(base64));
        } catch (e) {
            return null;
        }
    }
}
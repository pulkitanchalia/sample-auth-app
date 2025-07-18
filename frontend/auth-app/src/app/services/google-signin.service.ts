import { Injectable } from '@angular/core';

declare global {
  interface Window {
    google: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleSignInService {
  private googleLoaded = false;
  private googleInitialized = false;

  constructor() {
    this.loadGoogleAPI();
  }

  private loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.googleLoaded) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.googleLoaded = true;
        resolve();
      };
      script.onerror = () => {
        console.error('Failed to load Google Sign-In API');
        reject(new Error('Failed to load Google Sign-In API'));
      };
      document.head.appendChild(script);
    });
  }

  async initializeGoogleSignIn(clientId: string): Promise<void> {
    if (this.googleInitialized) return;

    try {
      await this.loadGoogleAPI();
    } catch (error) {
      console.error('Google API loading failed:', error);
      throw error;
    }
    
    return new Promise((resolve, reject) => {
      try {
        if (!window.google || !window.google.accounts) {
          throw new Error('Google accounts API not available');
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: () => {}, // Will be overridden per component
          auto_select: false,
          cancel_on_tap_outside: true
        });
        
        this.googleInitialized = true;
        resolve();
      } catch (error) {
        console.error('Google Sign-In initialization failed:', error);
        reject(error);
      }
    });
  }

  renderSignInButton(element: HTMLElement, callback: (response: any) => void): void {
    if (!this.googleInitialized) {
      console.error('Google Sign-In not initialized');
      throw new Error('Google Sign-In not initialized');
    }

    if (!window.google || !window.google.accounts) {
      console.error('Google accounts API not available');
      throw new Error('Google accounts API not available');
    }

    try {
      // Set the callback for this specific render
      window.google.accounts.id.initialize({
        client_id: '277598308233-d09qs87vgpctd320uffsds64511c84tf.apps.googleusercontent.com', // This should come from environment
        callback: callback,
        auto_select: false,
        cancel_on_tap_outside: true
      });

      window.google.accounts.id.renderButton(element, {
        type: 'standard',
        shape: 'pill',
        theme: 'outline',
        text: 'signin_with',
        size: 'large',
        logo_alignment: 'left'
      });
    } catch (error) {
      console.error('Failed to render Google Sign-In button:', error);
      throw error;
    }
  }

  signOut(): Promise<void> {
    return new Promise((resolve) => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.disableAutoSelect();
      }
      resolve();
    });
  }
}

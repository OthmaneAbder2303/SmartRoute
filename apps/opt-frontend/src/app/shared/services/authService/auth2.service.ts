import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createAuth0Client, Auth0Client, Auth0ClientOptions, User } from '@auth0/auth0-spa-js';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth0Client!: Auth0Client;
  user: User | undefined = undefined;
  isAuthenticated = false;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      this.initAuth();
    }
  }

  async initAuth() {
    if (!isPlatformBrowser(this.platformId)) return;
    const config: Auth0ClientOptions = {
      domain: 'dev-3bb1c52e4yo3ytbr.eu.auth0.com',
      clientId: 'zTzkxBFsbbvXLPXlCLhtLGpY25kI9IB7',
      authorizationParams: {
        redirect_uri: 'http://localhost:4200/login/callback'
      }
    };
   console.log("dkhelte l initAuth")
    this.auth0Client = await createAuth0Client(config);

    this.isAuthenticated = await this.auth0Client.isAuthenticated();
    console.log(this,this.isAuthenticated)
    if (this.isAuthenticated) {
      console.log("authenticated ab")
      this.user = await this.auth0Client.getUser();
    }
  }

  login() {
    if (isPlatformBrowser(this.platformId)) {
      return this.auth0Client.loginWithRedirect();
    }
   return

  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      return this.auth0Client.logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      });
    }return
  }

  async handleRedirectCallback() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.auth0Client) {
      console.error("Auth0 client is not initialized yet.");
      await this.initAuth();
    }

    await this.auth0Client.handleRedirectCallback();
    this.isAuthenticated = await this.auth0Client.isAuthenticated();
    this.user = this.isAuthenticated ? await this.auth0Client.getUser() : undefined;

    console.log("Authenticated after redirect:", this.user);
  }



  getUserInfo() {
    return this.user;
  }
}

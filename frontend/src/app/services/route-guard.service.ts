import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { GlobalConstants } from '../shared/global-constants';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(private auth: AuthService,
    private router: Router,
    private snackbarService: SnackbarService) { }

  canActivate(router: ActivatedRouteSnapshot): boolean {
    let expectedRoleArray = router.data;
    expectedRoleArray = expectedRoleArray.expectedRole;
    const token: any = localStorage.getItem('token')
    var tokenPayload: any
    try {
      tokenPayload = jwt_decode(token);
    } catch (error) {
      localStorage.clear();
      this.router.navigate(['/']);
    }
    let checkRole = false;
    const n = expectedRoleArray.length;
    for (let i = 0; i < n; i++) {
      if (expectedRoleArray[i] == tokenPayload.role) {
        checkRole = true
      }
    }
    if (tokenPayload.role == 'user' || tokenPayload.role == 'admin') {
      if (this.auth.isAuthenticated() && checkRole) {
        return true
      }
      this.snackbarService.openSnackBar(GlobalConstants.unauthorized, GlobalConstants.error)
      this.router.navigate(['/cafe/dashboard'])
      return false
    } else {
      this.router.navigate(['/'])
      localStorage.clear()
      return false
    }
  }
}

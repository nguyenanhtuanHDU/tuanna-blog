import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { UserService } from "./services/user.service";

@Injectable({
  providedIn: 'root'
})
export class PermisionGuard implements CanLoad, CanActivate {
  checkUserAdmin(): Observable<boolean> {
    return this.userService.getUserInfo().pipe(
      map((data: any) => {
        return data.data.admin;
      })
    );
  }

  checkUser(userIDByRoute: string | null): Observable<boolean> {
    return this.userService.getUserInfo().pipe(
      map((data: any) => {
        return data.data._id === userIDByRoute;
      })
    );
  }

  constructor(private userService: UserService) {

  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.checkUserAdmin();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const userIDByRoute = route.paramMap.get('id')
    return this.checkUser(userIDByRoute)
  }
}

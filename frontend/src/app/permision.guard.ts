import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { UserService } from "./services/user.service";

@Injectable({
  providedIn: 'root'
})
export class PermisionGuard implements CanLoad {
  checkUserAdmin(): Observable<boolean> {
    return this.userService.getUserInfo().pipe(
      map((data: any) => {
        return data.data.admin;
      })
    );
  }

  constructor(private userService: UserService) {

  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    console.log(`🚀 ~ this.checkUserAdmin():`, this.checkUserAdmin())
    return this.checkUserAdmin();
  }

}

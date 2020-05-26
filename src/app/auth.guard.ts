import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AppService} from './app.service';


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router,
                public appService: AppService) {}

    async canActivate() {
        if (this.appService.username) {
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
}

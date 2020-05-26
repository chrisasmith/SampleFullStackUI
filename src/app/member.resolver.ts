import {Injectable} from '@angular/core';
import {AppService, Member} from './app.service';
import {ActivatedRouteSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, reduce, take} from 'rxjs/operators';

@Injectable()
export class MemberResolver {
    constructor(private appService: AppService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
        return this.appService.getMember(+route.params['id']).pipe(
            catchError((err, obs: Observable<Member>) => {
                return of([]);
            }),
            take(1),
        );
    }
}

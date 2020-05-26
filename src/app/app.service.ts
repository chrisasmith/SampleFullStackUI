import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, filter, map, reduce, scan, tap} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, of, ReplaySubject} from 'rxjs';

export interface Member {
    id?: number;
    firstName: string;
    lastName: string;
    jobTitle: string;
    team: number;
    status: string;
}

export interface Team {
    id: number;
    teamName: string;
}

export interface ValidationResult<T> {
    errors?: { msg: string, param: string, location: string }[];
    obj: Member;
}


@Injectable({
    providedIn: 'root'
})
export class AppService {
    api = 'http://localhost:8000/api';
    username: string;

    public members$: ReplaySubject<{type: string, values: Member[]}> = new ReplaySubject<{type: string, values: Member[]}>(1);
    public teams$: BehaviorSubject<Team[]> = new BehaviorSubject<Team[]>([]);

    constructor(private http: HttpClient) {
        this.members$.asObservable()
            .pipe(
                scan((acc, curr: {type: string, values: Member[]} ) => {
                    switch (true) {
                        case (curr.type === 'append'):
                            return [...acc, ...curr.values];
                        case (curr.type === 'update'):
                            acc.map(a => {
                                if (a.id === curr.values[0].id) {
                                    return curr.values[0];
                                }
                                return a;
                            });
                            return [...acc];
                        default:
                           return [...curr.values];
                    }
                }, [])
            );
    }

    // Returns all members
    getMembers(): Observable<Member[]> {
        return this.http
            .get(`${this.api}/members`)
            .pipe(catchError(this.handleError));
    }

    getMember(id: number): Observable<Member[]> {
        return this.members$
            .pipe(
                map(m => m.values.filter(d => d.id === id))
            );
    }

    setUsername(name: string): void {
        this.username = name;
    }

    addMember(memberForm: Member): Observable<ValidationResult<Member>> {
        return this.http.post(`${this.api}/addMember`, memberForm)
            .pipe(map(m => (
                {
                    obj: {
                        ...m
                    }
                } as ValidationResult<Member>
            )), catchError((err) => of(err.error)));
    }

    updateMember(member: Member): Observable<ValidationResult<Member>> {
        return this.http.put(`${this.api}/members/${member.id}`, member)
            .pipe(map(m => (
                {
                    obj: {
                        ...m
                    }
                } as ValidationResult<Member>
            )), catchError((err) => of(err.error)));
    }

    deleteMember(memberId: number) {
        return this.http.delete(`${this.api}/members/${memberId}`);
    }

    getTeams(): Observable<Team[]> {
        return this.http
            .get(`${this.api}/teams`)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        } else {
            console.error(
                `Backend returned code ${error.status}, ` + `body was: ${error.error}`
            );
        }
        return [];
    }
}

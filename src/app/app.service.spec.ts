import {TestBed, inject} from '@angular/core/testing';

import {AppService, Member, Team, ValidationResult} from './app.service';

import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('AppService', () => {
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AppService],
            imports: [HttpClientModule, HttpClientTestingModule]
        });

        httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', inject([AppService], (service: AppService) => {
        expect(service).toBeTruthy();
    }));

    it('should get Members', inject([AppService], (service: AppService) => {
        const members: Member[] = [
            {
                firstName: 'Mock',
                lastName: 'User',
                jobTitle: 'Tester',
                team: 1,
                status: 'Active'
            }
        ];

        service.getMembers().subscribe((m) => {
            expect(m.length).toBe(1);

            expect(m).toEqual(members);
        });

        expect(service).toBeTruthy();

        const request = httpMock.expectOne(`${service.api}/members`);
        expect(request.request.method).toBe('GET');
        request.flush(members);

    }));

    it('should A Member', inject([AppService], (service: AppService) => {
        const members: Member[] = [
            {
                id: 1,
                firstName: 'Mock',
                lastName: 'User',
                jobTitle: 'Tester',
                team: 1,
                status: 'Active'
            },
            {
                id: 2,
                firstName: 'Test',
                lastName: 'User',
                jobTitle: 'Mocker',
                team: 4,
                status: 'Active'
            }
        ];

        service.getMember(2).subscribe((m) => {
            expect(m[0].firstName).toEqual('Mock');
        });
    }));

    it('should add a new member', inject([AppService], (service: AppService) => {
        let members: (Member | ValidationResult<Member>)[] = [
            {
                firstName: 'Mock',
                lastName: 'User',
                jobTitle: 'Tester',
                team: 1,
                status: 'Active'
            }
        ];
        const member: Member = {
            firstName: 'New',
            lastName: 'Guy',
            jobTitle: 'Runner',
            team: 11,
            status: 'Active'
        };

        service.addMember(member).subscribe((m) => {
            members = [...members, m];
            expect(members.length).toEqual(2);
        });

        const request = httpMock.expectOne(`${service.api}/addMember`);
        expect(request.request.method).toBe('POST');
        request.flush(members);
    }));

    it('should delete selected member', inject([AppService], (service: AppService) => {
        let members: (Member | ValidationResult<Member>)[] = [
            {
                id: 1,
                firstName: 'Mock',
                lastName: 'User',
                jobTitle: 'Tester',
                team: 1,
                status: 'Active'
            },
            {
                id: 2,
                firstName: 'Test',
                lastName: 'User',
                jobTitle: 'Mocker',
                team: 4,
                status: 'Active'
            }
        ];
        const member: Member = {
            id: 1,
            firstName: 'Mock',
            lastName: 'User',
            jobTitle: 'Tester',
            team: 1,
            status: 'Active'
        };

        service.deleteMember(member.id).subscribe((res) => {
            members = members.filter((m: Member) => m.id === member.id);
            expect(members.length).toEqual(1);
        });

        const request = httpMock.expectOne(`${service.api}/members/${member.id}`);
        expect(request.request.method).toBe('DELETE');
        request.flush(members);
    }));

    it('should update selected member', inject([AppService], (service: AppService) => {
        let members: (Member | ValidationResult<Member>)[] = [
            {
                id: 1,
                firstName: 'Mock',
                lastName: 'User',
                jobTitle: 'Tester',
                team: 1,
                status: 'Active'
            },
            {
                id: 2,
                firstName: 'Test',
                lastName: 'User',
                jobTitle: 'Mocker',
                team: 4,
                status: 'Active'
            }
        ];
        const member: Member = {
            id: 1,
            firstName: 'Mock',
            lastName: 'Smith',
            jobTitle: 'Tester',
            team: 1,
            status: 'Active'
        };

        service.updateMember(member).subscribe((res) => {
            members = members.map((m: Member, idx) => {
                if (m.id === member.id) {
                    m = member;
                }
                return m;
            });
            expect(members.length).toEqual(2);
            const value = members[0] as Member;
            expect(value.lastName).toEqual('Smith');
        });

        const request = httpMock.expectOne(`${service.api}/members/${member.id}`);
        expect(request.request.method).toBe('PUT');
        request.flush(members);
    }));

    it('should get Teams', inject([AppService], (service: AppService) => {
        const teams: Team[] = [
            {
                id: 1,
                teamName: 'Mock Team One'
            },
            {
                id: 2,
                teamName: 'Mock Team Two'
            }
        ];

        service.getTeams().subscribe((t) => {
            expect(t.length).toBe(2);

            expect(t).toEqual(teams);
        });

        const request = httpMock.expectOne(`${service.api}/teams`);
        expect(request.request.method).toBe('GET');
        request.flush(teams);
    }));

});

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MembersComponent} from './members.component';

import {Router} from '@angular/router';

import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {AppService} from '../app.service';
import {ToasterService} from 'angular2-toaster';
import {of} from 'rxjs';

describe('MembersComponent', () => {
    let component: MembersComponent;
    let fixture: ComponentFixture<MembersComponent>;
    let appService = null;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MembersComponent],
            imports: [HttpClientModule, RouterModule],
            providers: [
                {
                    provide: Router,
                    useClass: class {
                        navigate = jasmine.createSpy('navigate');
                    }
                },
                {
                    provide: AppService, useValue: {
                        getTeams: () => of([{}]),
                        getMembers: () => of([{}]),
                    }
                },
                {provide: ToasterService}
            ]
        }).compileComponents();

        appService = TestBed.get(AppService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MembersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

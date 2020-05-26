import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MemberDetailsComponent} from './member-details.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';

import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {of} from 'rxjs';
import {AppService, Member, Team} from '../app.service';
import {ToasterService} from 'angular2-toaster';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

// Bonus points!
describe('MemberDetailsComponent', () => {
    let component: MemberDetailsComponent;
    let fixture: ComponentFixture<MemberDetailsComponent>;
    let appService = null;

    let de: DebugElement;
    let el: HTMLElement;

    let deleteEl: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MemberDetailsComponent],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                HttpClientModule,
                RouterModule,
                RouterTestingModule.withRoutes([])
            ],
            providers: [
                HttpClient,
                FormBuilder,
                {provide: AppService},
                {provide: ToasterService}
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(MemberDetailsComponent);
            component = fixture.componentInstance;
            component.ngOnInit();
            fixture.detectChanges();
            de = fixture.debugElement.query(By.css('form'));
            el = de.nativeElement;
        });

        const route: ActivatedRoute = TestBed.get(ActivatedRoute);
        route.data = of({
            member: [{
                id: 5,
                firstName: 'Sammy',
                lastName: 'Davis',
                jobTitle: 'Fuel Guy',
                team: 4,
                status: 'Inactive'
            }] as Member[]
        });

        appService = TestBed.get(AppService);

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MemberDetailsComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should NOT allow delete', () => {
        component.editMode = false;
        fixture.detectChanges();
        deleteEl = fixture.debugElement.query(By.css('delete-btn'));
        expect(deleteEl).toBeNull();
    });

    it('should ALLOW delete', () => {
        component.editMode = true;
        fixture.detectChanges();
        deleteEl = fixture.debugElement.query(By.css('delete-btn'));
        expect(deleteEl).toBeNull();
    });

    it('form invalid when empty', () => {
        component.memberForm.controls.firstName.setValue('');
        component.memberForm.controls.lastName.setValue('');
        component.memberForm.controls.jobTitle.setValue('');
        component.memberForm.controls.team.setValue('');
        component.memberForm.controls.status.setValue('');
        expect(component.memberForm.valid).toBeFalsy();
    });

    it('form should be valid', () => {
        component.memberForm.controls.firstName.setValue('Test');
        component.memberForm.controls.lastName.setValue('User');
        component.memberForm.controls.jobTitle.setValue('Mocker');
        component.memberForm.controls.team.setValue('2');
        component.memberForm.controls.status.setValue('Active');
        expect(component.memberForm.valid).toBeTruthy();
    });
});

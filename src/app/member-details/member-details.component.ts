import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppService, Member} from '../app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {scan, takeUntil} from 'rxjs/operators';
import {ToasterService} from 'angular2-toaster';

@Component({
    selector: 'app-member-details',
    templateUrl: './member-details.component.html',
    styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit, OnDestroy {
    private unsubscribe: Subject<any> = new Subject<any>();
    pageTitle = 'Add Member to Racing Team';
    memberModel: Member;
    memberForm: FormGroup;
    editMode = false;
    actionBtnLabel = 'Save Member';

    private member: Member = {
        firstName: null,
        lastName: null,
        jobTitle: null,
        team: null,
        status: null
    };

    get mf() {
        return this.memberForm.controls;
    }

    constructor(private activatedRoute: ActivatedRoute,
                private fb: FormBuilder,
                public appService: AppService,
                private router: Router,
                private toaster: ToasterService) {
    }

    ngOnInit() {
        if (this.activatedRoute.snapshot.data.member) {
            this.member = this.activatedRoute.snapshot.data.member[0];
            this.pageTitle = 'Edit Racing Team Member';
            this.actionBtnLabel = 'Update Member';
            this.editMode = true;
        } else {
            this.editMode = false;
            this.actionBtnLabel = 'Save Member';
        }

        this.memberForm = this.fb.group({
            firstName: [this.member.firstName || '', Validators.required],
            lastName: [this.member.lastName || '', Validators.required],
            jobTitle: [this.member.jobTitle || '', Validators.required],
            team: [this.member.team || '', Validators.required],
            status: [this.member.status || 'Active', Validators.required],
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    // TODO: Add member to members
    onSubmit(form: FormGroup) {
        this.memberModel = {...form.value, team: +form.value.team};

        if (this.editMode) {
            this.memberModel = {...form.value, id: this.member.id};
            this.appService.updateMember(this.memberModel)
                .pipe(takeUntil(this.unsubscribe))
                .subscribe(m => {
                    if (m.hasOwnProperty('errors')) {
                        m = m as any;
                        m.errors.forEach(err => this.toaster.pop('error', `Error: ${err.param} has ${err.msg}`));
                        return;
                    }
                    this.toaster.pop('success', `Member ${m.obj.firstName} ${m.obj.lastName} has been updated.`);

                    this.appService.members$.next({type: 'update', values: [m.obj]});

                    this.returnToList();
                });
            return;
        }

        this.appService.addMember(this.memberModel)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(m => {
                if (m.hasOwnProperty('errors')) {
                     m = m as any;
                    m.errors.forEach(err => this.toaster.pop('error', `Error: ${err.param} has ${err.msg}`));
                    return;
                }
                this.toaster.pop('success', `New member ${m.obj.firstName} ${m.obj.lastName} has been saved.`);

                this.appService.members$.next({type: 'append', values: [m.obj]});

                this.returnToList();
            });
    }

    public deleteMember(): void {
        this.appService.deleteMember(this.member.id)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((data: Member[]) => {
                this.appService.members$.next({type: 'replace', values: data});
                this.toaster.pop('success', `Member ${this.member.firstName} ${this.member.lastName} has been deleted.`);
                this.returnToList();
            });
    }

    public returnToList(): void {
        this.router.navigate(['/members']);
    }
}

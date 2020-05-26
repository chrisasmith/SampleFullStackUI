import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppService, Member, Team} from '../app.service';
import { Router } from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Subject, zip} from 'rxjs';
import {ToasterService} from 'angular2-toaster';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<any> = new Subject<any>();
  members: Member[] = [];
  teams: Team[] = [];

  constructor(public appService: AppService,
              private router: Router,
              private toaster: ToasterService) {}

  ngOnInit() {
    zip(this.appService.getTeams(), this.appService.getMembers())
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(data => {
          this.teams = data[0];
          this.members = data[1];
          this.appService.teams$.next(data[0]);
          this.appService.members$.next({type: 'replace', values: data[1]});
        });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public setTeamName(teamNum: number): string {
    return this.teams.length > 0 ? this.teams.filter(t => t.id === teamNum)[0].teamName : '';
  }

  public editMember(member: Member): void {
    this.router.navigate([`/details/${member.id}`]);
  }

  goToAddMemberForm() {
    this.router.navigate(['/details']);
  }

  deleteMemberById(evt: MouseEvent, member: Member) {
    this.appService.deleteMember(member.id)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((data: Member[]) => {
          this.appService.members$.next({type: 'replace', values: data});
          this.toaster.pop('success', `Member ${member.firstName} ${member.lastName} has been deleted.`);
        });
    evt.stopImmediatePropagation();
  }
}

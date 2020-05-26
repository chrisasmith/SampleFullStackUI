import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {HttpClient} from '@angular/common/http';

import {AppService} from './app.service';

import {AppComponent} from './app.component';
import {BannerComponent} from './banner/banner.component';
import {MemberDetailsComponent} from './member-details/member-details.component';
import {MembersComponent} from './members/members.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './auth.guard';
import {MemberResolver} from './member.resolver';
import {ToasterModule, ToasterService} from 'angular2-toaster';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';

// We may be missing a route...
const ROUTES = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'members',
        component: MembersComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'details/:id',
        component: MemberDetailsComponent,
        canActivate: [AuthGuard],
        resolve: {
            member: MemberResolver
        }
    },
    {
        path: 'details',
        component: MemberDetailsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    }
];

// Notice how both FormsModule and ReactiveFormsModule imported...choices, choices!
@NgModule({
    declarations: [
        AppComponent,
        BannerComponent,
        MemberDetailsComponent,
        MembersComponent,
        LoginComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(ROUTES, {useHash: true}),
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,

        ToasterModule.forRoot()
    ],
    providers: [AppService, HttpClient, AuthGuard, MemberResolver, ToasterService],
    bootstrap: [AppComponent]
})
export class AppModule {
}

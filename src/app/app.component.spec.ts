import {TestBed, async} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {BannerComponent} from './banner/banner.component';
import {APP_BASE_HREF} from '@angular/common';

import {RouterModule} from '@angular/router';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {of} from 'rxjs';
import {AppService} from './app.service';
import {ToasterModule, ToasterService} from 'angular2-toaster';
import {HttpClientModule} from '@angular/common/http';

describe('AppComponent', () => {
    let toasterServiceSpy: jasmine.Spy;
    const toasterService = jasmine.createSpyObj('toasterService', ['pop']);
    toasterServiceSpy = toasterService.pop.and.returnValue(of(''));

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AppComponent, BannerComponent],
            imports: [RouterModule.forRoot([]), HttpClientTestingModule, ToasterModule.forRoot()],
            providers: [{provide: APP_BASE_HREF, useValue: '/'}, {provide: ToasterService, useValue: toasterService}]
        }).compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

    it(`should have as title 'softrams-racing'`, async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual('softrams-racing');
    }));
});

import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import {ToasterConfig} from 'angular2-toaster';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private toastConfig: ToasterConfig = new ToasterConfig({
    showCloseButton: false,
    tapToDismiss: true,
    timeout: 5000,
    positionClass: 'toast-top-right'
  });

  title = 'softrams-racing';

  constructor(private appService: AppService) {
  }

  ngOnInit(): void {
    if (!this.appService.username || this.appService.username.length < 1) {
      this.appService.setUsername(localStorage.getItem('username'));
    }
  }
}

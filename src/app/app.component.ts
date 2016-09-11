import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationItem } from './navbar/navigation-item';
import { UIRouter } from "ui-router-ng2";
import { ReaderService } from './services/reader-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'app works!';

  public navigationItems: NavigationItem[];

	constructor(uiRouter: UIRouter) {
	}

	ngOnInit() {
		this.navigationItems = [{
			title: "Lesen",
			stateName: "app.home"
		}, {
			title: "Feeds",
			stateName: "app.choosefeeds"
		}];
  }
}

import { Component, OnInit, OnChanges, Input, DoCheck } from '@angular/core';
import { NavigationItem } from './navigation-item';
import { UIROUTER_DIRECTIVES, UIROUTER_PROVIDERS, StateRegistry, State } from "ui-router-ng2";
import { Ng2StateDeclaration } from "ui-router-ng2";

@Component({
	selector: 'navbar',
	templateUrl: './navbar.component.html',
  styleUrls: [
    './navbar.component.scss'
  ]
})
export class NavbarComponent {
	@Input('items') navigationItems: NavigationItem[] = [];
	public states: {[key:string]: State};

	constructor(private stateRegistry: StateRegistry) {
		this.states = stateRegistry.stateQueue.states;
	}

	public getNavigationItems() {
		return this.navigationItems;
	}
}

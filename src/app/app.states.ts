import {Ng2StateDeclaration} from "ui-router-ng2/ng2/interface";
import {AppComponent} from "./app.component";

import {HOME_STATES} from "./home/home.states";
import {CHOOSE_FEED_STATES} from './choose-feed/choose-feed.states';

// The top level states
let MAIN_STATES: Ng2StateDeclaration[] = [
    // The top-level app state. This state fills the root
    { name: 'app', component: AppComponent, abstract: true },
];

export let INITIAL_STATES: Ng2StateDeclaration[] =
    MAIN_STATES
			.concat(HOME_STATES)
      .concat(CHOOSE_FEED_STATES);

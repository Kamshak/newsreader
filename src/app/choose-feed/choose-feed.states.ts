import { ChooseFeedsComponent } from './choose-feed.component';
import { Ng2StateDeclaration } from "ui-router-ng2";

export let CHOOSE_FEED_STATES: Ng2StateDeclaration[] = [
	{
		name: "app.choosefeeds",
		url: "/choose-feeds",
		component: ChooseFeedsComponent
	}
];

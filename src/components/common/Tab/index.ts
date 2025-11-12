import TabBody from './TabBody';
import TabHeader from './TabHeader';
import TabIndicator from './TabIndicator';
import TabItem from './TabItem';
import TabMain from './TabMain';
import TabPane from './TabPane';

const Tab = Object.assign(TabMain, {
	Header: TabHeader,
	Pane: TabPane,
	Body: TabBody,
	Item: TabItem,
	Indicator: TabIndicator
});

export { Tab };

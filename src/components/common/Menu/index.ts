import MenuMain from './MenuMain';
import MenuContainer from './MenuContainer';
import MenuItem from './MenuItem';
import MenuTrigger from './MenuTrigger';

export const Menu = Object.assign(MenuMain, {
	Container: MenuContainer,
	Trigger: MenuTrigger,
	Item: MenuItem
});

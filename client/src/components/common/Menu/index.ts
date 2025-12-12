import MenuMain from './MenuMain';
import MenuContainer from './MenuContainer';
import MenuItem from './MenuItem';
import MenuHeader from './MenuHeader';

export const Menu = Object.assign(MenuMain, {
	Header: MenuHeader,
	Container: MenuContainer,
	Item: MenuItem
});

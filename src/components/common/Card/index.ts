import CardContainer from './CardContainer';
import CardThumbnail from './CardThumbnail';
import CardMain from './CardMain';

export const Card = Object.assign(CardMain, {
	Thumbnail: CardThumbnail,
	Container: CardContainer
});

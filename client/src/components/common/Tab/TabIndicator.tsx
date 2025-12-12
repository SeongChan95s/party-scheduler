import styles from './Tab.module.scss';
import { useTabStore } from './TabProvider';

export default function TabIndicator() {
	const left = useTabStore(state => state.tab.left);
	const width = useTabStore(state => state.tab.width);
	const cssProperty = {
		'--left': `${left}px`,
		'--width': `${width}px`
	} as React.CSSProperties;

	return <span className={styles.tabIndicator} style={cssProperty}></span>;
}

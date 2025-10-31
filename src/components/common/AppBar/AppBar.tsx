import { classNames } from '../../../utils/classNames';
import styles from './AppBar.module.scss';

/**
 * 화면 하단에 고정되는 앱 바 컴포넌트
 * @require 반드시 height값을 지정
 */
export default function AppBar({
	id = '',
	className: classNameProp,
	children
}: {
	id?: string;
	className?: string;
	children: React.ReactNode;
}) {
	const className = classNames(styles.appBar, 'app-bar', classNameProp);
	const containerClassName = classNames(styles.container, 'app-bar-container');

	return (
		<div id={id} className={className}>
			<div className={containerClassName}>{children}</div>
		</div>
	);
}

import { classNames } from '../../../utils/classNames';
import styles from './AppBar.module.scss';

/**
 * 화면 하단에 고정되는 앱 바 컴포넌트
 * @require 반드시 height값을 지정
 */
export default function AppBar({
	id = '',
	className: classNameProp,
	containerClassName: containerClassNameProp,
	variant = 'bottom',
	children
}: {
	id?: string;
	className?: string;
	containerClassName?: string;
	variant?: 'top' | 'bottom';
	children: React.ReactNode;
}) {
	const className = classNames(styles.appBar, `${variant}`, 'app-bar', classNameProp);
	const containerClassName = classNames(
		styles.container,
		'app-bar-container',
		containerClassNameProp
	);

	return (
		<aside id={id} className={className}>
			<div className={containerClassName}>{children}</div>
		</aside>
	);
}

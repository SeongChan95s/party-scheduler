import { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { DialogProvider } from './DialogProvider';
import styles from './Dialog.module.scss';
import { classNames } from '../../../utils/classNames';

interface DialogMainProps {
	className?: string;
	overlay?: boolean;
	visible: boolean;
	onChange?: (state: boolean) => void;
	children: React.ReactNode;
}

function DialogMain({
	className: classNameProp,
	overlay = false,
	visible: isVisible,
	onChange,
	children
}: DialogMainProps) {
	const targetRef = useRef<HTMLDivElement>(null);

	const setIsVisible = (value: boolean) => {
		onChange?.(value);
	};

	const className = classNames(styles.dialog, overlay && styles.overlay, classNameProp);

	return (
		<DialogProvider value={{ isVisible, setIsVisible }}>
			<CSSTransition
				nodeRef={targetRef}
				in={isVisible}
				timeout={{ enter: 250, exit: 250 }}
				mountOnEnter
				unmountOnExit>
				<section className={className} ref={targetRef}>
					<div className={styles.container}>{children}</div>
				</section>
			</CSSTransition>
		</DialogProvider>
	);
}

export default DialogMain;

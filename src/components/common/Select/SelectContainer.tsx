import { CSSTransition } from 'react-transition-group';
import { useRef, Children, isValidElement } from 'react';
import { useSelect } from './Select.hooks';
import { classNames } from '../../../utils/classNames';
import styles from './Select.module.scss';

interface Props {
	direction?: 'top' | 'bottom';
	children: React.ReactNode;
}

export default function SelectContainer({ direction = 'bottom', children }: Props) {
	const { isFocused, value, enableTextField } = useSelect();
	const nodeRef = useRef(null);

	const className = classNames(styles.container, styles[direction], 'select-container');

	const isSequentialMatch = (text: string, input: string): boolean => {
		const textLower = text.toLowerCase();
		const inputLower = input.toLowerCase();

		let textIndex = 0;

		for (let i = 0; i < inputLower.length; i++) {
			const char = inputLower[i];
			const foundIndex = textLower.indexOf(char, textIndex);

			if (foundIndex === -1) {
				return false;
			}

			textIndex = foundIndex + 1;
		}

		return true;
	};

	const sortedChildren =
		enableTextField && value
			? Children.toArray(children)
					.map(child => {
						if (isValidElement(child)) {
							const props = child.props as { children?: string };
							if (props && typeof props.children === 'string') {
								return {
									child,
									isMatch: isSequentialMatch(props.children, value),
									text: props.children
								};
							}
						}
						return { child, isMatch: false, text: '' };
					})
					.sort((a, b) => {
						if (a.isMatch && !b.isMatch) return -1;
						if (!a.isMatch && b.isMatch) return 1;
						return 0;
					})
					.map(item => item.child)
			: children;

	return (
		<CSSTransition
			nodeRef={nodeRef}
			in={isFocused}
			timeout={{ enter: 300, exit: 0 }}
			mountOnEnter
			unmountOnExit>
			<ul className={className} ref={nodeRef}>
				{sortedChildren}
			</ul>
		</CSSTransition>
	);
}

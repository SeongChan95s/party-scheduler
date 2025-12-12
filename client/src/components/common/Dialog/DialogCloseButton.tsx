import React from 'react';
import { useDialog } from './Dialog.hooks';

interface DialogCloseButtonProps {
	children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
}

export default function DialogCloseButton({ children }: DialogCloseButtonProps) {
	const { setIsVisible } = useDialog();

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setIsVisible(false);
		children.props.onClick?.(event);
	};

	return React.cloneElement(children, {
		onClick: handleClick
	});
}

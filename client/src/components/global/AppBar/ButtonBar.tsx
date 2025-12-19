import { Button } from '@/components/common/Button';
import { AppBar } from '../../common/AppBar';

interface ButtonBarProps {
	className?: string;
	children: React.ReactNode;
	form?: string;
	disabled?: boolean;
	type?: 'submit' | 'button';
	onClick?: React.MouseEventHandler;
}
export default function ButtonBar({
	className,
	form,
	type = 'button',
	disabled,
	onClick,
	children
}: ButtonBarProps) {
	return (
		<AppBar className={`h-48 `} containerClassName="">
			<Button
				className="w-full h-full"
				disabled={disabled}
				color="primary"
				type={type}
				form={form}
				onClick={onClick}>
				{children}
			</Button>
		</AppBar>
	);
}

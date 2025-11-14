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
		<AppBar className={`h-48 ${disabled ? 'disabled' : ''} group`} containerClassName="">
			<button
				className="w-full h-full text-label-1 text-white bg-primary-500 group-[.disabled]:bg-primary-300"
				disabled={disabled}
				type={type}
				form={form}
				onClick={onClick}>
				{children}
			</button>
		</AppBar>
	);
}

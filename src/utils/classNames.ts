export const classNames = (...args: (string | undefined | null | false)[]) => {
	return args.filter(Boolean).join(' ');
};

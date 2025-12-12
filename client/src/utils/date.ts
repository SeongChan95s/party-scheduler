export const getFormatDate = (date: Date, format = 'YYYY년 M월 D일 (ddd)') => {
	const dayOfWeekNames = ['일', '월', '화', '수', '목', '금', '토'];

	const year = date.getFullYear().toString();
	const month = (date.getMonth() + 1).toString();
	const monthPadded = month.padStart(2, '0');
	const day = date.getDate().toString();
	const dayPadded = day.padStart(2, '0');
	const dayOfWeek = dayOfWeekNames[date.getDay()];

	const formattedDate = format
		.replace('YYYY', year)
		.replace('YY', year.slice(-2))
		.replace('MM', monthPadded)
		.replace('M', month)
		.replace('DD', dayPadded)
		.replace('D', day)
		.replace('ddd', dayOfWeek);

	return formattedDate;
};

export const getFormatTime = (timestamp = new Date().getTime(), format = 'H시 M분') => {
	const date = new Date(timestamp);

	const hour = date.getHours().toString();
	const hourPadded = hour.padStart(2, '0');
	const minute = date.getMinutes().toString();
	const minutePadded = minute.padStart(2, '0');
	const second = date.getSeconds().toString();
	const secondPadded = second.padStart(2, '0');

	const formattedTime = format
		.replace('HH', hourPadded)
		.replace('H', hour)
		.replace('MM', minutePadded)
		.replace('M', minute)
		.replace('SS', secondPadded)
		.replace('S', second);

	return formattedTime;
};

export const getDateBefore = (period: number) => {
	const currentDate = new Date().getTime();
	const beforeDate = currentDate - period * 24 * 60 * 60 * 1000;

	return beforeDate;
};

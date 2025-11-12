import CounterDecrease from './CounterDecrease';
import CounterIncrease from './CounterIncrease';
import CounterMain from './CounterMain';
import CounterCount from './CounterCount';

export const Counter = Object.assign(CounterMain, {
	Count: CounterCount,
	Increase: CounterIncrease,
	Decrease: CounterDecrease
});

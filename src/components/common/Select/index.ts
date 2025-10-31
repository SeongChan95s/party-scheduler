import SelectContainer from './SelectContainer';
import SelectInput from './SelectInput';
import SelectMain from './SelectMain';
import SelectOption from './SelectOption';

export const Select = Object.assign(SelectMain, {
	Input: SelectInput,
	Container: SelectContainer,
	Option: SelectOption
});

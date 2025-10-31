import StepperMain from './StepperMain';
import StepperNextButton from './StepperNextButton';
import StepperPrevButton from './StepperPrevButton';
import StepperStep from './StepperStep';

const Stepper = Object.assign(StepperMain, {
	Step: StepperStep,
	Next: StepperNextButton,
	Prev: StepperPrevButton
});

export { Stepper };

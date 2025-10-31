'use client';

import FormMain from './FormMain';
import FormValidation from './FormValidation';
import Placeholder from './Placeholder';

export const Form = Object.assign(FormMain, {
	Validation: FormValidation
});

export { Placeholder };

module.exports = {
	plugins: ['@svgr/plugin-jsx'], // JSX 플러그인 추가
	template: ({ componentName, jsx }, { tpl }) => {
		const componentNameString =
			typeof componentName === 'string'
				? componentName
				: String(componentName.name || componentName);
		const modifiedComponentName = componentNameString.replace(/^Svg/, '');

		return tpl`
      import React from 'react';
      import styles from './Icon.module.scss';

      interface IconProps extends React.SVGProps<SVGSVGElement> {
        size?: 'sm' | 'md' | 'lg' | 'fill';
				className?: string;
      }

      const ${modifiedComponentName}: React.FC<IconProps> = ({ size = 'md', className = '', ...props }) => (
        ${jsx}
      );

      export default ${modifiedComponentName};
    `;
	},
	filenameCase: 'pascal',
	svgProps: {
		width: '100%',
		height: '100%',
		className: `{styles.icon + ' ' + styles[size] + ' ' + 'icon' + ' ' + className}`
	}
};

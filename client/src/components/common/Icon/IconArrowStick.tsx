import React from 'react';
import styles from './Icon.module.scss';
interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg' | 'fill';
  className?: string;
}
const IconArrowStick: React.FC<IconProps> = ({
  size = 'md',
  className = '',
  ...props
}) => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" className={styles.icon + ' ' + styles[size] + ' ' + 'icon' + ' ' + className} {...props}><path d="M11.3 19.3C11.1167 19.1167 11.0208 18.8833 11.0125 18.6C11.0042 18.3167 11.0917 18.0833 11.275 17.9L16.175 13H5C4.71667 13 4.47917 12.9042 4.2875 12.7125C4.09583 12.5208 4 12.2833 4 12C4 11.7167 4.09583 11.4792 4.2875 11.2875C4.47917 11.0958 4.71667 11 5 11H16.175L11.275 6.09999C11.0917 5.91665 11.0042 5.68332 11.0125 5.39999C11.0208 5.11665 11.1167 4.88332 11.3 4.69999C11.4833 4.51665 11.7167 4.42499 12 4.42499C12.2833 4.42499 12.5167 4.51665 12.7 4.69999L19.3 11.3C19.4 11.3833 19.4708 11.4875 19.5125 11.6125C19.5542 11.7375 19.575 11.8667 19.575 12C19.575 12.1333 19.5542 12.2583 19.5125 12.375C19.4708 12.4917 19.4 12.6 19.3 12.7L12.7 19.3C12.5167 19.4833 12.2833 19.575 12 19.575C11.7167 19.575 11.4833 19.4833 11.3 19.3Z" fill="currentColor" /></svg>;
export default IconArrowStick;
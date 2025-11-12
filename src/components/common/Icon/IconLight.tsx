import React from 'react';
import styles from './Icon.module.scss';
interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg' | 'fill';
  className?: string;
}
const IconLight: React.FC<IconProps> = ({
  size = 'md',
  className = '',
  ...props
}) => <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.icon + ' ' + styles[size] + ' ' + 'icon' + ' ' + className} {...props}><path d="M19.9956 12C15.8535 12.639 12.6807 15.9083 12.2838 19.9511L12 22.8385L11.7161 19.9511C11.3192 15.9083 8.14649 12.6366 4.00433 12C8.14649 11.361 11.3192 8.09167 11.7161 4.04884L12 1.16144L12.2838 4.04884C12.6807 8.09167 15.8535 11.3634 19.9956 12Z" fill="currentColor" /></svg>;
export default IconLight;
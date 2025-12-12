import React from 'react';
import styles from './Icon.module.scss';
interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg' | 'fill';
  className?: string;
}
const IconDecrease: React.FC<IconProps> = ({
  size = 'md',
  className = '',
  ...props
}) => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" className={styles.icon + ' ' + styles[size] + ' ' + 'icon' + ' ' + className} {...props}><path fillRule="evenodd" clipRule="evenodd" d="M3.20001 12C3.20001 11.514 3.57524 11.12 4.03811 11.12L19.9619 11.12C20.4248 11.12 20.8 11.514 20.8 12C20.8 12.486 20.4248 12.88 19.9619 12.88H4.03811C3.57524 12.88 3.20001 12.486 3.20001 12Z" fill="currentColor" /></svg>;
export default IconDecrease;
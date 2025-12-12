import React from 'react';
import styles from './Icon.module.scss';
interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg' | 'fill';
  className?: string;
}
const IconIncrease: React.FC<IconProps> = ({
  size = 'md',
  className = '',
  ...props
}) => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" className={styles.icon + ' ' + styles[size] + ' ' + 'icon' + ' ' + className} {...props}><path fillRule="evenodd" clipRule="evenodd" d="M12.8789 4.03817C12.879 3.5753 12.485 3.20004 11.999 3.20001C11.513 3.19998 11.119 3.57519 11.1189 4.03805L11.1189 11.12H4.03811C3.57524 11.12 3.20001 11.5139 3.20001 12C3.20001 12.486 3.57524 12.88 4.03811 12.88H11.1189L11.1189 19.9618C11.1189 20.4247 11.5129 20.7999 11.9989 20.8C12.4849 20.8 12.8789 20.4248 12.8789 19.9619L12.8789 12.88H19.9619C20.4248 12.88 20.8 12.486 20.8 12C20.8 11.5139 20.4248 11.12 19.9619 11.12H12.8789L12.8789 4.03817Z" fill="currentColor" /></svg>;
export default IconIncrease;
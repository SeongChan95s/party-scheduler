import React from 'react';
import styles from './Icon.module.scss';
interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg' | 'fill';
  className?: string;
}
const IconHeartFilled: React.FC<IconProps> = ({
  size = 'md',
  className = '',
  ...props
}) => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" className={styles.icon + ' ' + styles[size] + ' ' + 'icon' + ' ' + className} {...props}><path d="M20 5.40001C19 4.30001 17.5 3.60001 16 3.50001C15.3 3.50001 14.5 3.60001 13.8 3.90001C13.1 4.20001 12.5 4.70001 12 5.30001C11.5 4.70001 10.9 4.30001 10.2 3.90001C9.50002 3.60001 8.80002 3.40001 8.00002 3.50001C6.50002 3.50001 5.00002 4.20001 4.00002 5.40001C3.00002 6.50001 2.40002 8.00001 2.50002 9.60001C2.50002 12.6 4.60002 14.5 6.60002 16.3C6.80002 16.5 7.10002 16.7 7.30002 16.9L8.10002 17.7C9.00002 18.6 10 19.4 11 20.2C11.3 20.4 11.6 20.5 11.9 20.5C12.2 20.5 12.5 20.5 12.8 20.2C13.8 19.4 14.8 18.5 15.8 17.6L16.6 16.9C16.8 16.7 17.1 16.5 17.3 16.2C19.2 14.5 21.4 12.6 21.4 9.50001C21.4 7.90001 20.9 6.40001 19.9 5.30001L20 5.40001Z" fill="currentColor" /></svg>;
export default IconHeartFilled;
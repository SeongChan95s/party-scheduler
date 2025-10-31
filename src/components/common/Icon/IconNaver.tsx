import React from 'react';
import styles from './Icon.module.scss';
interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg' | 'fill';
  className?: string;
}
const IconNaver: React.FC<IconProps> = ({
  size = 'md',
  className = '',
  ...props
}) => <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.icon + ' ' + styles[size] + ' ' + 'icon' + ' ' + className} {...props}><path d="M20.0205 4.62744V19.3746H14.6383L9.36381 11.9501V19.3746H3.98163V4.62744H9.36381L14.6383 12.3487V4.62744H20.0205Z" fill="#06BE34" /></svg>;
export default IconNaver;
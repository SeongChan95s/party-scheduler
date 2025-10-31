import React from 'react';
import styles from './Icon.module.scss';
interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg' | 'fill';
  className?: string;
}
const IconMoreVertical: React.FC<IconProps> = ({
  size = 'md',
  className = '',
  ...props
}) => <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.icon + ' ' + styles[size] + ' ' + 'icon' + ' ' + className} {...props}><path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="currentColor" /><path d="M10.0555 12.2754C10.0555 11.2353 10.8987 10.3922 11.9388 10.3922C12.9789 10.3922 13.8221 11.2353 13.8221 12.2754C13.8221 13.3155 12.9789 14.1587 11.9388 14.1587C10.8987 14.1587 10.0555 13.3155 10.0555 12.2754Z" fill="currentColor" /><path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" fill="currentColor" /><path d="M10.0555 5.68401C10.0555 4.64391 10.8987 3.80075 11.9388 3.80075C12.9789 3.80075 13.8221 4.64391 13.8221 5.68401C13.8221 6.72411 12.9789 7.56727 11.9388 7.56727C10.8987 7.56727 10.0555 6.72411 10.0555 5.68401Z" fill="currentColor" /><path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" fill="currentColor" /><path d="M10.0555 18.8668C10.0555 17.8267 10.8987 16.9836 11.9388 16.9836C12.9789 16.9836 13.8221 17.8267 13.8221 18.8668C13.8221 19.9069 12.9789 20.7501 11.9388 20.7501C10.8987 20.7501 10.0555 19.9069 10.0555 18.8668Z" fill="currentColor" /></svg>;
export default IconMoreVertical;
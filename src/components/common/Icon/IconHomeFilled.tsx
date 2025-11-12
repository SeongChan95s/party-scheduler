import React from 'react';
import styles from './Icon.module.scss';
interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg' | 'fill';
  className?: string;
}
const IconHomeFilled: React.FC<IconProps> = ({
  size = 'md',
  className = '',
  ...props
}) => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" className={styles.icon + ' ' + styles[size] + ' ' + 'icon' + ' ' + className} {...props}><path d="M13.3509 2.61948C12.9402 2.38235 12.4743 2.25751 12 2.25751C11.5257 2.25751 11.0598 2.38235 10.6491 2.61948L3.89448 6.51914C3.62066 6.67722 3.39329 6.9046 3.2352 7.17841C3.07711 7.45222 2.99387 7.76283 2.99387 8.079V20.1679C2.99387 20.4068 3.08875 20.6359 3.25765 20.8048C3.42655 20.9737 3.65562 21.0685 3.89448 21.0685H9.29815C9.53701 21.0685 9.76609 20.9737 9.93498 20.8048C10.1039 20.6359 10.1988 20.4068 10.1988 20.1679V14.7642H13.8012V20.1679C13.8012 20.4068 13.8961 20.6359 14.065 20.8048C14.2339 20.9737 14.463 21.0685 14.7018 21.0685H20.1055C20.3444 21.0685 20.5734 20.9737 20.7423 20.8048C20.9112 20.6359 21.0061 20.4068 21.0061 20.1679V8.079C21.0061 7.76283 20.9229 7.45222 20.7648 7.17841C20.6067 6.9046 20.3793 6.67722 20.1055 6.51914L13.3509 2.61948Z" fill="currentColor" /></svg>;
export default IconHomeFilled;
import React from 'react';
import styles from './Icon.module.scss';
interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg' | 'fill';
  className?: string;
}
const IconArrowTrim: React.FC<IconProps> = ({
  size = 'md',
  className = '',
  ...props
}) => <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.icon + ' ' + styles[size] + ' ' + 'icon' + ' ' + className} {...props}><path d="M13.8723 11.9999L7.6267 5.7592C7.1648 5.29729 7.1648 4.55038 7.6267 4.09339C8.08861 3.63639 8.83553 3.63639 9.29743 4.09339L16.3735 11.1645C16.8206 11.6117 16.8305 12.3291 16.4079 12.791L9.30235 19.9113C9.07139 20.1422 8.76673 20.2552 8.46698 20.2552C8.16723 20.2552 7.86257 20.1422 7.63162 19.9113C7.16971 19.4494 7.16971 18.7024 7.63162 18.2454L13.8723 11.9999Z" fill="currentColor" /></svg>;
export default IconArrowTrim;
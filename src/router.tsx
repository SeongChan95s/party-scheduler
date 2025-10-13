import { createBrowserRouter } from 'react-router-dom';

interface RouteModule {
  default: React.ComponentType;
}

const modules = import.meta.glob('./app/**/*.tsx', { eager: true }) as Record<string, RouteModule>;

function getRouteFromPath(filePath: string): string {
  let route = filePath.replace('./app', '');
  route = route.replace('.tsx', '');
  route = route.replace(/\/index$/, '');
  
  if (route === '' || route === '/') {
    route = '/';
  }
  route = route.replace(/\[([^\]]+)\]/g, ':$1');
  
  return route;
}

const routes = Object.entries(modules).map(([filePath, module]) => {
  const path = getRouteFromPath(filePath);
  
  if (filePath.includes('404.tsx')) {
    return {
      path: '*',
      element: <module.default />,
    };
  }
  
  return {
    path,
    element: <module.default />,
  };
});

export const router = createBrowserRouter(routes);
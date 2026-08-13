import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '../components/ToastProvider';
import { OrganizationProvider } from './OrganizationProvider';
import { Router } from './Router';
import { SessionProvider } from './SessionProvider';

export function App() {
  return <BrowserRouter><SessionProvider><OrganizationProvider><ToastProvider><Router /></ToastProvider></OrganizationProvider></SessionProvider></BrowserRouter>;
}

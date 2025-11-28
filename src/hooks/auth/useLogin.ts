import { useLocation, useNavigate } from 'react-router-dom';

export function useLogin() {
	const navigate = useNavigate();
	const location = useLocation();

	const login = () => {
		navigate('/auth/login');
		localStorage.setItem('callbackURL', location.pathname);
	};

	return login;
}

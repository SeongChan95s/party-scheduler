import { Link, useNavigate } from 'react-router-dom';
import { IconArrowTrim } from '../common/Icon';
import { Menu } from '../common/Menu';

export default function GuideNavBar() {
	const navigate = useNavigate();

	return (
		<div className="relative h-48">
			<nav className="fixed top-0 left-0 right-0 h-48 inner bg-neutral-50 z-10 layout-width">
				<div className="flex gap-16 h-full items-center">
					<Link to="/" className="block w-fit rotate-180">
						<IconArrowTrim />
					</Link>
					<Menu className="flex h-full group" hover>
						<Menu.Header
							className="text-label-1 text-gray-500 group-hover:text-black"
							as={<button>Component</button>}
						/>
						<Menu.Container>
							<Menu.Item onClick={() => navigate('/guide/common/component')}>
								Common
							</Menu.Item>
						</Menu.Container>
					</Menu>
					<Menu className="flex h-full group" hover>
						<Menu.Header
							className="text-label-1 text-gray-500 group-hover:text-black"
							as={<button>Popup</button>}
						/>
						<Menu.Container>
							<Menu.Item onClick={() => navigate('/guide/common/popup')}>
								Common
							</Menu.Item>
							<Menu.Item onClick={() => navigate('/guide/global/popup')}>
								Global
							</Menu.Item>
						</Menu.Container>
					</Menu>
					<Menu className="flex h-full group" hover>
						<Menu.Header
							className="text-label-1 text-gray-500 group-hover:text-black"
							as={<button>Sheet</button>}
						/>
						<Menu.Container>
							<Menu.Item onClick={() => navigate('/guide/common/sheet')}>
								Common
							</Menu.Item>
						</Menu.Container>
					</Menu>
				</div>
			</nav>
		</div>
	);
}

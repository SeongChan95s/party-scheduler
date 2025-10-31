import { Accordion } from '../../components/common/Accordion';
import { AppBar } from '../../components/common/AppBar';
import { Badge } from '../../components/common/Badge';
import { IconHomeOutlined } from '../../components/common/icons';

export default function GuideBasicPage() {
	return (
		<section className="guide-page">
			<h2>가이드 페이지</h2>

			<div className="main-content">
				<section>
					<h3>App Bar</h3>
					<div className="section-content">
						<AppBar>앱 바</AppBar>
					</div>
				</section>
				<section>
					<h3>Badge</h3>
					<div className="section-content">
						<ul className="flex items-end w-fit">
							<li>
								<Badge className="text-white bg-red-500" size="sm" render={3}>
									<IconHomeOutlined size="md" />
								</Badge>
							</li>
							<li>
								<Badge className="text-white bg-red-500" size="md" render={3}>
									<IconHomeOutlined size="lg" />
								</Badge>
							</li>
						</ul>
					</div>
				</section>
				<section>
					<h3>Accordion</h3>
					<div className="section-content">
						<Accordion>
							<Accordion.Header>아코디언</Accordion.Header>
							<Accordion.Body>컨텐츠</Accordion.Body>
						</Accordion>
					</div>
				</section>
			</div>
		</section>
	);
}

import { Accordion } from '../../../components/common/Accordion';
import { Badge } from '../../../components/common/Badge';
import { Breadcrumb } from '../../../components/common/Breadcrumb';
import { Button } from '../../../components/common/Button';
import { Checkbox } from '../../../components/common/Checkbox';
import { Chip } from '../../../components/common/Chip';
import { Collapse } from '../../../components/common/Collapse';
import { Counter } from '../../../components/common/Counter';
import { Divider } from '../../../components/common/Divider';
import { Flag } from '../../../components/common/Flag';
import {
	IconAlertFilled,
	IconDecrease,
	IconHomeOutlined,
	IconIncrease
} from '../../../components/common/Icon';
import { IconButton } from '../../../components/common/IconButton';
import ImagePicker from '../../../components/common/ImagePicker';
import { Menu } from '../../../components/common/Menu';
import { RadioButton } from '../../../components/common/RadioButton';
import { Select } from '../../../components/common/Select';
import { Skeleton } from '../../../components/common/Skeleton';
import { Spinner } from '../../../components/common/Spinner';
import { StackField } from '../../../components/common/StackField';
import { Stepper } from '../../../components/common/Stepper';
import { Switch } from '../../../components/common/Switch';
import { Tab } from '../../../components/common/Tab';
import { Textarea } from '../../../components/common/Textarea';
import { TextButton } from '../../../components/common/TextButton';
import { TextField } from '../../../components/common/TextField';
import { Tooltip } from '../../../components/common/Tooltip';
import '@/assets/styles/pages/guide.scss';

export default function ComponentGuidePage() {
	return (
		<div className="guide-basic-page">
			<main>
				<header className="main-header inner">
					<h2>가이드 페이지</h2>
				</header>

				<div className="main-content inner">
					<section className="major-section">
						<h3>Basic</h3>
						<article className="main-article">
							<h4>Button</h4>
							<div className="article-content">
								<ul>
									<li>
										<h5>Size</h5>
										<div className="flex items-end gap-6">
											<Button size="xxs">Button</Button>
											<Button size="xs">Button</Button>
											<Button size="sm">Button</Button>
											<Button size="md">Button</Button>
											<Button size="lg">Button</Button>
										</div>
									</li>
									<li className="mt-12">
										<h5>Variant: Outlined</h5>
										<div className="flex items-end gap-6">
											<Button size="xxs" variant="outlined">
												Button
											</Button>
											<Button size="xs" variant="outlined">
												Button
											</Button>
											<Button size="sm" variant="outlined">
												Button
											</Button>
											<Button size="md" variant="outlined">
												Button
											</Button>
											<Button size="lg" variant="outlined">
												Button
											</Button>
										</div>
									</li>
									<li className="mt-12">
										<h5>Variant: Depth</h5>
										<div className="flex items-end gap-6">
											<Button size="xxs" variant="depth">
												Button
											</Button>
											<Button size="xs" variant="depth">
												Button
											</Button>
											<Button size="sm" variant="depth">
												Button
											</Button>
											<Button size="md" variant="depth">
												Button
											</Button>
											<Button size="lg" variant="depth">
												Button
											</Button>
										</div>
									</li>
									<li className="mt-12">
										<h5>Color: Primary</h5>
										<div className="flex items-end gap-6">
											<Button size="xxs" color="primary">
												Button
											</Button>
											<Button size="xs" color="primary">
												Button
											</Button>
											<Button size="sm" color="primary">
												Button
											</Button>
											<Button size="md" color="primary">
												Button
											</Button>
											<Button size="lg" color="primary">
												Button
											</Button>
										</div>
									</li>
									<li className="mt-12">
										<h5>Color: Primary & Variant: Outlined</h5>
										<div className="flex items-end gap-6">
											<Button size="xxs" variant="outlined" color="primary">
												Button
											</Button>
											<Button size="xs" variant="outlined" color="primary">
												Button
											</Button>
											<Button size="sm" variant="outlined" color="primary">
												Button
											</Button>
											<Button size="md" variant="outlined" color="primary">
												Button
											</Button>
											<Button size="lg" variant="outlined" color="primary">
												Button
											</Button>
										</div>
									</li>
									<li className="mt-12">
										<h5>Color: Primary & Variant: Depth</h5>
										<div className="flex items-end gap-6">
											<Button size="xxs" variant="depth" color="primary">
												Button
											</Button>
											<Button size="xs" variant="depth" color="primary">
												Button
											</Button>
											<Button size="sm" variant="depth" color="primary">
												Button
											</Button>
											<Button size="md" variant="depth" color="primary">
												Button
											</Button>
											<Button size="lg" variant="depth" color="primary">
												Button
											</Button>
										</div>
									</li>
									<li className="mt-12">
										<h5>disabled</h5>
										<div className="flex gap-12 mt-8">
											<Button variant="filled" disabled>
												Disabled
											</Button>
											<Button variant="outlined" disabled>
												Disabled
											</Button>
											<Button variant="depth" disabled>
												Disabled
											</Button>
										</div>
										<div className="flex gap-12 mt-12">
											<Button color="primary" variant="filled" disabled>
												Disabled
											</Button>

											<Button color="primary" variant="outlined" disabled>
												Disabled
											</Button>

											<Button color="primary" variant="depth" disabled>
												Disabled
											</Button>
										</div>
									</li>
								</ul>
							</div>
						</article>

						<article>
							<h4>Text Button</h4>
							<div className="article-content">
								<TextButton>Text Button</TextButton>
							</div>
						</article>

						<article>
							<h4>Icon Button</h4>
							<div className="article-content">
								<div className="flex items-end gap-8">
									<IconButton size="sm" icon={<IconAlertFilled />} />
									<IconButton icon={<IconAlertFilled />} />
									<IconButton size="lg" icon={<IconAlertFilled />} />
								</div>
							</div>
						</article>

						<article>
							<h4>Chip</h4>
							<div className="article-content">
								<ul>
									<li className="flex items-end gap-8">
										<Chip>Chip</Chip>
										<Chip variant="outlined">Chip</Chip>
										<Chip variant="depth">Chip</Chip>
									</li>
									<li className="flex items-end gap-8 mt-8">
										<Chip color="primary">Chip</Chip>
										<Chip color="primary" variant="outlined">
											Chip
										</Chip>
										<Chip color="primary" variant="depth">
											Chip
										</Chip>
									</li>
								</ul>
							</div>
						</article>

						<article>
							<h4>Flag</h4>
							<div className="article-content">
								<ul className="flex flex-col gap-8">
									<li className="flex gap-8">
										<Flag>Flag</Flag>
										<Flag variant="outlined">Flag</Flag>
										<Flag variant="depth">Flag</Flag>
									</li>

									<li className="flex gap-8">
										<Flag color="primary">Flag</Flag>
										<Flag color="primary" variant="outlined">
											Flag
										</Flag>
										<Flag color="primary" variant="depth">
											Flag
										</Flag>
									</li>
								</ul>
							</div>
						</article>

						<article>
							<h4>Badge</h4>
							<div className="article-content">
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
						</article>

						<article>
							<h4>Accordion</h4>
							<div className="article-content">
								<Accordion>
									<Accordion.Header>아코디언</Accordion.Header>
									<Accordion.Body>컨텐츠</Accordion.Body>
								</Accordion>
							</div>
						</article>

						<article>
							<h4>Collapse</h4>
							<div className="article-content">
								<Collapse>
									가나다라마바사아자차카타파하 가나다라마바사아자차카타파하
									가나다라마바사아자차카타파하 가나다라마바사아자차카타파하
									가나다라마바사아자차카타파하 가나다라마바사아자차카타파하
									가나다라마바사아자차카타파하가나다라마바사아자차카타파하
									가나다라마바사아자차카타파하가나다라마바사아자차카타파하
									가나다라마바사아자차카타파하
								</Collapse>
							</div>
						</article>

						<article>
							<h4>Menu</h4>
							<div className="article-content">
								<Menu>
									<Menu.Header />
									<Menu.Container>
										<Menu.Item>메뉴1</Menu.Item>
										<Menu.Item>메뉴2</Menu.Item>
										<Menu.Item>메뉴3</Menu.Item>
									</Menu.Container>
								</Menu>
							</div>
						</article>

						<article>
							<h4>Tooltip</h4>
							<div className="article-content">
								<Tooltip>툴팁 내용입니다.</Tooltip>
							</div>
						</article>

						<article>
							<h4>Tab Menu</h4>
							<div className="article-content">
								<Tab defaultKey="A">
									<Tab.Header>
										<Tab.Pane eventKey="A">Tab Pane A</Tab.Pane>
										<Tab.Pane eventKey="B">Tab Pane B</Tab.Pane>
										<Tab.Pane eventKey="C">Tab Pane C</Tab.Pane>
										<Tab.Indicator />
									</Tab.Header>

									<Tab.Body>
										<Tab.Item eventKey="A">Tab Item A</Tab.Item>
										<Tab.Item eventKey="B">Tab Item B</Tab.Item>
										<Tab.Item eventKey="C">Tab Item C</Tab.Item>
									</Tab.Body>
								</Tab>
							</div>
						</article>

						<article>
							<h4>Stepper</h4>
							<div className="article-content">
								<Stepper defaultActiveStep={2}>
									<Stepper.Prev>이전</Stepper.Prev>
									<Stepper.Step></Stepper.Step>
									<Stepper.Step></Stepper.Step>
									<Stepper.Step></Stepper.Step>
									<Stepper.Next>다음</Stepper.Next>
								</Stepper>
							</div>
						</article>

						<article>
							<h4>Breadcrumb</h4>
							<div className="article-content">
								<Breadcrumb
									links={[
										{
											name: 'breadcrumb01',
											href: '#none'
										},
										{
											name: 'breadcrumb02',
											href: '#none'
										},
										{
											name: 'breadcrumb03',
											href: '#none'
										}
									]}
								/>
							</div>
						</article>

						<article>
							<h4>Divider</h4>
							<div className="article-content">
								<Divider />
								<Divider color="dark" />
							</div>
						</article>

						<article>
							<h4>Spinner</h4>
							<div className="article-content">
								<div className="flex items-end gap-8">
									<Spinner size="xs" />
									<Spinner size="sm" />
									<Spinner size="md" />
									<Spinner size="lg" />
								</div>
							</div>
						</article>

						<article>
							<h4>Skeleton</h4>
							<div className="article-content">
								<Skeleton className="aspect-square mb-12" width="30%" />
								<Skeleton
									className="mb-8"
									variant="text"
									fontSize="16px"
									count={2}
									width="24%"
								/>
								<Skeleton variant="circle" width="70px" />
							</div>
						</article>
					</section>

					<Divider />

					<section className="major-section">
						<h3>Form</h3>

						<article>
							<h4>Text Field</h4>

							<ul className="article-content flex flex-col gap-16">
								<li>
									<h5>Size</h5>
									<div className="flex flex-col gap-8">
										<TextField
											size="sm"
											variant="outlined"
											placeholder="placeholder"
											label="sm"
										/>
										<TextField variant="outlined" placeholder="placeholder" label="md" />
										<TextField
											size="lg"
											variant="outlined"
											placeholder="placeholder"
											label="lg"
										/>
									</div>
								</li>

								<li>
									<h5>Variant</h5>
									<div className="flex flex-col gap-8">
										<TextField
											variant="outlined"
											placeholder="placeholder"
											label="outlined"
										/>
										<TextField
											variant="filled"
											placeholder="placeholder"
											label="filled"
										/>
										<TextField
											variant="dynamic"
											label="dynamic"
											placeholder="placeholder"
										/>
									</div>
								</li>
								<li>
									<h5>State</h5>
									<div className="flex flex-col gap-8">
										<TextField value="value" disabled={true} label="disabled" />
										<TextField
											error="에러 문구가 노출됩니다."
											label="error"
											value="value"
										/>
									</div>
								</li>
								<li>
									<h5>etc</h5>
									<div className="flex flex-col gap-8">
										<TextField
											label="with button"
											placeholder="placeholder"
											size="lg"
											element={
												<button className="h-32 pr-12 pl-12 border border-solid border-gray-300 rounded-sm text-label-2 text-gray-800">
													확인
												</button>
											}
										/>
										<TextField
											label="with Icon button"
											placeholder="placeholder"
											size="lg"
											element={
												<IconButton
													className="h-32 text-gray-700"
													icon={<IconAlertFilled />}
												/>
											}
										/>
										<TextField
											className="text-right group"
											label="fixed text"
											placeholder="0"
											size="lg"
											element={<span className="text-label-1 text-[15px]">원</span>}
										/>
									</div>
								</li>
							</ul>
						</article>

						<article>
							<h4>Textarea</h4>
							<ul className="article-content flex flex-col gap-16">
								<li>
									<h5>Variant</h5>
									<Textarea rows={3} count label="outlined" placeholder="placeholder" />
									<Textarea
										rows={3}
										count
										label="dynamic"
										placeholder="placeholder"
										variant="dynamic"
									/>
								</li>
								<li>
									<h5>State</h5>
									<Textarea
										rows={3}
										count
										label="disabled"
										placeholder="placeholder"
										value="value"
										disabled
									/>
									<Textarea
										count
										label="error"
										error="에러 문구가 노출됩니다."
										value="value"
									/>
								</li>
							</ul>
						</article>

						<article>
							<h4>Select</h4>

							<ul className="article-content flex flex-col gap-16">
								<li>
									<h5>Size</h5>
									<div className="flex flex-col gap-8">
										<Select label="sm" placeholder="placeholder" size="sm">
											<Select.Option>옵션1</Select.Option>
											<Select.Option>옵션2</Select.Option>
											<Select.Option enableTextField>직접 입력</Select.Option>
										</Select>
										<Select label="md" placeholder="placeholder">
											<Select.Option>옵션1</Select.Option>
											<Select.Option>옵션2</Select.Option>
											<Select.Option enableTextField>직접 입력</Select.Option>
										</Select>
										<Select label="lg" placeholder="placeholder" size="lg">
											<Select.Option>옵션1</Select.Option>
											<Select.Option>옵션2</Select.Option>
											<Select.Option enableTextField>직접 입력</Select.Option>
										</Select>
									</div>
								</li>
								<li>
									<h5>Variant</h5>
									<div className="flex flex-col gap-8">
										<Select
											variant="outlined"
											label="outlined"
											placeholder="placeholder"
											size="lg">
											<Select.Option>옵션1</Select.Option>
											<Select.Option>옵션2</Select.Option>
											<Select.Option enableTextField>직접 입력</Select.Option>
										</Select>
										<Select
											variant="filled"
											label="filled"
											placeholder="placeholder"
											size="lg">
											<Select.Option>옵션1</Select.Option>
											<Select.Option>옵션2</Select.Option>
											<Select.Option enableTextField>직접 입력</Select.Option>
										</Select>
										<Select
											variant="dynamic"
											label="dynamic"
											placeholder="placeholder"
											size="lg">
											<Select.Option>옵션1</Select.Option>
											<Select.Option>옵션2</Select.Option>
											<Select.Option enableTextField>직접 입력</Select.Option>
										</Select>
									</div>
								</li>
								<li>
									<h5>Direction</h5>
									<Select
										label="label"
										variant="dynamic"
										placeholder="placeholder"
										direction="top">
										<Select.Option>옵션1</Select.Option>
										<Select.Option>옵션2</Select.Option>
										<Select.Option>옵션3</Select.Option>
									</Select>
								</li>
								<li>
									<h5>State</h5>
									<div className="flex flex-col gap-8">
										<Select label="readonly" value="value" readOnly>
											<Select.Option>옵션1</Select.Option>
										</Select>
										<Select label="disabled" value="value" disabled>
											<Select.Option>옵션1</Select.Option>
										</Select>
									</div>
								</li>
							</ul>
						</article>

						<article>
							<h4>Checkbox</h4>
							<div className="article-content">
								<ul className="flex flex-col gap-12">
									<li className="flex flex-col gap-6">
										<Checkbox>Checkbox</Checkbox>
										<Checkbox color="primary">Checkbox</Checkbox>
									</li>
									<li className="flex flex-col gap-6">
										<Checkbox icon="round">Checkbox</Checkbox>
										<Checkbox icon="round" color="primary">
											Checkbox
										</Checkbox>
									</li>
									<li className="flex gap-6">
										<Checkbox variant="box">Checkbox</Checkbox>
										<Checkbox variant="box" color="primary">
											Checkbox
										</Checkbox>
									</li>
								</ul>
							</div>
						</article>

						<article>
							<h4>Radio Button</h4>
							<div className="article-content">
								<ul className="flex flex-col gap-12">
									<li className="flex flex-col gap-6">
										<RadioButton name="radio01" defaultChecked>
											Radio Button A
										</RadioButton>
										<RadioButton name="radio01" color="primary">
											Radio Button B
										</RadioButton>
									</li>
									<li className="flex flex-col gap-6">
										<RadioButton name="radio02" icon="round" defaultChecked>
											Radio Button A
										</RadioButton>
										<RadioButton name="radio02" icon="round" color="primary">
											Radio Button B
										</RadioButton>
									</li>
									<li className="flex gap-6">
										<RadioButton name="radio03" variant="box" defaultChecked>
											Radio Button A
										</RadioButton>
										<RadioButton name="radio03" variant="box">
											Radio Button B
										</RadioButton>
									</li>
									<li className="flex gap-6">
										<RadioButton
											name="radio04"
											color="primary"
											variant="box"
											defaultChecked>
											Radio Button A
										</RadioButton>
										<RadioButton name="radio04" color="primary" variant="box">
											Radio Button B
										</RadioButton>
									</li>
								</ul>
							</div>
						</article>

						<article>
							<h4>Switch</h4>
							<div className="article-content">
								<Switch />
							</div>
						</article>

						<article>
							<h4>Counter</h4>
							<div className="article-content">
								<ul>
									<li>
										<Counter variant="none">
											<Counter.Increase>
												<IconIncrease />
											</Counter.Increase>
											<Counter.Count />
											<Counter.Decrease>
												<IconDecrease />
											</Counter.Decrease>
										</Counter>
									</li>
									<li>
										<Counter>
											<Counter.Increase>
												<IconIncrease />
											</Counter.Increase>
											<Counter.Count />
											<Counter.Decrease>
												<IconDecrease />
											</Counter.Decrease>
										</Counter>
									</li>
								</ul>
							</div>
						</article>

						<article>
							<h4>Stack Field</h4>
							<div className="article-content">
								<StackField defaultValue={['A', 'B']} />
							</div>
						</article>

						<article>
							<h4>Image Picker</h4>
							<div className="article-content">
								<ul>
									<li>
										<h5>Standard</h5>
										<ImagePicker />
									</li>
									<li>
										<h5>Swiper</h5>
										<ImagePicker swiper />
									</li>
								</ul>
							</div>
						</article>
					</section>
				</div>
			</main>
		</div>
	);
}

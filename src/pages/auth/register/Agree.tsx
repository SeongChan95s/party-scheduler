import { Helmet } from 'react-helmet-async';
import { Checkbox } from '../../../components/common/Checkbox';
import { Divider } from '../../../components/common/Divider';
import { Accordion } from '../../../components/common/Accordion';
import { IconArrowTrim } from '../../../components/common/Icon';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonBar } from '../../../components/global/AppBar';

export default function RegisterAgree() {
	const [checkedState, setCheckedState] = useState([false, false]);
	const navigate = useNavigate();

	const handleCheck = (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
		setCheckedState(state => {
			const newState = [...state];
			newState[i] = e.target.checked;
			return newState;
		});
	};

	const handleCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCheckedState(checkedState.map(() => e.target.checked));
	};

	return (
		<>
			<Helmet>
				<title>파티 스케줄러 : 약관동의</title>
			</Helmet>
			<main className="register-agree-page">
				<form className="flex-1 flex flex-col justify-center items-center">
					<div>
						<div className="p-24 border border-gray-200 rounded-xl">
							<Checkbox
								checked={checkedState.every(el => el)}
								onChange={handleCheckAll}
								icon="round"
								color="primary">
								전체 동의하기
							</Checkbox>
							<Divider className="mt-21 mb-21" />
							<Accordion className="group">
								<Accordion.Header>
									<Checkbox
										checked={checkedState[0]}
										onChange={handleCheck(0)}
										icon="round"
										color="primary">
										파티 스케줄러 이용약관
									</Checkbox>
									<IconArrowTrim
										className="ml-24 text-gray-400 rotate-90 group-[.opened]:rotate-270 group-[.opened]:text-gray-900"
										size="sm"
									/>
								</Accordion.Header>
								<Accordion.Body>약관내용</Accordion.Body>
							</Accordion>
							<Accordion className="w-full! mt-14 group">
								<Accordion.Header className="justify-between">
									<Checkbox
										checked={checkedState[1]}
										onChange={handleCheck(1)}
										icon="round"
										color="primary">
										개인정보 수집 및 이용
									</Checkbox>
									<IconArrowTrim
										className="ml-24 text-gray-400 rotate-90 group-[.opened]:rotate-270 group-[.opened]:text-gray-900"
										size="sm"
									/>
								</Accordion.Header>
								<Accordion.Body>약관내용</Accordion.Body>
							</Accordion>
						</div>

						<ButtonBar
							type="button"
							disabled={!checkedState.every(el => el)}
							onClick={() => navigate('/auth/register/join')}>
							다음
						</ButtonBar>
					</div>
				</form>
			</main>
		</>
	);
}

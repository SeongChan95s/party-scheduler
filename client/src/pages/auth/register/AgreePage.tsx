import { Helmet } from 'react-helmet-async';
import { Checkbox } from '../../../components/common/Checkbox';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ButtonBar } from '../../../components/global/AppBar';

export default function AgreePage() {
	const [checkedState, setCheckedState] = useState([false, false, false]);
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
				<title>약관동의</title>
			</Helmet>
			<main className="register-agree-page">
				<form>
					<div className="title-box pt-18 pr-18 pl-18">
						<h3>모요 서비스 이용을 위해 동의가 필요해요.</h3>
						<p>
							본인확인 및 본인 인증을 위한 이메일 인증
							<br />
							서비스 이용 동의를 포함합니다.
						</p>
					</div>

					<div className="pl-18 pr-18">
						<ul>
							<li>
								<Checkbox
									checked={checkedState.every(el => el)}
									onChange={handleCheckAll}
									icon="round"
									color="primary">
									모두 동의합니다.
								</Checkbox>
							</li>
							<li>
								<Checkbox
									checked={checkedState[0]}
									onChange={handleCheck(0)}
									icon="round"
									color="primary">
									본인은 만 14세 이상입니다. (필수)
								</Checkbox>
							</li>
							<li className="flex justify-between">
								<Checkbox
									checked={checkedState[1]}
									onChange={handleCheck(1)}
									icon="round"
									color="primary">
									서비스 이용약관 동의 (필수)
								</Checkbox>
								<Link to="">약관 보기</Link>
							</li>
							<li className="flex justify-between">
								<Checkbox
									checked={checkedState[2]}
									onChange={handleCheck(2)}
									icon="round"
									color="primary">
									개인정보 수집 및 이용 동의 (필수)
								</Checkbox>
								<Link to="">약관 보기</Link>
							</li>
						</ul>
					</div>

					<ButtonBar
						type="button"
						disabled={!checkedState.every(el => el)}
						onClick={() => navigate('/auth/register/join')}>
						다음
					</ButtonBar>
				</form>
			</main>
		</>
	);
}

import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>About 페이지</h1>
      <p>파일 시스템 기반 라우팅으로 생성된 About 페이지입니다.</p>
      <Link to="/">홈으로 돌아가기</Link>
    </div>
  );
}
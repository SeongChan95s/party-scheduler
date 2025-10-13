import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>홈페이지</h1>
      <p>파일 시스템 기반 라우팅 테스트</p>
      <nav>
        <ul>
          <li><Link to="/about">About 페이지</Link></li>
          <li><Link to="/user">User 페이지</Link></li>
          <li><Link to="/user/123">User Detail (123)</Link></li>
        </ul>
      </nav>
    </div>
  );
}
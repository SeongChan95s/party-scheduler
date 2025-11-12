import { Link } from 'react-router-dom';

export default function UsersPage() {
  return (
    <div>
      <h1>User 페이지</h1>
      <p>사용자 목록 페이지입니다.</p>
      <ul>
        <li><Link to="/user/1">사용자 1</Link></li>
        <li><Link to="/user/2">사용자 2</Link></li>
        <li><Link to="/user/123">사용자 123</Link></li>
      </ul>
      <Link to="/">홈으로 돌아가기</Link>
    </div>
  );
}

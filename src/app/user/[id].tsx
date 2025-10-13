import { useParams, Link } from 'react-router-dom';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>사용자 상세 페이지</h1>
      <p>사용자 ID: {id}</p>
      <div>
        <Link to="/user">사용자 목록으로 돌아가기</Link>
        {' | '}
        <Link to="/">홈으로 돌아가기</Link>
      </div>
    </div>
  );
}
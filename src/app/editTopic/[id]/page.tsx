import { auth } from '@/auth';
import EditTopicForm from '@/components/EditTopicForm';
import { redirect } from 'next/navigation';

const apiUrl = process.env.API_URL;

// 특정 토픽 데이터를 가져오는 함수
const getTopicById = async (id: string) => {
  try {
    const res = await fetch(`${apiUrl}/api/topics/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch topic');
    }
    return res.json(); // { topic } 반환
  } catch (error) {
    console.error('Error fetching topic:', error);
    throw new Error('Failed to fetch topic data');
  }
};

export default async function EditTopicPage({
  params,
}: {
  params: { id: string };
}) {
  // 사용자 인증
  const session = await auth();
  if (!session) {
    redirect('/login');
    return null; // redirect 이후에 컴포넌트를 렌더링하지 않음
  }

  const { id } = params; // `params`는 비동기 구조 분해가 필요 없음
  try {
    const { topic } = await getTopicById(id); // 데이터 가져오기
    const { title, description } = topic;

    return <EditTopicForm id={id} title={title} description={description} />;
  } catch (error) {
    console.error('Error rendering EditTopicPage:', error);
    return <div>Failed to load topic data.</div>; // 에러 처리
  }
}

import TopicsList from '@/components/TopicList';
export default function Home() {
  return (
    <div>
      <h1 className='text-3xl font-bold'>WebDev Topics</h1>
      <p className='mb-4'>MongoDB CRUD Example</p>
      <TopicsList />
    </div>
  );
}

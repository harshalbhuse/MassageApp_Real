import { useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../components/DashboardLayout';
import CreatePost from '../components/CreatePost';
import Feed from '../components/Feed';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/home');
  }, [router]);
  return null;
}

export function HomeContent() {
  return (
    <DashboardLayout>
      <CreatePost />
      <Feed />
    </DashboardLayout>
  );
} 
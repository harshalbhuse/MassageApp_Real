import DashboardLayout from '../components/DashboardLayout';
import CreatePost from '../components/CreatePost';
import Feed from '../components/Feed';

export default function Home() {
  return (
    <DashboardLayout>
      <CreatePost />
      <Feed />
    </DashboardLayout>
  );
} 
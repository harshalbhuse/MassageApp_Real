import PostCard from './PostCard';

const posts = [
  {
    id: 1,
    user: 'Alice Wonderland',
    avatar: 'AW',
    time: 'about 2 hours ago',
    content: 'Just had a wonderful tea party! 🍵 Wonderland is looking beautiful today. #wonderland #teatime',
  },
  // Add more posts as needed
];

export default function Feed() {
  return (
    <div className="d-flex flex-column gap-4">
      {posts.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  );
} 
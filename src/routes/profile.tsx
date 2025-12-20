import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div>
      <nav>
        <div>
          <Link to="/">Home</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </nav>
    </div>
  );
}

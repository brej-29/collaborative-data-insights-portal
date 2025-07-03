import { useQuery } from "@apollo/client";
import { ALL_USERS } from "../graphql/queries";

export default function Home() {
  const { loading, error, data } = useQuery(ALL_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading users.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Users</h2>
      <ul>
        {data.allUsers.map((user: any) => (
          <li key={user.id}>
            {user.username} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

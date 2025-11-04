import { auth } from '@/lib/auth';
import { UserMenuClient } from './UserMenuClient';

export async function User() {
  let session = await auth();
  let user = session?.user;

  return <UserMenuClient user={user} />;
}

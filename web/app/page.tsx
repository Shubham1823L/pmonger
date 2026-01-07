import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home() {
  const accessToken = (await cookies()).get('accessToken')
  if (!accessToken) redirect('/login')
  else redirect('/dashboard')
  return (
    <div>
    </div>
  );
}

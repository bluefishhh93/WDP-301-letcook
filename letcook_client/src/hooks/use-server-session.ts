import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getServerAuth() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return {
      user: null,
      status: "unauthenticated",
    };
  }

  return {
    user: session.user,
    status: "authenticated",
  };
}
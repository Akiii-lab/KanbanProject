import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Aquí validas usuario con tu DB
        return { id: "123", name: "Carlos" }; // ejemplo
      },
    }),
  ],
  session: { strategy: "jwt" },
};

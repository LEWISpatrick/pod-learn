"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import MobileNav from "./mobilenav";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex justify-between items-center py-4 px-8 bg-background">
      <Link href="/" className="text-2xl font-bold text-primary">
        PodLearn
      </Link>
      <div className="hidden lg:flex items-center space-x-6">
        <Link
          href="/create-podcast"
          className="text-foreground hover:text-primary"
        >
          Create Podcast
        </Link>
        {session ? (
          <div className="flex items-center space-x-4">
            <Link
              href="/account"
              className="text-foreground hover:text-primary"
            >
              My Account
            </Link>
            {session.user.image && (
              <Image
                src={session.user.image}
                alt="User avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <button
              onClick={() => signOut()}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
          >
            Sign in
          </button>
        )}
      </div>
      <MobileNav />
    </nav>
  );
}

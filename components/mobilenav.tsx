"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="lg:hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="text-primary p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background p-4">
          <Link
            href="/"
            className="block py-2"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/create-podcast"
            className="block py-2"
            onClick={() => setIsOpen(false)}
          >
            Create Podcast
          </Link>
          {session ? (
            <>
              <Link
                href="/account"
                className="block py-2"
                onClick={() => setIsOpen(false)}
              >
                My Account
              </Link>
              <div className="flex items-center py-2">
                <Image
                  src={session.user.image || "/default-avatar.png"}
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="rounded-full mr-2"
                />
                <span>{session.user.name}</span>
              </div>
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="block w-full text-left py-2"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                signIn();
                setIsOpen(false);
              }}
              className="block w-full text-left py-2"
            >
              Sign in
            </button>
          )}
        </div>
      )}
    </div>
  );
}

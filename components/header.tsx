import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex flex-col justify-center items-center min-h-screen text-center px-4">
      <h1 className="text-5xl font-bold mb-6">
        Tired of just listening to podcasts?
      </h1>
      <h2 className="text-3xl mb-10">Use PodLearn to learn while you sleep.</h2>
      <Button>
        <Link href="/signup">Get Started</Link>
      </Button>
    </header>
  );
}

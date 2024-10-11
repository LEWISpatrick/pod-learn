import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 rounded-lg shadow-md text-center">
      <h1 className="text-3xl font-bold mb-4">Payment Successful 🙂!</h1>
      <p className="mb-6">
        Thank you for upgrading to premium. You now have unlimited podcast
        creation!
      </p>
      <Link href="/create-podcast">
        <Button variant="purple">Create a Podcast</Button>
      </Link>
    </div>
  );
}

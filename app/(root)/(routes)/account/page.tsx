import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SavedPodcast } from "@prisma/client";
export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  let savedPodcasts: SavedPodcast[] = [];
  try {
    savedPodcasts =
      (await db.savedPodcast.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      })) || [];
  } catch (error) {
    console.error("Error fetching saved podcasts:", error);
    // You might want to add some error handling here, such as displaying an error message to the user
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">Your Saved Podcasts</h1>
      {savedPodcasts.length === 0 ? (
        <p>You haven&apos;t saved any podcasts yet.</p>
      ) : (
        <ul className="space-y-4">
          {savedPodcasts.map((podcast) => (
            <li
              key={podcast.id}
              className="p-4 rounded-lg border border-gray-200"
            >
              <h2 className="text-xl font-semibold mb-2">{podcast.topic}</h2>
              <p className="text-sm mb-2">Tone: {podcast.tone}</p>
              <audio controls className="w-full mb-2">
                <source src={podcast.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <p className="text-sm text-gray-500">
                Audio URL: {podcast.audioUrl}
              </p>
              <p className="text-sm text-gray-500">
                Saved on: {new Date(podcast.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

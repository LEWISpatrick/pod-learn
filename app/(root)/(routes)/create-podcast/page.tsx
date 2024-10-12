"use client";

import React, { useState, useEffect } from "react";
import { Typography, CircularProgress, Box } from "@mui/material";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ComboboxDemo } from "@/components/ui/combobox";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const toneOptions = [
  { value: "funny 🤣", label: "Funny" },
  { value: "serious 😠", label: "Serious" },
  { value: "excited 😊", label: "Excited" },
  { value: "sad 😢", label: "Sad" },
  { value: "confused 😕", label: "Confused" },
];

const durationOptions = [
  { value: "1", label: "1 minute" },
  { value: "2", label: "2 minutes" },
  { value: "3", label: "3 minutes" },
];

const CreatePodcast = () => {
  const [topic, setTopic] = useState("");
  const [selectedTone, setSelectedTone] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [freePodcastsRemaining, setFreePodcastsRemaining] = useState(2);
  const [router] = useState(useRouter());
  const { status } = useSession();
  const [saved, setSaved] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    } else if (status === "authenticated") {
      fetchFreePodcastsRemaining();
    }
  }, [status, router]);

  useEffect(() => {
    if (saved) {
      setIsSaving(false);
    }
  }, [saved]);

  const fetchFreePodcastsRemaining = async () => {
    try {
      const response = await fetch("/api/user-status");
      const data = await response.json();
      setFreePodcastsRemaining(data.freePodcastsRemaining);
    } catch (error) {
      console.error("Error fetching user status:", error);
    }
  };

  const handleCreatePodcast = async () => {
    if (!topic || !selectedTone || !selectedDuration) {
      setError("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    setError("");
    setGeneratedContent("");

    try {
      // Generate podcast content using streaming
      const response = await fetch(
        `/api/openai/${encodeURIComponent(topic)}?tone=${encodeURIComponent(
          selectedTone
        )}&duration=${selectedDuration}`
      );

      if (!response.ok) throw new Error("Failed to generate content");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        const lines = text.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonData = JSON.parse(line.slice(6));
            setGeneratedContent((prev) => prev + jsonData.content);
          }
        }
      }

      // Generate audio
      const audioResponse = await fetch(`/api/elevenlabs/podcast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: generatedContent }),
      });
      if (!audioResponse.ok) throw new Error("Failed to generate audio");

      const audioBlob = await audioResponse.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);

      // Update free podcasts remaining
      await fetch("/api/update-free-podcasts", { method: "POST" });
      setFreePodcastsRemaining(freePodcastsRemaining - 1);
    } catch (error) {
      console.error("Error creating podcast:", error);
      setError("Failed to create podcast. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePodcast = async () => {
    if (!audioUrl) return;
    setIsSaving(true);
    try {
      const response = await fetch("/api/save-podcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, audioUrl, tone: selectedTone }),
      });
      if (!response.ok) throw new Error("Failed to save podcast");
      setSaved(true);
      // Show success message to user
    } catch (error) {
      console.error("Error saving podcast:", error);
      setError("Failed to save podcast. Please try again.");
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Create a Custom Podcast
      </h1>

      <Input
        placeholder="Topic you want to learn"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="mb-4"
      />
      <div className="flex space-x-4 mb-4">
        <ComboboxDemo
          onSelect={setSelectedTone}
          options={toneOptions}
          name="Tone"
          placeholder="Select tone..."
          emptyMessage="No tone found."
        />
        <ComboboxDemo
          onSelect={setSelectedDuration}
          options={durationOptions}
          name="Duration"
          placeholder="Select duration..."
          emptyMessage="No duration found."
          required
        />
      </div>
      <Button
        variant="purple"
        onClick={handleCreatePodcast}
        disabled={!topic || !selectedTone || !selectedDuration || isLoading}
        className="mb-6"
      >
        {isLoading ? (
          <div className="flex items-center">
            <CircularProgress size={24} color="inherit" />
            <span className="ml-2">
              Creating podcast... Takes 1 - 2 Minutes
            </span>
          </div>
        ) : (
          `Create ${selectedDuration}-Minute Podcast (Which is ${selectedTone} tone)`
        )}
      </Button>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {isLoading && (
        <Box className="mt-4">
          <Typography variant="body1">Generating content:</Typography>
          <Typography variant="body2">{generatedContent}</Typography>
        </Box>
      )}
      {audioUrl && (
        <Box className="bg-primary p-4 rounded-md mt-4">
          <Typography variant="h6" gutterBottom>
            Your Podcast is Ready!
          </Typography>
          <audio controls className="w-full mb-4">
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <Box className="flex justify-between">
            <Button
              variant="purple"
              onClick={() => {
                window.location.href = audioUrl;
              }}
            >
              Download
            </Button>
            <Button
              variant="purple"
              onClick={handleSavePodcast}
              disabled={isSaving || saved}
              className="ml-2"
            >
              {isSaving ? "Saving..." : "Save Podcast"}
            </Button>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default CreatePodcast;

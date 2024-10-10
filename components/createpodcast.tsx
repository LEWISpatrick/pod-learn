"use client";

import React, { useState } from "react";
import { Typography, CircularProgress, Box } from "@mui/material";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const CreatePodcast = () => {
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("5"); // Default to 5 minutes
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");

  const handleCreatePodcast = async () => {
    if (!topic) return;
    setIsLoading(true);
    try {
      // Generate podcast content
      const contentResponse = await fetch(
        `/api/openai/${encodeURIComponent(topic)}?duration=${duration}`
      );
      const contentData = await contentResponse.json();
      console.log(contentData);
      if (!contentResponse.ok) throw new Error(contentData.error);

      // Generate audio
      const audioResponse = await fetch(`/api/elevenlabs/podcast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: contentData.content }),
      });
      if (!audioResponse.ok) throw new Error("Failed to generate audio");

      const audioBlob = await audioResponse.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    } catch (error) {
      console.error("Error creating podcast:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6  rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Create a Custom Length Podcast
      </h1>

      <Input
        placeholder="Topic you want to learn"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="mb-4"
      />
      <Input
        type="number"
        placeholder="Duration in minutes"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="mb-4"
      />
      <Button
        variant="purple"
        onClick={handleCreatePodcast}
        disabled={!topic || isLoading}
        className="mb-6"
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          `Create ${duration}-Minute Podcast`
        )}
      </Button>
      {audioUrl && (
        <Box className="bg-primary p-4 rounded-md">
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
                /* Implement download functionality */
                window.location.href = audioUrl;
              }}
            >
              Download
            </Button>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default CreatePodcast;

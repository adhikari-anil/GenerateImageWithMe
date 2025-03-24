"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ImageIcon } from "lucide-react";
import Image from "next/image";
import { Bokor } from "next/font/google";

const customFont = Bokor({
  subsets: ["latin"],
  weight: "400",
});

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      setImage(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col p-2 gap-4">
      <h1
        className={`font-extrabold text-center text-black ${customFont.className} text-2xl`}
      >
        AI Image Generator
      </h1>
      <div className="w-full h-full">
        <Card className="p-4 w-full h-full flex flex-col lg:flex lg:flex-row justify-between gap-5">
          <CardContent className="w-full h-full">
            <form
              onSubmit={generateImage}
              className="space-y-4 w-full h-full flex flex-col gap-5 justify-center items-center"
            >
              <Textarea
                placeholder="Describe the image you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="h-[600px] text-2xl break-words"
                disabled={loading}
              />
              <Button
                type="submit"
                className="w-1/2"
                disabled={loading || !prompt}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Generate Image
                  </>
                )}
              </Button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md">
                {error}
              </div>
            )}
          </CardContent>
          <CardContent className="w-full h-full max-w-[680px] max-h-[680px]">
            {loading ? (
              <div className="h-full w-full flex justify-center items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </div>
            ) : null}
            {image && !loading && (
              <div className="relative aspect-square overflow-hidden rounded-md border">
                <Image
                  src={image || "/placeholder.svg"}
                  alt="Generated image"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}

            {!image && !loading && (
              <div className="flex w-full h-full aspect-square bg-muted rounded-md border">
                <ImageIcon className="h-full w-full text-muted-foreground/40" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

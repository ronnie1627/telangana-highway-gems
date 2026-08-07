import { createFileRoute } from "@tanstack/react-router";

const BUCKET = "property-images";
const CACHE = "public, max-age=31536000, immutable";

export const Route = createFileRoute("/api/property-images/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = params._splat;
        if (!path || path.includes("..")) {
          return new Response("Not found", { status: 404 });
        }

        const env = import.meta.env as Record<string, string | undefined>;
        const baseUrl =
          process.env.SUPABASE_URL ||
          env.VITE_SUPABASE_URL ||
          "https://ucdirffvkhtosoiksxcw.supabase.co";
        const publishableKey =
          process.env.SUPABASE_PUBLISHABLE_KEY ||
          env.VITE_SUPABASE_PUBLISHABLE_KEY ||
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjZGlyZmZ2a2h0b3NvaWtzeGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3Mjc4ODMsImV4cCI6MjA5ODMwMzg4M30.DKSqc16PZ38924jRYl3I2oTyDNcnI2LIeHg1yOWgeok";
        if (!baseUrl || !publishableKey) {
          return new Response("Storage is not configured", { status: 500 });
        }

        const encodedPath = path.split("/").map(encodeURIComponent).join("/");
        const storageUrl = `${baseUrl.replace(/\/$/, "")}/storage/v1/object/authenticated/${BUCKET}/${encodedPath}`;
        const response = await fetch(storageUrl, {
          headers: {
            apikey: publishableKey,
            Authorization: `Bearer ${publishableKey}`,
          },
        });

        if (!response.ok || !response.body) {
          return new Response("Not found", { status: 404 });
        }

        const headers = new Headers();
        headers.set("Cache-Control", CACHE);
        const contentType = response.headers.get("Content-Type");
        const contentLength = response.headers.get("Content-Length");
        const etag = response.headers.get("ETag");
        if (contentType) headers.set("Content-Type", contentType);
        if (contentLength) headers.set("Content-Length", contentLength);
        if (etag) headers.set("ETag", etag);

        return new Response(response.body, { status: 200, headers });
      },
    },
  },
});
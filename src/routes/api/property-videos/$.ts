import { createFileRoute } from "@tanstack/react-router";

const BUCKET = "property-videos";
const FALLBACK_URL = "https://ucdirffvkhtosoiksxcw.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjZGlyZmZ2a2h0b3NvaWtzeGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3Mjc4ODMsImV4cCI6MjA5ODMwMzg4M30.DKSqc16PZ38924jRYl3I2oTyDNcnI2LIeHg1yOWgeok";

export const Route = createFileRoute("/api/property-videos/$")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const path = params._splat;
        if (!path || path.includes("..")) return new Response("Not found", { status: 404 });
        const baseUrl = process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
        const key = process.env.SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || FALLBACK_KEY;
        const upstream = `${baseUrl}/storage/v1/object/authenticated/${BUCKET}/${path.split("/").map(encodeURIComponent).join("/")}`;
        const headers = new Headers({ apikey: key, Authorization: `Bearer ${key}` });
        const range = request.headers.get("range");
        if (range) headers.set("Range", range);
        const response = await fetch(upstream, { headers });
        if (!response.ok) return new Response(response.body, { status: response.status, headers: response.headers });
        const responseHeaders = new Headers(response.headers);
        responseHeaders.set("Cache-Control", "public, max-age=3600, s-maxage=86400");
        responseHeaders.set("Accept-Ranges", "bytes");
        return new Response(response.body, { status: response.status, headers: responseHeaders });
      },
    },
  },
});

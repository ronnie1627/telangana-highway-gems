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

        const baseUrl = process.env.SUPABASE_URL;
        const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
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
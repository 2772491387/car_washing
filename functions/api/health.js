export function onRequestGet() {
  return Response.json({
    status: "ok",
    service: "car-washing-site",
    runtime: "cloudflare-pages"
  });
}

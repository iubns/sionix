export async function GET() {
  return Response.json(
    {
      ok: true,
      service: "sionix-api",
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  );
}

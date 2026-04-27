export async function GET() {
  return Response.json({
    users: [
      { id: 1, name: "Rahul" },
      { id: 2, name: "John" }
    ]
  });
}
export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    const { name, email } = data;
    if (!name || !email) return new Response("Missing fields", { status: 400 });

    // If using KV (bind BLURBABLE_KV), store it:
    if (context.env && context.env.BLURBABLE_KV) {
      await context.env.BLURBABLE_KV.put(`user:${email.toLowerCase()}`, JSON.stringify({ name, email, ts: new Date().toISOString() }));
    }

    return new Response(JSON.stringify({ success: true, message: "Added to waitlist!" }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { headers: { "Content-Type": "application/json" }, status: 500 });
  }
}
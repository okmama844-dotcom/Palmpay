export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { title, message } = await req.json();
    const apiKey = Netlify.env.get("CREATOR_NOTIFY_KEY");

    // Creator Notify এর পুশ পাঠানোর এন্ডপয়েন্ট
    const response = await fetch("https://api.creatornotify.com/v1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        title: title,
        message: message
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

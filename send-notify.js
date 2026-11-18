export default async (req, context) => {
  // CORS প্রি-ফ্লাইট হ্যান্ডলিং
  if (req.method === "OPTIONS") {
    return new Response("", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { title, message, phone } = body;

    // Netlify এনভায়রনমেন্ট ভেরিয়েবল থেকে Secret Key নিন
    const apiKey = Netlify.env.get("CREATOR_NOTIFY_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "CREATOR_NOTIFY_KEY not set in Netlify environment" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // ⚠️ নিচের URL এবং body ফরম্যাট আপনার Creator Notify ডকুমেন্টেশন অনুযায়ী পরিবর্তন করতে হবে
    // এটি শুধুমাত্র অনুমানভিত্তিক উদাহরণ
    const response = await fetch("https://api.creatornotify.com/v1/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        message: message,
        phone: phone, // অথবা subscriber_id, আপনার API অনুযায়ী
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Creator Notify API error:", errText);
      return new Response(
        JSON.stringify({ error: "Failed to send push", detail: errText }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Push sent successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    console.error("Function error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

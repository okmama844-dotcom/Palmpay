export default async (req, context) => {
  // Netlify.env.get() দিয়ে Environment Variable পড়া হয়
  const apiKey = Netlify.env.get("CREATOR_NOTIFY_KEY");
  
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API Key missing" }), { status: 500 });
  }

  try {
    const body = await req.json();
    
    // ⚠️ নিচের URL এবং body ফরম্যাট আপনার Creator Notify ডকুমেন্টেশন অনুযায়ী পরিবর্তন করুন
    const response = await fetch("https://api.creatornotify.com/v1/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: body.title,
        message: body.message,
        user: body.phone
      })
    });

    return new Response(JSON.stringify({ ok: response.ok }), { 
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
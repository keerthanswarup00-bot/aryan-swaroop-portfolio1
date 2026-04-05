const resources = {
  "project-brochure-checklist": {
    title: "Project Brochure Checklist",
    path: "/resources/project-brochure-checklist.html"
  },
  "real-estate-ad-creative-audit": {
    title: "Real Estate Ad Creative Audit Sheet",
    path: "/resources/real-estate-ad-creative-audit.html"
  },
  "founder-brand-brief": {
    title: "Founder Brand Brief",
    path: "/resources/founder-brand-brief.html"
  },
  "packaging-design-brief": {
    title: "Packaging Design Brief",
    path: "/resources/packaging-design-brief.html"
  },
  "whatsapp-lead-follow-up-flow": {
    title: "WhatsApp Lead Follow-Up Flow",
    path: "/resources/whatsapp-lead-follow-up-flow.html"
  },
  "30-day-content-planner": {
    title: "30-Day Content Planner",
    path: "/resources/30-day-content-planner.html"
  }
};

function getBaseUrl(req) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return process.env.SITE_URL || `${proto}://${host}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const email = String(body.email || "").trim();
  const name = String(body.name || "").trim();
  const resourceId = String(body.resourceId || "").trim();

  if (!email || !resourceId) {
    res.status(400).json({ error: "Email and resource are required." });
    return;
  }

  const resource = resources[resourceId];
  if (!resource) {
    res.status(400).json({ error: "Unknown resource requested." });
    return;
  }

  if (!process.env.RESEND_API_KEY || !process.env.RESOURCE_FROM_EMAIL) {
    res.status(500).json({ error: "Email delivery is not configured yet. Add RESEND_API_KEY and RESOURCE_FROM_EMAIL in Vercel." });
    return;
  }

  const baseUrl = getBaseUrl(req);
  const resourceUrl = `${baseUrl}${resource.path}`;
  const visitorName = name || "there";

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.7;color:#1a1a1a">
      <p>Hi ${visitorName},</p>
      <p>Here is your requested resource: <strong>${resource.title}</strong>.</p>
      <p><a href="${resourceUrl}" style="display:inline-block;padding:12px 18px;background:#111;color:#fff;border-radius:8px;text-decoration:none">Open resource</a></p>
      <p>You can bookmark it, print it, or save it as a PDF for offline use.</p>
      <p>If you want a custom version for your project, reply to this email or message Aryan directly.</p>
    </div>
  `;

  const payload = {
    from: process.env.RESOURCE_FROM_EMAIL,
    to: [email],
    subject: `${resource.title} from Aryan Swaroop`,
    html
  };

  if (process.env.RESOURCE_REPLY_TO) {
    payload.reply_to = process.env.RESOURCE_REPLY_TO;
  }

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const resendData = await resendResponse.json();
  if (!resendResponse.ok) {
    res.status(502).json({ error: resendData.message || "Email provider request failed." });
    return;
  }

  res.status(200).json({ ok: true, id: resendData.id });
};

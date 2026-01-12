
const WORKER_URL = "https://shy-shadow-e3f8.codalchemy.workers.dev/";

export const sendNotification = async (to: string, subject: string, htmlContent: string) => {
  const payload = {
    route: "SEND_EMAIL",
    payload: {
      to: to,
      name: "JAAN User",
      subject: subject,
      html: htmlContent
    }
  };

  try {
    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (response.ok && !result.error) {
      console.log("✅ Email Sent:", subject);
      return { success: true };
    }
    return { success: false, error: result };
  } catch (error) {
    console.error("❌ Email Fatal:", error);
    return { success: false, error };
  }
};

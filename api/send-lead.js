
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID env vars');
    return res.status(500).json({ ok: false, error: 'Telegram config missing' });
  }

  try {
    const { name, phone, project, budget, timeline, contact_channel } = req.body || {};
    const text =
      `🆕 Заявка с сайта OneLinkWeb\n\n` +
      `Имя: ${name || '-'}\n` +
      `Телефон: ${phone || '-'}\n` +
      `Связаться через: ${contact_channel || '-'}\n` +
      `Бюджет: ${budget || '-'}\n` +
      `Сроки: ${timeline || '-'}\n` +
      `Описание: ${project || '-'}`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const tgRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });

    const data = await tgRes.json();
    return res.status(200).json({ ok: data.ok });
  } catch (err) {
    console.error('Telegram send error', err);
    return res.status(500).json({ ok: false, error: 'Telegram request failed' });
  }
}

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Parse the incoming request
    const body = await req.json();
    console.log('Incoming request body:', body);

    const { text } = body;
    const prompt = `Estimate the total calories for this Indian meal: "${text}". Respond with just a number.`;

    // 2. Prepare API Key
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      console.error('Missing GEMINI_API_KEY');
      return NextResponse.json({ error: 'Missing API key', calories: 0 });
    }

    // 3. Construct API request
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    console.log('Sending prompt to Gemini:', prompt);
    console.log('Request URL:', apiUrl);
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    // 4. Send request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log('Raw response from Gemini API:', JSON.stringify(data, null, 2));

    // 5. Parse response
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    console.log('Raw text from Gemini:', raw);

    const match = raw.match(/(\d+)\s?kcal|\b(\d+)\b/);
    const calories = match ? parseInt(match[1] || match[2]) : 0;

    console.log('Extracted calories:', calories);

    return NextResponse.json({ calories });
  } catch (err) {
    console.error('Unexpected error occurred:', err);
    return NextResponse.json({ calories: 0 });
  }
}

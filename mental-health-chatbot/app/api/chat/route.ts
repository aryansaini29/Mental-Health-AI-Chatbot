import { NextResponse } from 'next/server';

const DEFAULT_GEMINI_MODEL = 'gemini-2.0-flash';
const DEFAULT_GEMINI_API_VERSION = 'v1';

function getGeminiConfig() {
    return {
        version: process.env.GEMINI_API_VERSION?.trim() || DEFAULT_GEMINI_API_VERSION,
        model: process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL,
    };
}

function isTimeQuery(message: string): boolean {
    return /\b(time|current time|what time|tell me the time|date|today|day of week|what day|current date)\b/i.test(message);
}

function isWeatherQuery(message: string): boolean {
    return /\bweather\b/i.test(message);
}

function extractWeatherLocation(message: string): string | null {
    const patterns = [
        /weather\s+(?:in|at|for)\s+(.+)/i,
        /(?:in|at|for)\s+([A-Za-z][A-Za-z\s,.-]{1,80})\s+weather/i,
    ];

    for (const pattern of patterns) {
        const match = message.match(pattern);
        if (match?.[1]) {
            return match[1].replace(/[?.!,]+$/g, '').trim();
        }
    }

    return null;
}

function weatherCodeToText(code: number): string {
    if (code === 0) return 'Clear sky';
    if ([1, 2, 3].includes(code)) return 'Partly cloudy';
    if ([45, 48].includes(code)) return 'Foggy';
    if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
    if ([61, 63, 65, 66, 67].includes(code)) return 'Rain';
    if ([71, 73, 75, 77].includes(code)) return 'Snow';
    if ([80, 81, 82].includes(code)) return 'Rain showers';
    if ([85, 86].includes(code)) return 'Snow showers';
    if ([95, 96, 99].includes(code)) return 'Thunderstorm';
    return 'Unknown conditions';
}

async function getWeatherReply(message: string): Promise<string> {
    const location = extractWeatherLocation(message);

    if (!location) {
        return "Tell me the city or place you want the weather for, like 'weather in London' or 'weather in Mumbai'.";
    }

    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geocodeUrl);

    if (!geoResponse.ok) {
        return `I couldn't look up the weather for ${location} right now. Try a different city name.`;
    }

    const geoData = (await geoResponse.json()) as {
        results?: Array<{ name: string; country?: string; latitude: number; longitude: number; timezone?: string }>;
    };

    const place = geoData.results?.[0];
    if (!place) {
        return `I couldn't find a place called ${location}. Try a city, region, or country name.`;
    }

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current_weather=true&timezone=auto`;
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
        return `I found ${place.name}, but couldn't fetch the live weather right now.`;
    }

    const weatherData = (await weatherResponse.json()) as {
        current_weather?: {
            temperature: number;
            windspeed: number;
            weathercode: number;
            time: string;
        };
    };

    const current = weatherData.current_weather;
    if (!current) {
        return `I found ${place.name}, but the weather service didn't return current conditions.`;
    }

    const condition = weatherCodeToText(current.weathercode);
    const placeLabel = [place.name, place.country].filter(Boolean).join(', ');

    return `Current weather for ${placeLabel}: ${current.temperature}°C, ${condition}, wind ${current.windspeed} km/h.`;
}

function getTimeReply(): string {
    const now = new Date();
    const date = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
    const time = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
    });

    return `It is ${time} on ${date}.`;
}

function getFallbackReply(message: string): string {
    const lower = message.toLowerCase();

    if (/code|typescript|javascript|react|next|supabase|sql|python|bug|error|fix|debug/i.test(lower)) {
        return "I can help with that. Share the exact code or error message, and I’ll walk through the fix step by step.";
    }

    if (/what|who|when|where|why|how|define|explain|meaning|difference|compare/i.test(lower)) {
        return "I can help explain that. Please share the topic or question in a bit more detail, and I’ll give you a clear answer.";
    }

    if (/write|draft|email|message|essay|summary|paragraph|resume|cv|cover letter/i.test(lower)) {
        return "I can help draft that. Tell me the tone, length, and any details you want included, and I’ll write it for you.";
    }

    if (/math|calculate|equation|solve|percentage|algebra|geometry|probability/i.test(lower)) {
        return "I can help solve that. Send the full problem, and I’ll work through it clearly.";
    }

    if (/sad|cry|depress|down|lonely|hopeless|hurt|pain/i.test(lower)) {
        return "I'm here with you. It makes sense to feel this way, and you do not have to carry it alone. Want to share what feels heaviest right now?";
    }

    if (/anxious|anxiety|worry|nervous|panic|stress|scared|fear/i.test(lower)) {
        return "That sounds overwhelming. Try one slow breath with me: inhale 4, hold 4, exhale 4. We can take this one step at a time.";
    }

    if (/happy|great|good|amazing|wonderful|excited|joy|glad/i.test(lower)) {
        return 'I love hearing that. What is one thing from today you want to remember and celebrate?';
    }

    return "I’m here to help. Ask me anything, and I’ll do my best to give you a clear and useful answer.";
}

function getSetupReply(): string {
    return "Gemini is not configured yet. Add a valid GEMINI_API_KEY to .env.local, restart the app, and I’ll start answering like a real AI assistant.";
}

function buildPrompt(message: string, history: Array<{ sender: string; content: string }>) {
    const recentContext = history
        .slice(-10)
        .map((entry) => `${entry.sender === 'user' ? 'User' : 'Assistant'}: ${entry.content}`)
        .join('\n');

    return [
        'You are MindfulAI, a helpful all-purpose assistant with a compassionate style.',
        'You can answer general knowledge, coding, debugging, writing, math, planning, productivity, and mental health support questions.',
        'Be accurate, clear, direct, and helpful. If the user is unclear, ask a short clarifying question.',
        'If you are unsure, say so honestly and give your best helpful next step.',
        'For mental health topics, be warm, empathetic, concise, and non-judgmental.',
        'Do not claim to diagnose or replace a therapist.',
        'If the user mentions self-harm, suicide, or immediate danger, respond with a brief supportive message urging them to contact local emergency services or a crisis hotline immediately.',
        'Do not refuse harmless requests. Answer as fully as you can.',
        'Use the conversation context when relevant.',
        '',
        recentContext ? `Conversation so far:\n${recentContext}` : 'Conversation so far: none.',
        `User message: ${message}`,
        'Assistant reply:',
    ].join('\n');
}

async function callGemini(apiKey: string, prompt: string): Promise<{ reply?: string; error?: string; source: string }> {
    const { version, model } = getGeminiConfig();
    const endpoint = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent`;

    const response = await fetch(`${endpoint}?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [
                {
                    role: 'user',
                    parts: [{ text: prompt }],
                },
            ],
            generationConfig: {
                temperature: 0.7,
                topP: 0.95,
                maxOutputTokens: 512,
            },
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        const isQuotaError = response.status === 429 || /quota|billing/i.test(errorText);
        const isModelError = /404|not found|unsupported/i.test(errorText);

        console.warn(`Gemini ${version}/${model} failed:`, errorText);

        return {
            reply: undefined,
            source: isQuotaError ? 'gemini-quota-exceeded' : isModelError ? 'gemini-model-error' : 'gemini-error',
            error: errorText.slice(0, 240),
        };
    }

    const data = (await response.json()) as {
        candidates?: Array<{
            content?: {
                parts?: Array<{ text?: string }>;
            };
        }>;
    };

    const reply = data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim();

    if (!reply) {
        return {
            reply: undefined,
            source: 'gemini-empty',
            error: 'Gemini responded without text.',
        };
    }

    return { reply, source: `${version}/${model}` };
}

export async function POST(request: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        const body = (await request.json()) as {
            message?: string;
            history?: Array<{ sender: string; content: string }>;
        };

        const message = body.message?.trim();
        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        if (isTimeQuery(message)) {
            return NextResponse.json({ reply: getTimeReply(), source: 'local-time' });
        }

        if (isWeatherQuery(message)) {
            const reply = await getWeatherReply(message);
            return NextResponse.json({ reply, source: 'local-weather' });
        }

        if (!apiKey || apiKey.startsWith('REPLACE_WITH_')) {
            return NextResponse.json(
                {
                    reply: getSetupReply(),
                    source: 'setup',
                    error: 'Missing GEMINI_API_KEY configuration.',
                },
                { status: 503 }
            );
        }

        const prompt = buildPrompt(message, body.history || []);
        const geminiResult = await callGemini(apiKey, prompt);

        if (!geminiResult.reply) {
            return NextResponse.json(
                {
                    reply: getFallbackReply(message),
                    source: geminiResult.source,
                    error: geminiResult.error || 'Empty Gemini response.',
                },
                { status: 200 }
            );
        }

        return NextResponse.json({ reply: geminiResult.reply, source: geminiResult.source });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.warn('Chat API error:', message);
        return NextResponse.json(
            {
                reply: `Chat service error: ${message}`,
                source: 'chat-error',
                error: message,
            },
            { status: 500 }
        );
    }
}

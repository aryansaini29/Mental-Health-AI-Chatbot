import { NextResponse } from 'next/server';

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

function getFallbackReply(message: string): string {
    const lower = message.toLowerCase();

    if (/sad|cry|depress|down|lonely|hopeless|hurt|pain/i.test(lower)) {
        return "I'm here with you. It makes sense to feel this way, and you do not have to carry it alone. Want to share what feels heaviest right now?";
    }

    if (/anxious|anxiety|worry|nervous|panic|stress|scared|fear/i.test(lower)) {
        return "That sounds overwhelming. Try one slow breath with me: inhale 4, hold 4, exhale 4. We can take this one step at a time.";
    }

    if (/happy|great|good|amazing|wonderful|excited|joy|glad/i.test(lower)) {
        return 'I love hearing that. What is one thing from today you want to remember and celebrate?';
    }

    return "Thank you for sharing that. I'm here to listen and support you. Do you want to talk more about what you're feeling right now?";
}

function buildPrompt(message: string, history: Array<{ sender: string; content: string }>) {
    const recentContext = history
        .slice(-10)
        .map((entry) => `${entry.sender === 'user' ? 'User' : 'Assistant'}: ${entry.content}`)
        .join('\n');

    return [
        'You are MindfulAI, a supportive mental health companion.',
        'Be warm, empathetic, concise, and non-judgmental.',
        'Do not claim to diagnose or replace a therapist.',
        'If the user mentions self-harm, suicide, or immediate danger, respond with a brief supportive message urging them to contact local emergency services or a crisis hotline immediately.',
        'Use the conversation context when relevant.',
        '',
        recentContext ? `Conversation so far:\n${recentContext}` : 'Conversation so far: none.',
        `User message: ${message}`,
        'Assistant reply:',
    ].join('\n');
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

        if (!apiKey || apiKey.startsWith('REPLACE_WITH_')) {
            return NextResponse.json({ reply: getFallbackReply(message), source: 'fallback' });
        }

        const prompt = buildPrompt(message, body.history || []);

        const response = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
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
                    maxOutputTokens: 256,
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.warn('Gemini request failed:', errorText);
            return NextResponse.json({ reply: getFallbackReply(message), source: 'fallback' });
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
            return NextResponse.json({ reply: getFallbackReply(message), source: 'fallback' });
        }

        return NextResponse.json({ reply, source: 'gemini' });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.warn('Chat API error:', message);
        return NextResponse.json({ reply: getFallbackReply(''), source: 'fallback' });
    }
}

import { NextResponse } from 'next/server';

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

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
        if (!apiKey) {
            return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 });
        }

        const body = (await request.json()) as {
            message?: string;
            history?: Array<{ sender: string; content: string }>;
        };

        const message = body.message?.trim();
        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
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
            return NextResponse.json(
                { error: 'Gemini request failed', details: errorText },
                { status: response.status }
            );
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
            return NextResponse.json({ error: 'Empty Gemini response' }, { status: 500 });
        }

        return NextResponse.json({ reply });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

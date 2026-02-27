export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

export function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
}

export function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
}

export function getPasswordStrength(password: string): {
    score: number;
    label: string;
    color: string;
} {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score, label: 'Weak', color: 'bg-red-400' };
    if (score <= 2) return { score, label: 'Fair', color: 'bg-orange-400' };
    if (score <= 3) return { score, label: 'Good', color: 'bg-yellow-400' };
    if (score <= 4) return { score, label: 'Strong', color: 'bg-green-400' };
    return { score, label: 'Very Strong', color: 'bg-emerald-500' };
}

export function generateId(): string {
    return Math.random().toString(36).substring(2, 15);
}

const AI_RESPONSES: Record<string, string[]> = {
    sad: [
        "I hear you, and it's completely okay to feel this way. Remember, every storm passes eventually. Would you like to talk about what's weighing on you?",
        "I'm here for you. Sadness is a natural emotion, and acknowledging it is a brave step. What's on your mind?",
        "It takes courage to express how you feel. I'm listening — take your time. What would help you feel a little better right now?",
    ],
    anxious: [
        "Let's take a deep breath together. Inhale for 4 counts, hold for 4, exhale for 4. Anxiety doesn't define you — it's just a passing wave.",
        "I understand that feeling of unease. Let's try grounding together: name 5 things you can see right now. This can help bring you back to the present.",
        "Anxiety can feel overwhelming, but you're not alone. Would you like me to guide you through a quick relaxation exercise?",
    ],
    happy: [
        "That's wonderful to hear! 🌟 What's bringing you joy today? I'd love to celebrate this moment with you.",
        "Your positive energy is infectious! Keep nurturing those good feelings. What made today special?",
        "I'm so glad you're feeling good! These moments are precious — would you like to journal about what's going right?",
    ],
    angry: [
        "It's valid to feel angry. Let's channel that energy constructively. Would you like to talk about what triggered this feeling?",
        "Anger is a signal that something matters to you. I'm here to listen without judgment. What happened?",
        "Take a moment to breathe. It's okay to feel this way. When you're ready, I'd like to understand what you're going through.",
    ],
    default: [
        "Thank you for sharing that with me. How does that make you feel? I'm here to listen and support you.",
        "I appreciate you opening up. Would you like to explore those thoughts a bit more together?",
        "That's interesting. Tell me more — I'm here to help you process whatever you're going through.",
        "I'm here for you, always. What would be most helpful for you right now?",
        "Remember, taking time to check in with yourself is an act of self-care. How are you really feeling today?",
    ],
};

export function getAIResponse(message: string): string {
    const lower = message.toLowerCase();
    let category = 'default';

    if (/sad|cry|depress|down|lonely|hopeless|hurt|pain/i.test(lower)) {
        category = 'sad';
    } else if (/anxious|anxiety|worry|nervous|panic|stress|scared|fear/i.test(lower)) {
        category = 'anxious';
    } else if (/happy|great|good|amazing|wonderful|excited|joy|glad/i.test(lower)) {
        category = 'happy';
    } else if (/angry|mad|furious|annoyed|frustrated|irritated|rage/i.test(lower)) {
        category = 'angry';
    }

    const responses = AI_RESPONSES[category];
    return responses[Math.floor(Math.random() * responses.length)];
}

export function detectEmotion(message: string): string {
    const lower = message.toLowerCase();
    if (/sad|cry|depress|down|lonely|hopeless|hurt|pain/i.test(lower)) return '😢 Sad';
    if (/anxious|anxiety|worry|nervous|panic|stress|scared|fear/i.test(lower)) return '😰 Anxious';
    if (/happy|great|good|amazing|wonderful|excited|joy|glad/i.test(lower)) return '😄 Happy';
    if (/angry|mad|furious|annoyed|frustrated|irritated|rage/i.test(lower)) return '😡 Angry';
    if (/calm|peace|relax|serene|content/i.test(lower)) return '😌 Calm';
    return '😐 Neutral';
}

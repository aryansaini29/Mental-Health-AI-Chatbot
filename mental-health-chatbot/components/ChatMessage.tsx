'use client';

import { motion } from 'framer-motion';
import { formatTime } from '@/lib/utils';
import type { ChatMessage as ChatMessageType } from '@/context/ChatContext';
import { HiSparkles } from 'react-icons/hi2';

function renderAssistantContent(content: string) {
    const blocks = content.split(/```/g);

    return blocks.map((block, index) => {
        if (index % 2 === 1) {
            const lines = block.trim().split('\n');
            const language = lines[0] || '';
            const code = lines.slice(1).join('\n').trim();

            return (
                <pre
                    key={`code-${index}`}
                    className="mt-2 overflow-x-auto rounded-2xl bg-slate-950 text-slate-100 p-4 text-xs sm:text-sm leading-relaxed"
                >
                    {language && <div className="mb-3 text-[11px] uppercase tracking-[0.2em] text-slate-400">{language}</div>}
                    <code>{code}</code>
                </pre>
            );
        }

        const paragraphs = block
            .split(/\n{2,}/)
            .map((para) => para.trim())
            .filter(Boolean);

        return paragraphs.map((para, paraIndex) => {
            const bulletLines = para.split('\n').map((line) => line.trim());
            const isBulletList = bulletLines.every((line) => /^([-*]|\d+\.)\s+/.test(line));

            if (isBulletList) {
                return (
                    <ul key={`ul-${index}-${paraIndex}`} className="mt-2 ml-5 list-disc space-y-1">
                        {bulletLines.map((line) => (
                            <li key={line} className="leading-relaxed">
                                {line.replace(/^([-*]|\d+\.)\s+/, '')}
                            </li>
                        ))}
                    </ul>
                );
            }

            const headingMatch = para.match(/^(#{1,3})\s+(.*)$/);
            if (headingMatch) {
                const level = headingMatch[1].length;
                const HeadingTag = (`h${Math.min(level, 3)}` as 'h1' | 'h2' | 'h3');
                return (
                    <HeadingTag key={`h-${index}-${paraIndex}`} className="mt-2 font-semibold">
                        {headingMatch[2]}
                    </HeadingTag>
                );
            }

            const lines = para.split('\n');
            return (
                <p key={`p-${index}-${paraIndex}`} className="mt-2 leading-relaxed whitespace-pre-wrap">
                    {lines.map((line, lineIndex) => (
                        <span key={`${line}-${lineIndex}`}>
                            {line}
                            {lineIndex < lines.length - 1 && <br />}
                        </span>
                    ))}
                </p>
            );
        });
    });
}

interface Props {
    message: ChatMessageType;
}

export default function ChatMessage({ message }: Props) {
    const isAI = message.sender === 'ai';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}
        >
            <div className={`max-w-[80%] sm:max-w-[70%] ${isAI ? 'order-1' : 'order-1'}`}>
                {isAI && (
                    <div className="flex items-center gap-2 mb-1 ml-1">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                            <HiSparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">AI Assistant</span>
                    </div>
                )}
                <div
                    className={`px-4 py-3 rounded-2xl ${isAI
                            ? 'bg-white/80 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-tl-md'
                            : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-tr-md'
                        }`}
                >
                    <div className="text-sm leading-relaxed whitespace-normal">
                        {isAI ? renderAssistantContent(message.content) : <p className="whitespace-pre-wrap">{message.content}</p>}
                    </div>
                </div>
                <div className={`flex items-center gap-2 mt-1 ${isAI ? 'ml-1' : 'mr-1 justify-end'}`}>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">
                        {formatTime(new Date(message.timestamp))}
                    </span>
                    {message.emotion && isAI === false && (
                        <span className="text-[11px] text-gray-400 dark:text-gray-500">{message.emotion}</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

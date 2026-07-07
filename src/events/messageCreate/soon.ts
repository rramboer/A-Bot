import type { Message } from 'discord.js';

// Word-start matching (no trailing \b) so inflected forms still trigger:
// "grades", "finals", "quizzes", "whenever", ... — but not mid-word hits like "contest".
const TRIGGER_WORDS = /\b(?:when|soon)/;
const TOPIC_WORDS = /\b(?:exam|score|grade|test|quiz|midterm|final|assignment|homework|project|lab)/;

export default (message: Message) => {
    if (message.author.bot) return; // Never respond to bots (including ourselves)
    const content = message.content.toLowerCase();
    if (TRIGGER_WORDS.test(content) && TOPIC_WORDS.test(content)) {
        message.reply('Soon:tm:').catch((err: unknown) => {
            console.error('Failed to reply:', err);
        });
        console.log(`The bot said "Soon" to ${message.author.username}.`);
    }
};

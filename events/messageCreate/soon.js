module.exports = (message) => {
    if ((message.content.includes('when') || message.content.includes('soon')) &&
        (message.content.includes('exam') ||
            message.content.includes('score') ||
            message.content.includes('grade') ||
            message.content.includes('test') ||
            message.content.includes('quiz') ||
            message.content.includes('midterm') ||
            message.content.includes('final'))) {
        message.reply('Soon:tm:');
    } else if (message.content.includes('when') && message.content.includes('sex')) {
        message.reply("sorry pal, you're a CS major");
    }
};
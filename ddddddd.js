const now = new Date();
const tzOffset = 3 * 60; // Offset in minutes for Tanzanian time (UTC+3)
const localTime = new Date(now.getTime() + (tzOffset - now.getTimezoneOffset()) * 60000);
const hour = localTime.getHours();

let greeting;
if (hour >= 0 && hour < 12) {
    greeting = "🌄 Good Morning"; // Good morning
} else if (hour >= 12 && hour < 18) {
    greeting = "🏞️ Good Afternoon"; // Good afternoon
} else {
    greeting = "🌃 Good Evening"; // Good evening
}

// Array of image URLs available globally within the function
const imageUrls = [
    'https://i.imgur.com/C6rbiGe.jpeg',
    'https://i.imgur.com/tMic2GW.jpeg',
    'https://i.imgur.com/jrOxU6r.jpeg',
    'https://i.imgur.com/zyoHHMH.jpeg'
];

// Function to replace letters with a custom font style
const replaceWithCustomFont = (sentence) => {
    const customFontMap = {
        a: '𝐚', b: '𝐛', c: '𝐜', d: '𝐝', e: '𝐞', f: '𝐟', g: '𝐠', h: '𝐡', i: '𝐢', j: '𝐣',
        k: '𝐤', l: '𝐥', m: '𝐦', n: '𝐧', o: '𝐨', p: '𝐩', q: '𝐪', r: '𝐫', s: '𝐬', t: '𝐭',
        u: '𝐮', v: '𝐯', w: '𝐰', x: '𝐱', y: '𝐲', z: '𝐳'
    };
    const words = sentence.split(' ');
    const replacedWords = words.map((word) => {
        const letters = word.split('');
        const replacedLetters = letters.map((letter) => {
            const lowercaseLetter = letter.toLowerCase();
            return customFontMap[lowercaseLetter] || letter;
        });
        return replacedLetters.join('');
    });
    return replacedWords.join(' ');
};

module.exports = {
    name: 'help',
    aliases: ['h', 'menu', 'list'],
    category: 'general',
    react: "",
    description: 'Displays the command list or specific command info',
    async execute(client, arg, M) {
        try {
            if (!arg) {
                // Fetch the user's name and trim it for display
                let pushName = M.pushName.trim();
                if (pushName.split(' ').length === 1) {
                    pushName = `${pushName}`;
                }

                // Organize commands by categories (excluding 'dev' category)
                const categories = client.cmd.reduce((obj, cmd) => {
                    if (cmd.category && cmd.category !== 'dev') {
                        const category = cmd.category;
                        obj[category] = obj[category] || [];
                        obj[category].push(cmd.name);
                    }
                    return obj;
                }, {});

                // Generate the command list message
                const commandList = Object.keys(categories);
                let commands = '';
                for (const category of commandList) {
                    commands += `*━━━━━❰ ${client.utils.capitalize(category, true)} ❱━━━━━*\n\`\`\`${categories[category].join(' , ')}\`\`\`\n\n`;
                }

                // Construct the final message
                let message = `╭─「 ${greeting} 」*\n│ ɴᴀᴍᴇ:* 𝐌𝐮𝐳𝐚𝐧-𝐛𝐨𝐭😈\n*│ ᴜsᴇʀ: @${pushName}⁩*\n*│ ᴘʀᴇғɪx:* "${client.prefix}"\n*│ ᴅᴇᴠ:* *𝐉𝐅𝐋𝐄𝐗 𝐎𝐆*\n*╰────────────┈平和*\n\n𝐓𝐡𝐞𝐬𝐞 𝐚𝐫𝐞 𝐭𝐡𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐬 𝐲𝐨𝐮 𝐜𝐚𝐧 𝐮𝐬𝐞~ ツ\n\n${commands}⚠ *Note:*\n\n *➪ Use ${client.prefix}help <command_name> for more info of a specific command*\n *➪ Example: ${client.prefix}help hello*\n*> ©️𝐌𝐮𝐳𝐚𝐧-𝐛𝐨𝐭😈*`;

                // Apply custom font to the message
                message = replaceWithCustomFont(message);

                // Randomly select an image from the list
                const selectedImage = imageUrls[Math.floor(Math.random() * imageUrls.length)];

                // Send the message with the image
                await client.sendMessage(
                    M.from,
                    {
                        image: { url: selectedImage },
                        caption: message
                    },
                    {
                        quoted: M,
                    }
                );

                return;
            }

            // If a specific command is queried
            const command = client.cmd.get(arg) || client.cmd.find((cmd) => cmd.aliases && cmd.aliases.includes(arg));
            if (!command) return M.reply('Command not found');

            // Create a detailed message about the command, checking for null or undefined values
            let detailedMessage = `☠ *Command:* ${command.name}\n🎴 *Aliases:* ${(command.aliases || []).join(', ') || 'None'}\n🔗 *Category:* ${command.category || 'None'}\n⏰ *Cooldown:* ${command.cooldown || 'None'}\n🎗 *Usage:* ${client.prefix}${command.name}\n🧧 *Description:* ${command.description || 'No description available'}`;

            // Apply custom font to the detailed message
            detailedMessage = replaceWithCustomFont(detailedMessage);

            // Randomly select an image from the list
            const selectedImage = imageUrls[Math.floor(Math.random() * imageUrls.length)];

            // Send the detailed message with the image
            await client.sendMessage(
                M.from,
                {
                    image: { url: selectedImage },
                    caption: detailedMessage
                },
                {
                    quoted: M,
                }
            );
        } catch (err) {
            // Error handling
            await client.sendMessage(M.from, { text: `${greeting} Error Jflex\n\n${greeting} Error:\n${err}` });
        }
    }
};

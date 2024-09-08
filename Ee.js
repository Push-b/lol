const axios = require('axios');
const {
    proto,
    generateWAMessage,
    areJidsSameUser,
    generateWAMessageFromContent,
    prepareWAMessageMedia
} = require('@WhiskeySockets/baileys');

module.exports = {
    name: 'info',
    aliases: ['information'],
    category: 'general',
    exp: 1,
    cool: 4,
    react: "✅",
    usage: 'Use :info',
    description: 'Get bot information',
    async execute(client, arg, M) {
        const getGroups = await client.groupFetchAllParticipating();
        const groups = Object.entries(getGroups).map((entry) => entry[1]);
        const groupCount = groups.length;

        const pad = (s) => (s < 10 ? '0' : '') + s;
        const formatTime = (seconds) => {
            const hours = Math.floor(seconds / (60 * 60));
            const minutes = Math.floor((seconds % (60 * 60)) / 60);
            const secs = Math.floor(seconds % 60);
            return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
        };
        const uptime = formatTime(process.uptime());
        const modCount = client.mods.length;
        const memoryUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const cpuUsage = process.cpuUsage().system / 1000000;

        let text = `⛩️❯─「𝐌𝐔𝐙𝐀𝐍」─❮⛩️\n\n`;
        text += `🚀 *Commands:* ${client.cmd.size}\n`;
        text += `⏳ *Uptime:* ${uptime}\n`;
        text += `👥 *Users:* ${Object.values(await client.contactDB.all()).length}\n`;
        text += `🔧 *Mods:* ${modCount}\n`;
        text += `🌐 *Groups:* ${groupCount}\n`;
        text += `💽 *Memory Used:* ${memoryUsed} MB\n`;
        text += `📊 *CPU Usage:* ${cpuUsage.toFixed(2)}%\n`;
        text += `🤖 *Bot Version:* 2.0\n`;
        text += `👤 *Bot Owner:* 𝐉𝐅𝐋𝐄𝐗 𝐎𝐆\n`;

        const imageMessage = await prepareWAMessageMedia({ image: { url: "https://telegra.ph/file/a5506865e038f5f5802f7.jpg" }}, { upload: client.waUploadToServer });

        let msg = generateWAMessageFromContent(M.from, {
            viewOnceMessage: {
                message: {
                    "messageContextInfo": {
                        "deviceListMetadata": {},
                        "deviceListMetadataVersion": 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: `${text}`
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: "𝐌𝐔𝐙𝐀𝐍 ©2024"
                        }),
                        header: proto.Message.InteractiveMessage.Header.create({
                            ...imageMessage,
                            title: "",
                            subtitle: "",
                            hasMediaAttachment: false
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            buttons: [
                                {
                                    "name": "cta_url",
                                    "buttonParamsJson": "{\"display_text\":\"BOTS\",\"url\":\"!bots\",\"merchant_url\":\"!bots\"}"
                                }
                            ],
                        })
                    })
                }
            }
        }, {});

        await client.relayMessage(M.from, msg.message, {
            messageId: msg.key.id
        });
    }
};

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the bot\'s latency.'),
    async execute(interaction) {
        const sentMessage = await interaction.reply({ content: '<a:Loading:1354121208903237722> Loading...', fetchReply: true });

        const roundTripLatency = sentMessage.createdTimestamp - interaction.createdTimestamp;
        const discordLatency = Math.round(interaction.client.ws.ping);

        const embed = new EmbedBuilder()
            .setColor('38d9a9')
            .setTitle('<:Online:1354121530283393140> Pong!')
            .setDescription(`**Discord Latency:** \`${discordLatency}ms\`
**Bot Latency:** \`${roundTripLatency}ms\``)
            .setFooter({ text: 'Powered by Shayaan', iconURL: interaction.client.user.displayAvatarURL() });

        await sentMessage.edit({ content: '', embeds: [embed] });
    },
};
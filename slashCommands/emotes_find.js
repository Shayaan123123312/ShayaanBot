const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emotes')
        .setDescription('Find details of an emoji')
        .addSubcommand(subcommand =>
            subcommand
                .setName('find')
                .setDescription('Find an emoji')
                .addStringOption(option =>
                    option.setName('emoji')
                        .setDescription('Enter emoji or emoji ID')
                        .setRequired(true))
        ),
    async execute(interaction) {
        const emojiInput = interaction.options.getString('emoji');
        const emojiId = emojiInput.match(/\d+/)?.[0]; 

        if (!emojiId) {
            return interaction.reply({ content: 'Invalid emoji or ID provided.', ephemeral: true });
        }

        const emoji = interaction.client.emojis.cache.get(emojiId);
        const isAnimated = emoji ? emoji.animated : emojiInput.startsWith('<a:');
        const isManaged = emoji ? emoji.managed : false;

        const emojiURL = isAnimated
            ? `https://cdn.discordapp.com/emojis/${emojiId}.gif?size=56&animated=true`
            : `https://cdn.discordapp.com/emojis/${emojiId}.png?size=56`;

        const createdAt = Math.floor(Date.now() / 1000);

        const embed = new EmbedBuilder()
            .setColor(0x38d9a9) 
            .setAuthor({ 
                name: interaction.user.tag, 
                iconURL: interaction.user.displayAvatarURL() 
            })
            .setTitle('Emoji Information')
            .addFields(
                { name: 'Emoji ID', value: emojiId, inline: true },
                { name: 'Animated', value: isAnimated ? 'True' : 'False', inline: true },
                { name: 'Managed', value: isManaged ? 'True' : 'False', inline: true },
                { name: 'Created On', value: `<t:${createdAt}:F>`, inline: false }
            )
            .setThumbnail(emojiURL)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};

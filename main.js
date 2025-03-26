const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
const config = require('./config.json');
const CColor = require('ccolor');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

const getCurrentDate = () => {
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
};

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'slashCommands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const commands = [];
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
        console.log(`${CColor.green(`[${getCurrentDate()}]`)} Slash command "${command.data.name}" loaded successfully.`);
    }
}

const rest = new REST({ version: '10' }).setToken(config.token);
(async () => {
    try {
        console.log(`${CColor.green(`[${getCurrentDate()}]`)} Refreshing global slash commands...`);
        await rest.put(Routes.applicationCommands(config.clientId), { body: commands });
        console.log(`${CColor.green(`[${getCurrentDate()}]`)} Slash commands registered successfully.`);
    } catch (error) {
        console.log(`${CColor.red(`[${getCurrentDate()}]`)} Failed to register slash commands: ${error}`);
    }
})();

client.once('ready', () => {
    console.log(`${CColor.green(`[${getCurrentDate()}]`)} Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        activities: [{ name: '', type: 0 }],
        status: 'online',
    });
    console.log(`${CColor.green(`[${getCurrentDate()}]`)} Custom status set successfully!`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.log(`${CColor.red(`[${getCurrentDate()}]`)} Error executing command "${interaction.commandName}": ${error}`);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
        });
    }
});

client.login(config.token);

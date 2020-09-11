require('dotenv').config();
const { Client } = require('discord.js');
const client = new Client();
let connection;
const { registerCommands, registerEvents } = require('./utils/register');
const guildCommandPrefixes = new Map();

client.once('ready', () => {
    console.log(`${client.user.tag} has logged in.`);
    client.guilds.cache.forEach(guild => {
        connection.query(
            `SELECT cmdPrefix FROM Guilds WHERE guildId = '${guild.id}'`
        ).then(result => {
            guildCommandPrefixes.set(guild.id, result[0][0].cmdPrefix);
        }).catch(err => console.log(err));
    });
});

client.on('guildCreate', async (guild) => {
    try{
        await connection.query(
            `INSERT INTO Guilds (guildId, guildIdOwner) VALUES('${guild.id}', '${guild.ownerID}')`
        );
    } catch(err) {
        console.log(err)
    }
});

client.on('message', async (message) => {
    if(message.author.bot) return;
    const prefix = guildCommandPrefixes.get(message.guild.id);
    if(message.content.toLowerCase().startsWith(prefix + 'help')) {
        message.channel.send(`You triggered the help command with the prefix ${prefix}`)
    } else if (message.content.toLowerCase().startsWith(prefix + 'changeprefix')) {
        if(message.member.id === message.guild.ownerID) {
            const [ cmdName, newPrefix ] = message.content.split(" ");
            if(newPrefix) {
                try {
                    await connection.query(
                        `UPDATE Guilds SET cmdPrefix = '${newPrefix}' WHERE guildId = '${message.guild.id}'`
                    );
                    guildCommandPrefixes.set(message.guild.id, newPrefix);
                    message.channel.send(`Updated guild prefix to ${newPrefix}`);
                }catch (err) {
                    console.log(err);
                    message.channel.send(`Failed to change prefix`);
                };
            }else {
                message.channel.send('Incorrect amount of arguments');
            }
        }else {
            message.channel.send('Only the owner can change the prefix!');
        }
    }
});

(async () => {
    connection = await require('../database/db');
    await client.login(process.env.BOT_TOKEN);
    client.commands = new Map();
    await registerCommands(client, '../commands');
    await registerEvents(client, '../events');
})();
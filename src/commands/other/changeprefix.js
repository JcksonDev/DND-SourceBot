const BaseCommand = require('../../utils/structures/BaseCommand');
const StateManager = require('../../utils/StateManager');

module.exports = class ChangePrefixCommand extends BaseCommand {
    constructor() {
        super('changeprefix', 'owner', []);
    }

    async run(client, message, args) {
        if (message.member.id === message.guild.ownerID) {
            const [cmdName, newPrefix] = message.content.split(" ");
            if (newPrefix) {
                try {
                    await StateManager.connection.query(
                        `UPDATE Guilds SET cmdPrefix = '${newPrefix}' WHERE guildId = '${message.guild.id}'`
                    );
                    message.channel.send(`Updated guild prefix to ${newPrefix}`);
                    StateManager.emit('prefixUpdate', message.guild.id, newPrefix);
                } catch (err) {
                    console.log(err);
                    message.channel.send(`Failed to change prefix`);
                }
            } else {
                message.channel.send('Incorrect amount of arguments');
            }
        } else {
            message.channel.send('Only the owner can change the prefix!');
        }
    }
}
const BaseEvent = require('../../utils/structures/BaseEvent');
const StateManager = require('../../utils/StateManager');

module.exports = class GuildCreateEvent extends BaseEvent {
    constructor() {
        super('guildCreate');
    }

    async run(client, guild) {
        try{
            await StateManager.connection.query(
                `INSERT INTO Guilds (guildId, guildIdOwner) VALUES('${guild.id}', '${guild.ownerID}')`
            );
            console.log('Added guild to database');
        } catch(err) {
            console.log(err)
        }
    }
}
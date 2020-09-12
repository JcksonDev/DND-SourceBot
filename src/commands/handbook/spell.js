const BaseCommmand = require('../../utils/structures/BaseCommand');
const StateManager = require('../../utils/StateManager');
const Discord = require('discord.js');

module.exports = class SpellCommand extends BaseCommmand {
    constructor() {
        super('spell', 'lookup', []);
    }

    async run(client, message, args) {
        let name, level, castingTime, range, components, duration, school, description, additionalLevels, classes
        const spell = new Discord.MessageEmbed();
        const [cmdName, spellName] = message.content.split(" ");
        if (spellName) {
            try {
                await StateManager.connection.query(
                    `SELECT * FROM Spells WHERE spellName LIKE '%${spellName}%';`, (err, result, fields) => {
                        if (err) throw err;
                        name = result[0].spellName;
                        level = result[0].spellLevel;
                        castingTime = result[0].castingTime;
                        range = result[0].spellRange;
                        components = result[0].components;
                        duration = result[0].duration;
                        school = result[0].school;
                        description = result[0].spellDescription;
                        additionalLevels = result[0].additionalLevels;
                        classes = result[0].class;

                        spell.setTitle(name)
                        name = name.toLowerCase().replace(/'/g, '').replace(/ /g, '-');
                        spell.setURL(`https://www.dndbeyond.com/spells/${name}`);

                        if (level.length > 1) spell.setDescription(`*${school} ${level} (${classes})*`)
                        else spell.setDescription(`Level ${level} ${school} (${classes})`)

                        spell.addFields(
                            { name: 'Casting Time:', value: castingTime },
                            { name: 'Range:', value: range },
                            { name: 'Components:', value: components },
                            { name: 'Duration: ', value: duration },
                            { name: 'Description:', value: description }
                        );

                        if (additionalLevels) spell.addField('At Additional Levels:', additionalLevels);

                        spell.setTimestamp().setAuthor(message.author.username, message.author.displayAvatarURL());
                        spell.setColor('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6));

                        message.channel.send(spell);
                    }
                );
            } catch (err) {
                console.log(err);
            }
        } else {
            message.channel.send('Please specify a spell you want to look up');
        }
    }
}
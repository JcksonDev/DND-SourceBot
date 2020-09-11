const BaseCommmand = require('../../utils/structures/BaseCommand');

module.exports = class SpellCommand extends BaseCommmand {
    constructor() {
        super('spell', 'lookup', []);
    }

    run() {
        console.log(this.name + 'was invoked');
    }
}
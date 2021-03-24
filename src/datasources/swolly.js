const { DataSource } = require("apollo-datasource")
const { Swolly } = require("swolly-js")


module.exports = class SwollyAPI extends DataSource {
    constructor(swolly) {
        super();

        this.swolly = swolly;
    }

    initialize(config) {
        this.context = config.context;
    }

}


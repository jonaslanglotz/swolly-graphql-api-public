const { Model } = require("swolly-js")

module.exports = {
    definition: "supporterCount: Int",
    schema: ``,
    resolver: async (parent, __, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly
        
        try {
            return await swolly.store.Application.count({
                where: {
                    taskId: parent.id,
                    accepted: true
                }
            })
        } catch (err) {
            console.log(err)
            return null
        }
    },
}




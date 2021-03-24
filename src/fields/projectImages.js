const { Model } = require("swolly-js")

module.exports = {
    definition: "images: [Image]",
    schema: ``,
    resolver: async (parent, __, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly
        
        try {
            const images = await swolly.Image.getAll(context.token, {
                filter: {
                    projectId: parent.id
                }
            })
            if(images == null) { return [] }
            return await Model.getDataFromObject(images)
        } catch (err) {
            console.log(err)
            return []
        }
    },
}


module.exports = {
    definition: "file: String!",
    schema: ``,
    resolver: async (parent, __, { dataSources }) =>  {
        if (parent.id && parent.extension) {
            return parent.id + "." + parent.extension
        }

        
        const { swolly, context } = dataSources.swolly
        try {
            const image = await swolly.Image.get(context.token, parent.id)
            if (image == null) { return null }

            const file = image.getId() + "." + image.getExtension()
            return file
        } catch (err) {
            return null
        }
    },
}



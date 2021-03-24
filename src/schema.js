const { gql } = require("apollo-server-express");
const { Enums } = require("swolly-js")

const queries = [
    // APPLICATION
    require("./queries/application"),
    require("./queries/applications"),

    // CATEGORY
    require("./queries/category"),
    require("./queries/categories"),
     
    // PROJECT
    require("./queries/project"),
    require("./queries/projects"),

    // TASK
    require("./queries/task"),
    require("./queries/tasks"),

    // USER
    require("./queries/user"),
    require("./queries/users"),
]
const mutations = [
    // APPLICATION
    require("./mutations/applicationCreate"),
    require("./mutations/applicationDelete"),
    require("./mutations/applicationUpdate"),

    // CATEGORY
    require("./mutations/categoryCreate"),
    require("./mutations/categoryDelete"),
    require("./mutations/categoryUpdate"),

    // IMAGE
    require("./mutations/imageUpload"),

    // PROJECT
    require("./mutations/projectCreate"),
    require("./mutations/projectDelete"),
    require("./mutations/projectUpdate"),

    // TASK
    require("./mutations/taskCreate"),
    require("./mutations/taskDelete"),
    require("./mutations/taskUpdate"),

    // USER
    require("./mutations/userLogin"),
    require("./mutations/userLogout"),
    require("./mutations/userRegister"),
    require("./mutations/userUpdate"),
    require("./mutations/userDelete"),
]

const typeDefs = `

    #######################
    ## Query
    #######################
    
    type Query {
        ${queries.map(query => query.definition + "\n")}
    }

    ${queries.map(query => query.schema + "\n")}

    #######################
    ## Mutation
    #######################

    type Mutation {
        ${mutations.map(mutation => mutation.definition + "\n")}
    }

    ${mutations.map(mutation => mutation.schema + "\n")}

    #######################
    ## Types
    #######################

    type Project {
        id: ID!
        title: String!
        description: String!
        status: ProjectStatus!
        moneyGoal: Float!
        moneyPledged: Float!
        lat: Float!
        lon: Float!
        createdAt: String
        updatedAt: String
        ${require("./fields/projectCategory").definition}
        ${require("./fields/projectCreator").definition}
        ${require("./fields/projectImages").definition}
        ${require("./fields/projectTasks").definition}
    }

    enum ProjectStatus {
        ${Object.values(Enums.ProjectStatus).map(status => status + "\n")}
    }

    type Category {
        id: ID!
        name: String!
        ${require("./fields/categoryImage").definition}
    }

    type User {
        id: ID!
        fullname: String!
        mail: String
        gender: Gender
        role: Role
        ${require("./fields/userProjects").definition}
    }

    enum Gender {
        ${Object.keys(Enums.UserGender).map(gender => gender + "\n")}
    }

    enum Role {
        ${Object.keys(Enums.UserRole).map(role => role + "\n")}
    }
    
    type Image {
        id: ID!
        extension: String!
        ${require("./fields/imageFile").definition}
    }

    type Session {
        id: ID!
        token: String!
    }

    type Task {
        id: ID!
        title: String!
        description: String!
        supporterGoal: Int!
        ${require("./fields/taskApplications").definition}
        ${require("./fields/taskSupporterCount").definition}
        ${require("./fields/taskProject").definition}
    }
    
    type Application {
        id: ID!
        text: String
        accepted: Boolean!
        ${require("./fields/applicationUser").definition}
        ${require("./fields/applicationTask").definition}
    }

    enum SortDirection {
        ${Object.keys(Enums.SortDirection).map(direction => direction + "\n")}
    }
`;

module.exports = gql(typeDefs);


//require elasticsearch
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });


class TemplateController {

    async createTemplateTodos(req, res) {
        try {
            const todosTemplateConfig = {
                template: 'todos*',
                settings: {
                    number_of_shards: 5,
                },
                mappings: {
                    tasks: {
                        _source: {
                            enabled: true,
                        },
                        properties: {
                            userId: { type: 'keyword' },
                            category: { type: 'text' },
                            id: { type: 'long' },
                            title: { type: 'text' },
                            description: { type: 'text' },
                            status: { type: 'text' },
                            authorizedBy: {
                                properties: {
                                    firstName: { type: 'text' },
                                    lastName: { type: 'text' },
                                },
                            },
                            dueDate: { type: 'date' },
                            createAt: { type: 'date' },
                            updateAt: { type: 'date' },
                        },
                    },
                },
            };

            const response = await client.indices.putTemplate({
                name: "todos_template",
                body: todosTemplateConfig
            })
            res.status(201).json({ message: "Todos'template created successfully" });
        } catch (error) {
            res.status(400).json({ message: "Create todos' template failed" })
        }
    }

    async createTemplateUsers(req, res) {
        try {
            const usersTemplateConfig = {
                template: 'users*',
                settings: {
                    number_of_shards: 5,
                },
                mappings: {
                    tasks: {
                        _source: {
                            enabled: true,
                        },
                        properties: {
                            username: { type: 'keyword' },
                            password: { type: 'text' },
                            email: { type: 'keyword' },
                            firstName: { type: 'text' },
                            lastName: { type: 'text' },
                            phone: { type: 'text' }
                        },
                    },
                },
            };

            const response = await client.indices.putTemplate({
                name: "users_template",
                body: usersTemplateConfig
            })
            res.status(201).json({ message: "Users'template created successfully" });
        } catch (error) {
            res.status(400).json({ message: "Create users' template failed" })
        }
    }

    async getTemplate(req, res) {
        const { name } = req.params
        try {
            const response = await client.indices.getTemplate({ name })
            res.status(200).json(response.body)
        } catch (error) {
            if (error.statusCode == 404) {
                return res.status(404).json({ message: "Template not found!" });
            } else {
                return res.status(400).json({ message: "Failed to get template.", error });
            }
        }

    }

    async deleteTemplate(req, res) {
        const { name } = req.params
        try {
            const response = await client.indices.deleteTemplate({ name })
            res.status(200).json(response.body)
        } catch (error) {
            if (error.statusCode == 404) {
                return res.status(404).json({ message: "Template not found!" });
            } else {
                return res.status(400).json({ message: "Failed to delete template.", error });
            }
        }

    }

}

module.exports = new TemplateController
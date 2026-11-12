import { writeFileSync } from 'node:fs';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Books API',
            version: '1.0.0',
            description: 'A simple API for working with books'
        },
        servers: [
            {
                url: '/',
                description: 'Current server'
            }
        ],
        components: {
            schemas: {
                ErrorResponse: {
                    type: 'object',
                    required: ['message'],
                    properties: {
                        message: {
                            type: 'string',
                            example: 'Internal server error'
                        }
                    }
                },
                Book: {
                    type: 'object',
                    required: ['id', 'authorId', 'title', 'publicationDate'],
                    properties: {
                        id: { type: 'string', example: 'b1' },
                        authorId: { type: 'string', example: 'a1' },
                        title: { type: 'string', example: 'Pride and Prejudice' },
                        publicationDate: { type: 'string', format: 'date', example: '1813-01-28' }
                    }
                },
                BookInput: {
                    type: 'object',
                    required: ['id', 'authorId', 'title', 'publicationDate'],
                    additionalProperties: false,
                    properties: {
                        id: { type: 'string', minLength: 1, maxLength: 50, example: 'b4' },
                        authorId: { type: 'string', minLength: 1, maxLength: 50, example: 'a1' },
                        title: { type: 'string', minLength: 1, maxLength: 300, example: 'Example Book Title' },
                        publicationDate: { type: 'string', format: 'date', example: '2026-01-15' }
                    }
                },
                BookUpdate: {
                    type: 'object',
                    required: ['authorId', 'title', 'publicationDate'],
                    additionalProperties: false,
                    properties: {
                        authorId: { type: 'string', minLength: 1, maxLength: 50, example: 'a2' },
                        title: { type: 'string', minLength: 1, maxLength: 300, example: 'Updated Book Title' },
                        publicationDate: { type: 'string', format: 'date', example: '2026-02-20' }
                    }
                },
                Author: {
                    type: 'object',
                    required: ['id', 'name', 'birthYear'],
                    properties: {
                        id: { type: 'string', example: 'a1' },
                        name: { type: 'string', example: 'Jane Austen' },
                        birthYear: { type: 'integer', example: 1775 }
                    }
                },
                AuthorInput: {
                    type: 'object',
                    required: ['id', 'name', 'birthYear'],
                    additionalProperties: false,
                    properties: {
                        id: { type: 'string', minLength: 1, maxLength: 50, example: 'a4' },
                        name: { type: 'string', minLength: 1, maxLength: 200, example: 'Example Author' },
                        birthYear: { type: 'integer', minimum: 0, example: 1980 }
                    }
                },
                AuthorUpdate: {
                    type: 'object',
                    required: ['name', 'birthYear'],
                    additionalProperties: false,
                    properties: {
                        name: { type: 'string', minLength: 1, maxLength: 200, example: 'Updated Author' },
                        birthYear: { type: 'integer', minimum: 0, example: 1981 }
                    }
                }
            },
            responses: {
                InternalServerError: {
                    description: 'Unexpected server or database error',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            example: { message: 'Internal server error' }
                        }
                    }
                },
                InvalidAuthorData: {
                    description: 'Invalid author data',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            example: { message: 'Invalid author data' }
                        }
                    }
                },
                InvalidBookData: {
                    description: 'Invalid book data or unknown author ID',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            example: { message: 'Invalid book data' }
                        }
                    }
                },
                UnsupportedMediaType: {
                    description: 'Request must use application/json',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            example: { message: 'Content-Type must be application/json' }
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/router.js', './app.js']
};

const swaggerSpec = swaggerJsdoc(options);

writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2));
console.log('Swagger documentation generated.');
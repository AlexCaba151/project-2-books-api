const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Books API',
    description: 'API for managing books and authors'
  },
  host: 'localhost:3000',
  schemes: ['http'],
  basePath: '/',
  tags: [
    {
      name: 'Authors',
      description: 'Authors endpoints'
    },
    {
      name: 'Books',
      description: 'Books endpoints'
    }
  ]
};

const outputFile = './swagger.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);

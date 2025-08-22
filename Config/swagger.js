import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Warehouse Stockout API',
      version: '2.0.0',
      description: 'API untuk sistem manajemen stockout warehouse',
      contact: {
        name: 'BRAV-PED',
        email: 'support@brav-ped.com'
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server'
        },
        {
          url: 'http://10.122.80.8:8700/wh-stockout',
          description: 'Production server'
        }
      ]
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './Routes/*.js',
    './Controller/*.js'
  ]
};

export const specs = swaggerJsdoc(options);

import fastify from 'fastify';
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from 'fastify-type-provider-zod';
import { createEvents } from './routes/create-events';
import { registerForEvent } from './routes/register-for-event';
import { getAttendeeBadge } from './routes/get-attendee-badge';
import { checkIn } from './routes/check-in';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { getEvent } from './routes/get-event';
import { getEventAttenees } from './routes/get-event-attendees';
import { getHealthCheck } from './routes/healthcheck';
import { errorHandler } from './error-handler';
import fastifyCors from '@fastify/cors';

const app = fastify();

app.register(fastifySwagger, {
    swagger:{
        consumes: ['application/json'],
        produces: ['application/json'],
        info: {
            title: 'pass.in',
            // description: 'Especificações da API para o back-end da aplicação pass.in construída durante o NLW Unite da Rocketseat.',
            version: '0.0.1'
        }
    },
    transform: jsonSchemaTransform
});

app.register(fastifyCors, {
  origin: '*'
});

app.register(fastifySwaggerUi, { prefix:'/api/swagger'});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(getEvent, { prefix: '/api' });
app.register(createEvents, { prefix: '/api'});
app.register(registerForEvent, { prefix: '/api'});
app.register(getAttendeeBadge, { prefix: '/api'});
app.register(checkIn, { prefix: '/api'});
app.register(getEventAttenees, { prefix: '/api'});
app.register(getHealthCheck,{ prefix: '/api' });
app.setErrorHandler(errorHandler);

try {
    app.listen({ port: 3333, host: '0.0.0.0' }, (err, address) => {
        if (err) throw err;
        console.log(`HTTP SERVER running! at ${address}`);
    });    
} catch (err) {
    app.log.error(err);
    process.exit(1);
}
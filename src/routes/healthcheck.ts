import { FastifyReply, FastifyInstance } from 'fastify';
import { ZodTypeProvider} from 'fastify-type-provider-zod';
import { z } from 'zod';

export async function getHealthCheck(app: FastifyInstance){

    app.withTypeProvider<ZodTypeProvider>().get('/healthcheck', {
        schema: {
            response: {
                200: z.object({
                    message: z.string()
                })
            }
        },
    },(_, reply: FastifyReply) =>{
        
        return reply.status(200).send({
            message: 'OK'
        });

    });

};
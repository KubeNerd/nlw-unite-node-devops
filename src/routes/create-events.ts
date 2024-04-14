import { prismaClient } from '../lib/prisma';
import { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { generateSlug } from '../utils/generate-slug';
import { BadRequest } from './_errors/bad-request';

interface ICreateEvent {
    title?: string;
    details?: string, 
    maximumAttendees?: number; 
}


export async function createEvents(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>()
        .post('/events', 
            {
                schema:{
                    body: z.object({
                        title: z.string({ invalid_type_error: 'O titulo precisa ser uma string'}).min(4),
                        details: z.string().nullable(),
                        maximumAttendees: z.number().int().positive().nullable(),
                    }),
                    response: {
                        201: z.object({
                            eventId: z.string().uuid(),
                        })
                    },
                    summary: '',
                    tags: ['Events']
                }
            },
            async(request: FastifyRequest, reply: FastifyReply) =>{

                const { 
                    title, 
                    details, 
                    maximumAttendees
    
                }: ICreateEvent = request.body;
    
                const slug = generateSlug(title);

                const eventwithSameSlug = await prismaClient.event.findUnique({
                    where:{
                        slug,
                    }
                });

                if(eventwithSameSlug !== null){
                    throw new BadRequest('Another event with same title alredy exists.');
                }

                const event = await prismaClient.event.create({
                    data:{
                        title,
                        details,
                        maximumAttendees,
                        slug,
                    }
                });

                return reply.status(201).send({ eventId: event.id});

            });
}
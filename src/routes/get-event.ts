import { prismaClient } from '../lib/prisma';
import { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { BadRequest } from './_errors/bad-request';

interface IEvent {
    eventId?: string;
}

export async function getEvent(app: FastifyInstance){
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/events/:eventId', 
            {
                schema:{
                    params: z.object({
                        eventId: z.string().uuid(),
                    }),
                    // response: {
                    //     200: {
                    //         id: z.string().uuid(),
                    //         title: z.string(),
                    //         slug: z.string(),
                    //         details: z.string(),
                    //         maximumAttendees: z.number().int().nullable(),
                    //         attendeesAmount: z.number().int()
                    //     }
                    // },
                    summary: '',
                    tags: ['Events']
                },
            
            },
            async (request: FastifyRequest, reply: FastifyReply) =>{
                const { eventId }: IEvent = request.params;

                const event = await prismaClient.event.findFirst({
                    where: {
                        id: eventId,
                    },
                    select:{
                        title: true,
                        slug: true,
                        details: true,
                        id: true,
                        maximumAttendees: true,
                        _count: {
                            select: {
                                attendees: true
                            }
                        }
                    },

                });

                if(event !== null){
                    throw new BadRequest('This event is not found.');
                }


                return reply.send({
                    event:{
                        id: event.id,
                        title: event.title,
                        slug: event.slug,
                        details: event.details,
                        maximumAttendees: event.maximumAttendees,
                        attendeesAmount: event._count.attendees
                    }
                });
            });
}
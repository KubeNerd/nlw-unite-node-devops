import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { prismaClient } from '../lib/prisma';
import { z } from 'zod';

interface IEventAttendees {
    eventId?: string;
    pageIndex?: number;
    query?: string;
}

export async function getEventAttenees(app: FastifyInstance){
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/events/:eventId/attendees',
            {
                schema:{
                    params: z.object({
                        eventId: z.string().uuid(),
                    }),
                    querystring: z.object({
                        pageIndex: z.string().nullable().default('0')
                            .transform(Number)
                    }),
                    response: {
                        200: z.object({
                            id: z.number(),
                            name: z.string(),
                            email: z.string().email(),
                            createAt: z.date(),
                            checkedInAt: z.date().nullable(),
                        })
                    },
                    summary: '',
                    tags: ['Events']
                },
            },
            async(request: FastifyRequest, reply:FastifyReply) =>{
  
                const { eventId }: IEventAttendees = request.params;
                const { pageIndex, query }: IEventAttendees = request.query;
                const attendees = await prismaClient.attendee.findMany({
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        createdAt: true,
                        checkIn: {
                            select: {
                                createdAt: true,
                            }
                        }
                    },
                    where: query ? {
                        eventId,
                        name: {
                            contains: query,
                        }
                    } : {
                        eventId,
                    },
                    take: 10,
                    skip: pageIndex * 10,
                    orderBy: {
                        createdAt: 'desc'
                    }
                });


                return reply.send({ 
                    attendees: attendees.map(attendee =>{
                        return {
                            id: attendee.id,
                            name: attendee.name,
                            email: attendee.email,
                            createdAt: attendee.createdAt,
                            checkedInAt: attendee.checkIn.createdAt ?? null,
                        };
                    })
                });
        
            });
}
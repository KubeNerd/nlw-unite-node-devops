import { prismaClient } from '../lib/prisma';
import { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { BadRequest } from './_errors/bad-request';


interface IRegisterEvent { eventId?: string }
interface IAttendees {name?: string, email?: string}

export async function registerForEvent(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/events/:eventId/attendees',
            {
                schema:{
                    body: z.object({
                        name: z.string().min(4),
                        email: z.string().email(),
                    }),
                    params: z.object({
                        eventId: z.string().uuid(),
                    }),
                    response: {
                        201: z.object({
                            attendeeId: z.number(),
                        })
                    }, 
                    summary: '',
                    tags: ['Events']
                },
            
            },
            async(
                request: FastifyRequest, 
                reply: FastifyReply
            ) =>{

                const { name, email }: IAttendees = request.body;
                const { eventId }:  IRegisterEvent = request.params;
            
        

                const attendeeFromEmail = await prismaClient.attendee.findUnique({
                    where:{
                        eventId_email:{
                            email,
                            eventId
                        }
                    }
                });

                if(attendeeFromEmail !== null){
                    throw new BadRequest('This email is alredy registred for this event.');
                }


                const [event, amountOfAttendeeForEvent] = await Promise.all([
                    prismaClient.event.findUnique({
                        where: {
                            id: eventId
                        }
                    }),
                    prismaClient.attendee.count({
                        where: {
                            eventId
                        }
                    })
                ]);

                if(event?.maximumAttendees && amountOfAttendeeForEvent >= event.maximumAttendees ){
                    throw new Error('The participant limit for this event has been reached.');
                }

        
                const attendee = await prismaClient.attendee.create({
                    data: {
                        name,
                        email,
                        eventId
                    }
                });
        
                return reply.status(201).send({ attendeeId: attendee.id });
    
            });
}
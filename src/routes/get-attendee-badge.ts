import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { prismaClient } from '../lib/prisma';
import { z } from 'zod';
import { BadRequest } from './_errors/bad-request';

interface IAttendee {
    attendeeId?: number;
}

export async function getAttendeeBadge(app: FastifyInstance){
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/attendees/:attendeeId/badge', {
            schema: {
                params: z.object({
                    attendeeId: z.coerce.number()
                }),
                response:{},
                summary: '',
                tags: ['Attendees']
            }
        }, async(request: FastifyRequest , reply: FastifyReply) =>{

            const { attendeeId }: IAttendee = request.params;
            const attendee = await prismaClient.attendee.findUnique({
                where: {
                    id: attendeeId,
                },
                select:{
                    name: true,
                    email: true,
                    event: {
                        select: {
                            title: true
                        } 
                    }
                }
            });
            if(attendee === null){
                throw new BadRequest('Attendee is not found.');
            }

            const baseURL = `${request.protocol}://${request.hostname}`;
            const checkInURL = new URL(`/attendees/${attendeeId}/check-in`, baseURL);
        
            return reply.status(200).send({
                badge:{
                    name: attendee.name,
                    email: attendee.email,
                    eventTitle: attendee.event.title,
                    checkInURL: checkInURL.toString(),
                }
            });
        });

}
import { prismaClient } from '../lib/prisma';
import { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { BadRequest } from './_errors/bad-request';

interface IAttendee {
    attendeeId?: number;
}
export async function checkIn(app: FastifyInstance){
    app
        .withTypeProvider<ZodTypeProvider>()
    
        .get('/attendees/:attendeeId/check-in', {
            schema:{
                params: z.object({
                    attendeeId: z.coerce.number().int(),
                }),
                response:{
                    201: z.null()
                },
                summary: 'Check-in',
                tags: ['Check-in']
            },
        }, async(request: FastifyRequest, reply: FastifyReply) => {
            const { attendeeId }: IAttendee = request.params;
            if (!Number.isInteger(attendeeId)) {
                throw new Error('Inválid attendee id');
            }

            const attedeeChecking = await prismaClient.checkIn.findUnique({
                where: {
                    attendeeId,
                }
            });


            if(attedeeChecking !== null){
                throw new BadRequest('Attendee alredy check-in!');
            }


            await prismaClient.checkIn.create({
                data: {
                    attendeeId
                }
            });


            return reply.status(201).send();  

        });
}
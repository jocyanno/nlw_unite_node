import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function getEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events/:eventId",
    {
      schema: {
        summary: "Get an event",
        tags: ["events"],
        params: z.object({
          eventId: z.string().uuid()
        }),
        response: {
          200: z.object({
            event: z.object({
              id: z.string().uuid(),
              title: z.string(),
              details: z.string().nullable(),
              maximumAttendees: z.number().int().nullable(),
              slug: z.string(),
              attendeesAmount: z.number().int()
            })
          })
        }
      }
    },
    async (request, reply) => {
      const { eventId } = request.params;

      const event = await prisma.event.findUnique({
        where: {
          id: eventId
        },
        select: {
          id: true,
          title: true,
          details: true,
          maximumAttendees: true,
          slug: true,
          _count: {
            select: {
              attendees: true
            }
          }
        }
      });

      if (event === null) {
        throw new BadRequest("Event not found");
      }

      return reply.send({
        event: {
          id: event.id,
          title: event.title,
          details: event.details,
          maximumAttendees: event.maximumAttendees,
          slug: event.slug,
          attendeesAmount: event._count.attendees
        }
      });
    }
  );
}

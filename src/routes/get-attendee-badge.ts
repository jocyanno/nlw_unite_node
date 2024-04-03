import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export function getAttendeeBadge(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/attendees/:attendeeId/badge",
    {
      schema: {
        params: z.object({
          attendeeId: z.number().int()
        }),
        response: {
          200: z.object({
            attendee: z.object({
              name: z.string(),
              email: z.string(),
              event: z.object({
                title: z.string()
              })
            })
          })
        }
      }
    },
    async (request, reply) => {
      const { attendeeId } = request.params;

      const attendee = await prisma.attendee.findUnique({
        select: {
          name: true,
          email: true,
          event: {
            select: {
              title: true
            }
          }
        },
        where: {
          id: attendeeId
        }
      });

      if (attendee === null) {
        throw new Error("Attendee not found");
      }

      return reply.send({ attendee });
    }
  );
}

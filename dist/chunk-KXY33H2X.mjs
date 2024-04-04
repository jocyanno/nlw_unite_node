import {
  prisma
} from "./chunk-5KVQPZKD.mjs";

// src/routes/get-event-attendees.ts
import { z } from "zod";
async function getEventAttendees(app) {
  app.withTypeProvider().get(
    "/events/:eventId/attendees",
    {
      schema: {
        summary: "Get event attendees",
        tags: ["events"],
        params: z.object({
          eventId: z.string().uuid()
        }),
        querystring: z.object({
          query: z.string().nullish(),
          pageIndex: z.string().nullish().default("0").transform(Number)
        }),
        response: {
          200: z.object({
            attendees: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
                email: z.string().email(),
                createAt: z.date(),
                checkedInAt: z.date().nullable()
              })
            )
          })
        }
      }
    },
    async (request, reply) => {
      const { eventId } = request.params;
      const { pageIndex, query } = request.query;
      const attendees = await prisma.attendee.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createAt: true,
          CheckIn: {
            select: {
              createdAt: true
            }
          }
        },
        where: query ? { eventId, name: { contains: query } } : { eventId },
        take: 10,
        skip: pageIndex * 10,
        orderBy: {
          createAt: "desc"
        }
      });
      return reply.send({
        attendees: attendees.map((attendee) => {
          return {
            id: attendee.id,
            name: attendee.name,
            email: attendee.email,
            createAt: attendee.createAt,
            checkedInAt: attendee.CheckIn?.createdAt ?? null
          };
        })
      });
    }
  );
}

export {
  getEventAttendees
};
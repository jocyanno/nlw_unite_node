import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { generateSlug } from "../utils/generate-slug";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { BadRequest } from "./_errors/bad-request";

export async function createEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events",
    {
      schema: {
        summary: "Create an event",
        tags: ["events"],
        body: z.object({
          title: z.string({ invalid_type_error: 'O título precisa ser um texto'}).min(4, { message: 'O título precisa ter no mínimo 4 caracteres' }),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable()
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid()
          }),
          409: z.object({
            error: z.string()
          })
        }
      }
    }, 
    async (request, reply) => {
      const { title, details, maximumAttendees } = request.body;
      const slug = generateSlug(title);

      const eventWithSameSlug = await prisma.event.findUnique({
        where: { slug }
      });

      if (eventWithSameSlug !== null) {
        throw new BadRequest(
          "An event with the same title already exists"
        );
      }

      const event = await prisma.event.create({
        data: {
          title,
          details,
          maximumAttendees,
          slug: slug
        }
      });

      return reply.status(201).send({ eventId: event.id });
    }
  );
}
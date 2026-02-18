import type { FastifyRequest, FastifyReply } from "fastify";
import { successResponse, paginatedResponse } from "../../libs/response.js";
import { ValidationError } from "../../libs/errors.js";
import * as paymentService from "./payment.service.js";
import {
  topUpSchema,
  paymentOrderQuerySchema,
  paymentOrderIdParamSchema,
  bogCallbackSchema,
} from "./payment.schemas.js";

export async function createTopUp(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const bodyParsed = topUpSchema.safeParse(request.body);
  if (!bodyParsed.success) {
    throw new ValidationError(bodyParsed.error.errors[0].message);
  }

  const { order, redirectUrl } = await paymentService.createTopUp(
    request.user.id,
    bodyParsed.data.amount
  );

  return reply.send(
    successResponse("Top-up order created", { order, redirectUrl })
  );
}

export async function bogCallback(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const bodyParsed = bogCallbackSchema.safeParse(request.body);
  if (!bodyParsed.success) {
    request.log.warn(
      { errors: bodyParsed.error.errors },
      "Invalid BOG callback payload"
    );
    return reply.status(400).send({ error: "Invalid payload" });
  }

  await paymentService.handleCallback(bodyParsed.data as never);

  // BOG expects HTTP 200 to confirm receipt
  return reply.status(200).send({ received: true });
}

export async function getOrders(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const queryParsed = paymentOrderQuerySchema.safeParse(request.query);
  if (!queryParsed.success) {
    throw new ValidationError(queryParsed.error.errors[0].message);
  }

  const { page, limit, status } = queryParsed.data;
  const { items, totalItems } = await paymentService.getOrders(
    request.user.id,
    page,
    limit,
    status
  );

  return reply.send(
    paginatedResponse("Payment orders retrieved", items, page, limit, totalItems)
  );
}

export async function getOrderById(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const paramsParsed = paymentOrderIdParamSchema.safeParse(request.params);
  if (!paramsParsed.success) {
    throw new ValidationError(paramsParsed.error.errors[0].message);
  }

  const order = await paymentService.getOrderById(
    paramsParsed.data.id,
    request.user.id
  );

  return reply.send(successResponse("Payment order retrieved", order));
}

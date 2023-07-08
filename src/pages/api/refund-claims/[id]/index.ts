import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { refundClaimValidationSchema } from 'validationSchema/refund-claims';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.refund_claim
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getRefundClaimById();
    case 'PUT':
      return updateRefundClaimById();
    case 'DELETE':
      return deleteRefundClaimById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getRefundClaimById() {
    const data = await prisma.refund_claim.findFirst(convertQueryToPrismaUtil(req.query, 'refund_claim'));
    return res.status(200).json(data);
  }

  async function updateRefundClaimById() {
    await refundClaimValidationSchema.validate(req.body);
    const data = await prisma.refund_claim.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteRefundClaimById() {
    const data = await prisma.refund_claim.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}

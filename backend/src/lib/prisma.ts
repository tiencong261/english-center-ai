import { PrismaClient } from '@prisma/client'

declare global {
  // allow global `var` across module reloads in dev
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined
}

const prisma = global.__prismaClient ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') global.__prismaClient = prisma

export default prisma

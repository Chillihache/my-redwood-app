import { db } from 'src/lib/db'
import { context } from '@redwoodjs/graphql-server'
import { scrapeNextPages, resetAndScrape } from 'src/services/scraper/scraper'

export const searches = () => {
  const currentUser = context.currentUser
  return db.search.findMany({
    where: { userId: currentUser.id },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { profiles: true } } },
  })
}

export const search = ({ id }) => {
  return db.search.findUnique({
    where: { id },
    include: { _count: { select: { profiles: true } } },
  })
}

export const createSearch = ({ input }) => {
  return db.search.create({
    data: { ...input, userId: context.currentUser.id },
  })
}

export const updateSearch = ({ id, input }) => {
  return db.search.update({
    data: input,
    where: { id },
  })
}

export const deleteSearch = ({ id }) => {
  return db.search.delete({
    where: { id },
  })
}

export const Search = {
  user: (_obj, { root }) => {
    return db.search.findUnique({ where: { id: root?.id } }).user()
  },
  profiles: (_obj, { root }) => {
    return db.search.findUnique({ where: { id: root?.id } }).profiles()
  },
}

export { scrapeNextPages, resetAndScrape}
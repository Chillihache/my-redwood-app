import { db } from 'src/lib/db'

export const profiles = ({ searchId, skip = 0, take = 20 }) => {
  return db.profile.findMany({
    where: { searchId },
    skip,
    take,
    orderBy: { createdAt: 'asc' },
  })
}

export const profilesCount = ({ searchId }) => {
  return db.profile.count({
    where: { searchId },
  })
}

export const profile = ({ id }) => {
  return db.profile.findUnique({
    where: { id },
  })
}

export const createProfile = ({ input }) => {
  return db.profile.create({
    data: input,
  })
}

export const updateProfile = ({ id, input }) => {
  return db.profile.update({
    data: input,
    where: { id },
  })
}

export const deleteProfile = ({ id }) => {
  return db.profile.delete({
    where: { id },
  })
}

export const Profile = {
  search: (_obj, { root }) => {
    return db.profile.findUnique({ where: { id: root?.id } }).search()
  },
}
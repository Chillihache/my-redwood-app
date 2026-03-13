import { db } from 'api/src/lib/db'
import { faker } from '@faker-js/faker'
import { hashPassword } from '@redwoodjs/auth-dbauth-api'

const METIERS = [
  'Développeur', 'Ingénieur', 'Consultant', 'Chef de projet',
  'Data Scientist', 'DevOps', 'Architecte', 'Product Manager',
  'Designer UX', 'Analyste'
]

const DOMAINES = [
  'React', 'Python', 'nucléaire', 'data', 'cloud', 'Java',
  'cybersécurité', 'IA', 'mobile', 'fullstack'
]

const VILLES = [
  'Paris', 'Lyon', 'Bordeaux', 'Toulouse', 'Nantes',
  'Marseille', 'Lille', 'Remote', 'Strasbourg', 'Rennes'
]

export default async () => {
  try {
    console.log('🌱 Début du seed...')

    // Nettoyage de la DB
    await db.profile.deleteMany()
    await db.search.deleteMany()
    await db.user.deleteMany()
    console.log('🧹 DB nettoyée')

    // Utilisateur de test
    const [hashedPassword, salt] = hashPassword('password123')
    const testUser = await db.user.create({
      data: {
        email: 'test@test.com',
        name: 'Test User',
        hashedPassword,
        salt,
      },
    })
    console.log('✅ Utilisateur de test créé (test@test.com / password123)')

    // Search de test avec 100 profils pour tester le scroll infini
    const testSearch = await db.search.create({
      data: {
        keywords: 'ingénieur nucléaire',
        location: 'Paris',
        userId: testUser.id,
      },
    })

    await db.profile.createMany({
      data: Array.from({ length: 100 }, () => ({
        name: faker.person.firstName() + ' ' + faker.person.lastName(),
        title: `${METIERS[Math.floor(Math.random() * METIERS.length)]} ${DOMAINES[Math.floor(Math.random() * DOMAINES.length)]}`,
        snippet: faker.lorem.sentence(),
        url: `https://fr.linkedin.com/in/${faker.internet.userName().toLowerCase()}`,
        searchId: testSearch.id,
      })),
    })
    console.log('✅ Search de test créé avec 100 profils')

    // Créer 5 utilisateurs fictifs
    // ... reste du seed inchangé

    // Créer 5 utilisateurs
    const users = []
    for (let i = 0; i < 5; i++) {
      const [hashedPassword, salt] = hashPassword('password123')
      const user = await db.user.create({
        data: {
          email: faker.internet.email(),
          name: faker.person.firstName() + ' ' + faker.person.lastName(),
          hashedPassword,
          salt,
        },
      })
      users.push(user)
    }
    console.log(`✅ ${users.length} utilisateurs créés`)

    // Créer 100 recherches réparties entre les utilisateurs
    const searches = []
    for (let i = 0; i < 100; i++) {
      const user = users[i % users.length]
      const metier = METIERS[Math.floor(Math.random() * METIERS.length)]
      const domaine = DOMAINES[Math.floor(Math.random() * DOMAINES.length)]
      const ville = VILLES[Math.floor(Math.random() * VILLES.length)]

      const search = await db.search.create({
        data: {
          keywords: `${metier} ${domaine}`,
          location: ville,
          userId: user.id,
        },
      })
      searches.push(search)
    }
    console.log(`✅ ${searches.length} recherches créées`)

    // Créer 1000 profils répartis aléatoirement
    const profilesPerSearch = {}
    for (let i = 0; i < 1000; i++) {
      const search = searches[Math.floor(Math.random() * searches.length)]
      profilesPerSearch[search.id] = (profilesPerSearch[search.id] || 0) + 1
    }

    let totalProfiles = 0
    for (const [searchId, count] of Object.entries(profilesPerSearch)) {
      const profiles = Array.from({ length: count }, () => ({
        name: faker.person.firstName() + ' ' + faker.person.lastName(),
        title: `${METIERS[Math.floor(Math.random() * METIERS.length)]} ${DOMAINES[Math.floor(Math.random() * DOMAINES.length)]}`,
        snippet: faker.lorem.sentence(),
        url: `https://fr.linkedin.com/in/${faker.internet.userName().toLowerCase()}`,
        searchId: parseInt(searchId),
      }))

      await db.profile.createMany({ data: profiles })
      totalProfiles += count
    }
    console.log(`✅ ${totalProfiles} profils créés`)

    console.log('🎉 Seed terminé avec succès !')
  } catch (error) {
    console.error('❌ Erreur seed:', error)
  }
}
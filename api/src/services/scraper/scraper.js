import { db } from 'src/lib/db'

const SERPER_API_KEY = process.env.SERPER_API_KEY

async function fetchPage(keywords, location, page) {
  const query = `site:linkedin.com/in ${keywords} ${location || ''}`

  const res = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'X-API-KEY': SERPER_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: query,
      page: page,
      num: 10,
      gl: 'fr',
      hl: 'fr',
    }),
  })

  const data = await res.json()
  return data.organic ?? []
}

function parseProfile(item, searchId) {
  return {
    name: item.title?.replace(/\s*[-|].*$/, '').trim() ?? 'Inconnu',
    title: item.snippet?.split('\n')[0] ?? null,
    snippet: item.snippet ?? null,
    url: item.link ?? '',
    searchId,
  }
}

export async function scrapeNextPages({ searchId }) {
  const search = await db.search.findUnique({ where: { id: searchId } })
  if (!search) throw new Error('Search not found')

  const nextPage1 = search.lastPage + 1
  const nextPage2 = search.lastPage + 2

  const [results1, results2] = await Promise.all([
    fetchPage(search.keywords, search.location, nextPage1),
    fetchPage(search.keywords, search.location, nextPage2),
  ])

  const allResults = [...results1, ...results2]

  if (allResults.length === 0) {
    return 0
  }

  let inserted = 0
  for (const item of allResults) {
    const profile = parseProfile(item, searchId)
    if (!profile.url) continue
    try {
      await db.profile.upsert({
        where: { url_searchId: { url: profile.url, searchId } },
        update: {},
        create: profile,
      })
      inserted++
    } catch (e) {}
  }

  await db.search.update({
    where: { id: searchId },
    data: { lastPage: nextPage2 },
  })

  return inserted
}

export async function resetAndScrape({ searchId }) {
  await db.profile.deleteMany({ where: { searchId } })
  await db.search.update({
    where: { id: searchId },
    data: { lastPage: 0 },
  })
  return scrapeNextPages({ searchId })
}
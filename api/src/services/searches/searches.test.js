import {
  searches,
  search,
  createSearch,
  updateSearch,
  deleteSearch,
} from './searches'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('searches', () => {
  scenario('returns all searches', async (scenario) => {
    const result = await searches()

    expect(result.length).toEqual(Object.keys(scenario.search).length)
  })

  scenario('returns a single search', async (scenario) => {
    const result = await search({ id: scenario.search.one.id })

    expect(result).toEqual(scenario.search.one)
  })

  scenario('creates a search', async (scenario) => {
    const result = await createSearch({
      input: { keywords: 'String', userId: scenario.search.two.userId },
    })

    expect(result.keywords).toEqual('String')
    expect(result.userId).toEqual(scenario.search.two.userId)
  })

  scenario('updates a search', async (scenario) => {
    const original = await search({ id: scenario.search.one.id })
    const result = await updateSearch({
      id: original.id,
      input: { keywords: 'String2' },
    })

    expect(result.keywords).toEqual('String2')
  })

  scenario('deletes a search', async (scenario) => {
    const original = await deleteSearch({
      id: scenario.search.one.id,
    })
    const result = await search({ id: original.id })

    expect(result).toEqual(null)
  })
})

import { render } from '@redwoodjs/testing/web'

import ResultsPage from './ResultsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ResultsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ResultsPage id={'42'} />)
    }).not.toThrow()
  })
})

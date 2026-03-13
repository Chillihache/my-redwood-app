import { useRef, useEffect, useState } from 'react'
import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { useQuery, useMutation, gql } from '@redwoodjs/web'
import { useApolloClient } from '@apollo/client'
import { useAuth } from 'src/auth'

const GET_PROFILES = gql`
  query GetProfiles($searchId: Int!, $skip: Int, $take: Int) {
    profiles(searchId: $searchId, skip: $skip, take: $take) {
      id
      name
      title
      snippet
      url
    }
    profilesCount(searchId: $searchId)
  }
`

const GET_SEARCH = gql`
  query GetSearch($id: Int!) {
    search(id: $id) {
      id
      keywords
      location
      _count {
        profiles
      }
    }
  }
`

const SCRAPE = gql`
  mutation ScrapeNextPages($searchId: Int!) {
    scrapeNextPages(searchId: $searchId)
  }
`

const RESET_AND_SCRAPE = gql`
  mutation ResetAndScrape($searchId: Int!) {
    resetAndScrape(searchId: $searchId)
  }
`

const TAKE = 20

const ResultsPage = ({ id }) => {
  const { currentUser, loading: authLoading } = useAuth()
  const client = useApolloClient()
  const [profiles, setProfiles] = useState([])
  const [skip, setSkip] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isScraping, setIsScraping] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const isScrolling = useRef(false)

  const searchId = parseInt(id)

  useEffect(() => {
    if (!authLoading && !currentUser) navigate(routes.login())
  }, [currentUser, authLoading])

  const { data: searchData, refetch: refetchSearch } = useQuery(GET_SEARCH, {
    variables: { id: searchId },
  })

  const [scrapeNextPages] = useMutation(SCRAPE)
  const [resetAndScrape] = useMutation(RESET_AND_SCRAPE)

  const fetchProfiles = async (skip) => {
    const result = await client.query({
      query: GET_PROFILES,
      variables: { searchId, skip, take: TAKE },
      fetchPolicy: 'network-only',
    })
    return result.data
  }

  useEffect(() => {
    if (!searchId || authLoading || !currentUser) return
    fetchProfiles(0).then((data) => {
      setProfiles(data.profiles)
      setHasMore(data.profiles.length < data.profilesCount)
      setSkip(0)
      setInitialLoading(false)
    })
  }, [searchId, authLoading, currentUser])

  const handleReset = async () => {
    isScrolling.current = false
    setProfiles([])
    setSkip(0)
    setHasMore(true)
    setIsFinished(false)
    setIsScraping(true)
    await resetAndScrape({ variables: { searchId } })
    const data = await fetchProfiles(0)
    setProfiles(data.profiles)
    setHasMore(data.profiles.length < data.profilesCount)
    setSkip(0)
    await refetchSearch()
    setIsScraping(false)
  }

  useEffect(() => {
    const handleScroll = async () => {
      const bottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200

      if (!bottom || isScrolling.current || isFinished) return

      isScrolling.current = true

      if (hasMore) {
        const newSkip = skip + TAKE
        try {
          const data = await fetchProfiles(newSkip)
          const updated = [...profiles, ...data.profiles]
          setProfiles(updated)
          setHasMore(updated.length < data.profilesCount)
          setSkip(newSkip)
        } finally {
          isScrolling.current = false
        }
      } else {
        setIsScraping(true)
        try {
          const { data: scrapeData } = await scrapeNextPages({ variables: { searchId } })
          const inserted = scrapeData?.scrapeNextPages ?? 0

          if (inserted > 0) {
            const data = await fetchProfiles(profiles.length)
            if (data.profiles.length > 0) {
              const updated = [...profiles, ...data.profiles]
              setProfiles(updated)
              setHasMore(updated.length < data.profilesCount)
              setSkip(updated.length)
            }
            await refetchSearch()
          } else {
            setIsFinished(true)
          }
        } finally {
          setIsScraping(false)
          isScrolling.current = false
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasMore, skip, profiles, isFinished])

  const search = searchData?.search

  return (
    <>
      <Metadata title="Résultats" />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <button
            onClick={() => navigate(routes.search())}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            ← Retour
          </button>
          <button
            onClick={handleReset}
            disabled={isScraping}
            style={{
              padding: '8px 16px',
              backgroundColor: isScraping ? '#f3f4f6' : '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              cursor: isScraping ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              opacity: isScraping ? 0.5 : 1,
            }}
          >
            🔄 Rafraichir
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
              {search?.keywords}
              {search?.location && (
                <span style={{ color: '#6b7280', fontWeight: 'normal' }}>
                  {' '}• {search.location}
                </span>
              )}
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>
              {search?._count?.profiles} profils trouvés
            </p>
          </div>
        </div>

        {initialLoading && (
          <p style={{ color: '#6b7280' }}>Chargement des profils...</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {profiles.map((profile) => (
            <a
              key={profile.id}
              href={profile.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'block',
                padding: '16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'inherit',
                backgroundColor: '#fff',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
            >
              <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                {profile.name}
              </div>
              {profile.title && (
                <div style={{ fontSize: '14px', color: '#2563eb', marginBottom: '4px' }}>
                  {profile.title}
                </div>
              )}
              {profile.snippet && (
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  {profile.snippet}
                </div>
              )}
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '6px' }}>
                {profile.url}
              </div>
            </a>
          ))}
        </div>

        {isScraping && (
          <p style={{ textAlign: 'center', color: '#2563eb', padding: '16px' }}>
            🔄 Recherche de nouveaux profils...
          </p>
        )}

        {isFinished && !isScraping && profiles.length > 0 && (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: '16px' }}>
            Tous les profils ont été chargés
          </p>
        )}
      </div>
    </>
  )
}

export default ResultsPage
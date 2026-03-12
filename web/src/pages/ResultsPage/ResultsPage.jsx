import { useEffect, useState } from 'react'
import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { useQuery, gql } from '@redwoodjs/web'
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

const TAKE = 20

const ResultsPage = ({ id }) => {
  const { currentUser, loading: authLoading } = useAuth()
  const [profiles, setProfiles] = useState([])
  const [skip, setSkip] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const searchId = parseInt(id)

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate(routes.login())
    }
  }, [currentUser, authLoading])

  const { data: searchData } = useQuery(GET_SEARCH, {
    variables: { id: searchId },
  })

  const { data, loading, fetchMore } = useQuery(GET_PROFILES, {
    variables: { searchId, skip: 0, take: TAKE },
    onCompleted: (data) => {
      setProfiles(data.profiles)
      setHasMore(data.profiles.length < data.profilesCount)
    },
  })

  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200

      if (bottom && hasMore && !loading) {
        const newSkip = skip + TAKE
        setSkip(newSkip)
        fetchMore({
          variables: { searchId, skip: newSkip, take: TAKE },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev
            return {
              ...prev,
              profiles: [...prev.profiles, ...fetchMoreResult.profiles],
            }
          },
        }).then((result) => {
          setProfiles((prev) => [...prev, ...result.data.profiles])
          setHasMore(
            profiles.length + result.data.profiles.length <
            result.data.profilesCount
          )
        })
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasMore, loading, skip, profiles])

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

        {loading && profiles.length === 0 && (
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

        {loading && profiles.length > 0 && (
          <p style={{ textAlign: 'center', color: '#6b7280', padding: '16px' }}>
            Chargement de la suite...
          </p>
        )}

        {!hasMore && profiles.length > 0 && (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: '16px' }}>
            Tous les profils ont été chargés ({profiles.length})
          </p>
        )}
      </div>
    </>
  )
}

export default ResultsPage
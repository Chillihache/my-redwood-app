import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { useQuery, gql } from '@redwoodjs/web'
import { useAuth } from 'src/auth'
import { useState, useEffect } from 'react'

const GET_SEARCHES = gql`
  query GetSearches {
    searches {
      id
      keywords
      location
      createdAt
      _count {
        profiles
      }
    }
  }
`

const SearchPage = () => {
  const { loading } = useAuth()
  const { currentUser } = useAuth()
  const [keywords, setKeywords] = useState('')
  const [location, setLocation] = useState('')

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate(routes.login())
    }
  }, [currentUser, loading])

  const { data, loading: searchesLoading } = useQuery(GET_SEARCHES)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Recherche:', keywords, location)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <>
      <Metadata title="Recherche" />
      <main style={{ maxWidth: '800px', margin: '32px auto', padding: '0 16px' }}>

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '32px',
        }}>
          <input
            type="text"
            placeholder="ingénieur React, data scientist..."
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            style={{
              flex: 2,
              padding: '10px 14px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
          <input
            type="text"
            placeholder="Paris, Lyon, Remote..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 14px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
          <button
            type="submit"
            disabled={!keywords}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: keywords ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              opacity: keywords ? 1 : 0.5,
            }}
          >
            Rechercher
          </button>
        </form>

        <div>
          <h2 style={{ fontSize: '16px', color: '#6b7280', marginBottom: '16px' }}>
            Recherches récentes
          </h2>

          {searchesLoading && <p style={{ color: '#6b7280' }}>Chargement...</p>}

          {!searchesLoading && data?.searches?.length === 0 && (
            <p style={{ color: '#6b7280' }}>Aucune recherche pour l'instant.</p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data?.searches?.map((search) => (
              <div
                key={search.id}
                onClick={() => navigate(routes.results({ id: search.id }))}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: '#fff',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
              >
                <div>
                  <span style={{ fontWeight: '500' }}>{search.keywords}</span>
                  {search.location && (
                    <span style={{ color: '#6b7280', marginLeft: '8px' }}>
                      • {search.location}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>
                    {search._count.profiles} profils
                  </span>
                  <span style={{ color: '#9ca3af', fontSize: '13px' }}>
                    {formatDate(search.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

export default SearchPage
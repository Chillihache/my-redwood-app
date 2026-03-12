import { useState } from 'react'
import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { useQuery, gql } from '@redwoodjs/web'
import { useAuth } from 'src/auth'

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
  const { currentUser, logOut } = useAuth()
  const [keywords, setKeywords] = useState('')
  const [location, setLocation] = useState('')

  const { data, loading } = useQuery(GET_SEARCHES)

  const handleSubmit = (e) => {
    e.preventDefault()
    // On branchera Serper.dev ici plus tard
    console.log('Recherche:', keywords, location)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <>
      <Metadata title="Recherche" />

      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 32px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#fff',
      }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
          LinkedIn Search
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#6b7280', fontSize: '14px' }}>
            {currentUser?.email}
          </span>
          <button
            onClick={logOut}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Déconnexion
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '800px', margin: '32px auto', padding: '0 16px' }}>

        {/* Formulaire de recherche */}
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

        {/* Liste des recherches */}
        <div>
          <h2 style={{ fontSize: '16px', color: '#6b7280', marginBottom: '16px' }}>
            Recherches récentes
          </h2>

          {loading && <p style={{ color: '#6b7280' }}>Chargement...</p>}

          {!loading && data?.searches?.length === 0 && (
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
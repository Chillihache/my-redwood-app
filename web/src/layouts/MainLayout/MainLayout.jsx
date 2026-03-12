import { navigate, routes } from '@redwoodjs/router'
import { useAuth } from 'src/auth'

const MainLayout = ({ children }) => {
  const { currentUser, logOut } = useAuth()

  const handleLogOut = async () => {
    await logOut()
    navigate(routes.login())
  }

  return (
    <>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 32px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <h1
          onClick={() => navigate(routes.search())}
          style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          LinkedIn Search
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#6b7280', fontSize: '14px' }}>
            {currentUser?.email}
          </span>
          <button
            onClick={handleLogOut}
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
      <main>
        {children}
      </main>
    </>
  )
}

export default MainLayout
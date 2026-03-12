import { useEffect } from 'react'
import { Router, Route } from '@redwoodjs/router'
import { useAuth } from './auth'

const LogoutPage = () => {
  const { logOut } = useAuth()
  useEffect(() => {
    logOut().then(() => navigate(routes.login()))
  }, [])
  return <div>Déconnexion...</div>
}

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Route path="/" page={SearchPage} name="search" />
      <Route path="/logout" page={LogoutPage} name="logout" />
      <Route path="/login" page={LoginPage} name="login" />
      <Route path="/signup" page={SignupPage} name="signup" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
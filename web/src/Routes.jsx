import { Router, Route, Set, navigate, routes } from '@redwoodjs/router'
import { useAuth } from './auth'
import MainLayout from 'src/layouts/MainLayout/MainLayout'

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Set wrap={MainLayout}>
        <Route path="/" page={SearchPage} name="search" />
        <Route path="/results/{id}" page={ResultsPage} name="results" />
      </Set>
      <Route path="/login" page={LoginPage} name="login" />
      <Route path="/signup" page={SignupPage} name="signup" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
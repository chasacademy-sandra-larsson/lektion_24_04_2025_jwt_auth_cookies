import './App.css'
import { SignUp } from './components/SignUp'
import { SignIn } from './components/SignIn'

function App() {

  return (
    <>
      <h1>Testa cookies med JWT</h1>
      <h2>Skapa en ny användare</h2>
      <SignUp />
      <h2>Logga in</h2>
      <SignIn />
    </>
  )
}

export default App

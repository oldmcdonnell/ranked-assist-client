import { Link } from "react-router-dom"
import MyNavbar from "./MyNavBar"

function Header() {
  return (
    <div style={{ margin: 10 }}>
      <Link style={{ marginRight: 20 }} to='/'>Home</Link>
      <MyNavbar />
      <Link to='/login'>Login</Link>
    </div>
  )
}

export default Header
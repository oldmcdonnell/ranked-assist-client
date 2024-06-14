import UserList from "./UserList"
import CreateFriendGroupForm from "./CreateFriendGroupForm"
import CreateCandidate from "./CreateCandidate"

function App() {

  return (
    <div className="p-5">
      <UserList />
      <CreateFriendGroupForm />
      <CreateCandidate />

    </div>
  )
}

export default App
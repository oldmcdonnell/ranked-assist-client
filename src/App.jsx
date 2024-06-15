import UserList from "./UserList"
import CreateFriendGroupForm from "./CreateFriendGroupForm"
import CreateCandidate from "./CreateCandidate"
import PollOpen from "./PollOpen"

function App() {

  return (
    <div className="p-5">
      <UserList />
      <CreateFriendGroupForm />
      <CreateCandidate />
      <PollOpen />

    </div>
  )
}

export default App
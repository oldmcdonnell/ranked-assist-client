import UserList from "./UserList"
import CreateFriendGroupForm from "./CreateFriendGroupForm"
import CreateCandidate from "./CreateCandidate"
import PollOpen from "./PollOpen"
import PollOpen2 from "./PollOpen2"

function App() {

  return (
    <div className="p-5">
      <UserList />
      <CreateFriendGroupForm />
      <CreateCandidate />
      <PollOpen />
      <PollOpen2 />

    </div>
  )
}

export default App
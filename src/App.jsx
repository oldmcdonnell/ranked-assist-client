import UserList from "./UserList"
import CreateFriendGroupForm from "./CreateFriendGroupForm"
import CreateCandidate from "./CreateCandidate"
import PollOpen from "./PollOpen"
import VoteResults from "./VoteResults"

function App() {

  return (
    <div className="p-5">
      <UserList />
      <CreateCandidate />
      {/* <PollOpen />
      <VoteResults /> */}

    </div>
  )
}

export default App
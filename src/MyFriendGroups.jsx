import { useState, useContext, useEffect } from "react";
import { getMyGroups } from "./api";
import { AuthContext } from "./context";

function MyFriendGroups() {
  const { state, dispatch } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getMyGroups(dispatch, state.accessToken);
        setGroups(data);
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      }
    };

    fetchGroups();
  }, [state.accessToken, dispatch]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {groups.map((group) => (
        <div key={group.id}>
          <h4>{group.title}</h4>
          <h3>{group.vote}</h3>
        </div>
      ))}
    </>
  );
}

export default MyFriendGroups;
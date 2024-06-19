import React, { useContext, useEffect, useState } from 'react';
import { getAllProfiles, createFriendGroup } from './api';
import { ProfileContext, AuthContext } from './context';
import { useNavigate } from 'react-router-dom';

export default function CreateFriendGroupForm() {
  const { state: profileState, dispatch: profileDispatch } = useContext(ProfileContext);
  const { state: authState } = useContext(AuthContext);
  const [filter, setFilter] = useState('');
  const [groupName, setGroupName] = useState('');
  const [note, setNote] = useState('');
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        let profiles = await getAllProfiles({ accessToken: authState.accessToken, dispatch: profileDispatch });
        setProfiles(profiles);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfiles();
  }, [authState.accessToken, profileDispatch]);

  const filteredProfiles = profileState.profiles.filter((profile) => {
    const searchString = `${profile.user.username} ${profile.first_name} ${profile.last_name} ${profile.user.email}`.toLowerCase();
    return searchString.includes(filter.toLowerCase());
  });

  const handleProfileClick = (profile) => {
    if (!selectedProfiles.includes(profile)) {
      setSelectedProfiles([...selectedProfiles, profile]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createFriendGroup({
        accessToken: authState.accessToken,
        dispatch: profileDispatch,
        users: selectedProfiles.map(profile => profile.id),
        title: groupName,
        note,
      });
      navigate('/myprofile');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Create Polling Group</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
        />
        <textarea
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search profiles"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <div>
          {filter && filteredProfiles.slice(0, 5).map((profile, index) => (
            <div
              key={index}
              onClick={() => handleProfileClick(profile)}
            >
              @{profile.user.username} - {profile.first_name} {profile.last_name} ({profile.user.email})
            </div>
          ))}
        </div>
        <div>
          <h3>Selected Profiles:</h3>
          <ul>
            {selectedProfiles.map(profile => (
              <li key={profile.id}>
                {profile.user.username}
              </li>
            ))}
          </ul>
        </div>
        <button type="submit">Create Group</button>
      </form>
    </div>
  );
}

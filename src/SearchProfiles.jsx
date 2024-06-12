import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context';
import { getAllProfiles } from './api';

export default function SearchProfiles({}) {
  const [filter, setFilter] = useState('');
  const { state, dispatch } = useContext(AuthContext);
  const { accessToken, users } = state;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        await getAllProfiles(dispatch, accessToken);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfiles();
  }, [accessToken, dispatch]);

  const filteredProfiles = users.filter((profile) => {
    return (
      profile.user.first_name.toLowerCase().includes(filter.toLowerCase()) ||
      profile.user.username.toLowerCase().includes(filter.toLowerCase()) ||
      profile.user.last_name.toLowerCase().includes(filter.toLowerCase()) ||
      profile.user.email.toLowerCase().includes(filter.toLowerCase())
    );
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Search profiles"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      {filter &&
        filteredProfiles.slice(0, 5).map((prof, index) => (
          <div
            key={index}
            onClick={() => {
              console.log('Profile selected:', prof);
              const fetchProfileImClicking = async () => {
                try {
                  const theProfile = await getProfileToSee({
                    profile: state.profile,
                    profileId: prof.id,
                  });
                  dispatch({
                    type: 'SET_PROFILE_IM_SEEING',
                    theProfile: theProfile,
                  });
                  navigate('/profile');
                  console.log('Profile To See:', theProfile);
                } catch (error) {
                  console.log('Error:', error);
                }
              };
              fetchProfileImClicking();
            }}
          >
            @{prof.user.username} -{' '}
            <span style={{ color: 'lightgray' }}>
              {prof.user.first_name} {prof.user.last_name}
            </span>
          </div>
        ))}
    </div>
  );
}

import React, { useEffect, useState, createContext, useContext } from 'react';

import axios from 'axios';
import server from '../environment';

const InterviewContext = createContext();

export const InterviewsProvider = ({ children }) => {

  const [internships, setInternships] = useState([]);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const { data } = await axios.post(
          `${server}/interview/getAll-Interviews`,
          {},
          {withCredentials : true}
        );

        console.log(data);

        if (data?.internships) {
          setInternships(data.internships);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchInterviews();
  }, []);

  return(
    <InterviewContext.Provider value={{internships}}>
      {children}
    </InterviewContext.Provider>
  );

}


export const useGetAllInterviews = () => useContext(InterviewContext);























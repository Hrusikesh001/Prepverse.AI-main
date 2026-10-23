import React, { useEffect, useState, createContext, useContext } from 'react';
import axios from 'axios';
import server from '../environment';

const ResumeContext = createContext();

export const ResumesProvider = ({ children }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const { data } = await axios.post(
          `${server}/resume/get-resumes`,
          {},
          { withCredentials: true } 
        );

        if (data.userResumes?.resumes) {
          setResumes(data.userResumes.resumes || []);
        }else{
          setResumes([]);
        }
      } catch (err) {
        console.error("Error fetching resumes:", err);
      } finally {
        setLoading(false); 
      }
    };

    fetchResumes();
  }, []);

  return (
    <ResumeContext.Provider value={{ resumes, loading }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useGetAllResumes = () => useContext(ResumeContext);

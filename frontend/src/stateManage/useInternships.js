import { create } from 'zustand';

const useInternships = create((set) => ({
  internshipsData: [],
  setInternshipsData: (internshipsData) => set({internshipsData}),

  searchInternships: [],
  setSearchInternships: (searchInternships) => set({searchInternships}), 

}))

export default useInternships;































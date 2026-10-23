
// import React, { useState, useContext } from 'react';
// import ImageSelector from '../../components/imageSelector';
// import useResumeStore from '../../stateManage/useResumeStore';
// import server from '../../environment';
// import toast from 'react-hot-toast';
// import axios from 'axios';
// import { ThemeContext } from '../../context/ThemeContext';

// function ProfileInfoForm() {
//   const [imageUrl, setImageUrl] = useState();
//   const { resumeData, updateResumeField, selectedResumeId } = useResumeStore();
//   const { theme } = useContext(ThemeContext);

//   const handleProfileImageChange = (imageUrl) => {
//     setImageUrl(imageUrl);
//     updateResumeField('profileInfo', 'profilePreviewUrl', imageUrl);
//   };

//   const handleImageRemove = async () => {
//     const publicId = resumeData.profileInfo.profilePublicId;

//     if (publicId) {
//       try {
//         const { data } = await axios.post(
//           `${server}/deleteImage`,
//           { publicId },
//           { withCredentials: true }
//         );

//         if (data.result) {
//           updateResumeField('profileInfo', 'profilePreviewUrl', "");
//           updateResumeField('profileInfo', 'profilePublicId', "");

//           const resumeDetails = useResumeStore.getState().resumeData;
//           const id = selectedResumeId;

//           await axios.post(
//             `${server}/resume/edit-resume`,
//             { resumeDetails, id },
//             { withCredentials: true }
//           );

//           toast.success("Image Deleted");
//         }
//       } catch (err) {
//         console.log(err);
//       }
//     }
//   };

//   // Theme-aware styles - updated for black dark theme
//   const containerStyle = theme === "dark" 
//     ? "space-y-6 p-2 flex flex-col h-full bg-black" 
//     : "space-y-6 p-2 flex flex-col h-full bg-gray-50";
    
//   const headerStyle = theme === "dark" 
//     ? "text-xl font-semibold text-white mt-2 border-b border-gray-800 pb-2"
//     : "text-xl font-semibold text-gray-800 mt-2 border-b border-gray-300 pb-2";
    
//   const labelStyle = theme === "dark" 
//     ? "block text-sm font-medium text-gray-300 mb-1"
//     : "block text-sm font-medium text-gray-700 mb-1";
    
//   const inputClass = theme === "dark" 
//     ? "w-full px-4 py-2.5 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent transition-all"
//     : "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent transition-all";
    
//   const textareaClass = theme === "dark" 
//     ? "w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent transition-all"
//     : "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent transition-all";
    
// const buttonClass = theme === "dark" 
//   ? "flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-all duration-200"
//   : "flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-all duration-200";


//   return (
//     <div className={containerStyle}>

//       <h2 className={headerStyle}>
//         Personal Information
//       </h2>

//       <ImageSelector
//         onImageChange={handleProfileImageChange}
//         setImageUrl={resumeData.profileInfo.profilePreviewUrl}
//         onImageRemove={handleImageRemove}
//         buttonClass={buttonClass}
//       />

//       <div className="flex flex-col md:flex-row gap-4">
//         <div className="flex-1">
//           <label htmlFor="fullName" className={labelStyle}>
//             Full Name
//           </label>
//           <input
//             type="text"
//             id="fullName"
//             className={inputClass}
//             placeholder="John Doe"
//             value={resumeData.profileInfo?.fullName || ''}
//             onChange={(e) => updateResumeField('profileInfo', 'fullName', e.target.value)}
//           />
//         </div>

//         <div className="flex-1">
//           <label htmlFor="designation" className={labelStyle}>
//             Designation
//           </label>
//           <input
//             type="text"
//             id="designation"
//             className={inputClass}
//             placeholder="Frontend Developer"
//             value={resumeData.profileInfo?.designation || ''}
//             onChange={(e) => updateResumeField('profileInfo', 'designation', e.target.value)}
//           />
//         </div>
//       </div>

//       <div>
//         <label htmlFor="summary" className={labelStyle}>
//           Summary
//         </label>
//         <textarea
//           id="summary"
//           rows={4}
//           className={textareaClass}
//           placeholder="A passionate frontend developer with 5+ years of experience..."
//           value={resumeData.profileInfo?.summary || ''}
//           onChange={(e) => updateResumeField('profileInfo', 'summary', e.target.value)}
//         />
//       </div>

//     </div>
//   );
// }

// export default ProfileInfoForm;


import React, { useState, useContext } from 'react';
import ImageSelector from '../../components/imageSelector';
import useResumeStore from '../../stateManage/useResumeStore';
import server from '../../environment';
import toast from 'react-hot-toast';
import axios from 'axios';
import { ThemeContext } from '../../context/ThemeContext';

function ProfileInfoForm() {
  const [imageUrl, setImageUrl] = useState();
  const { resumeData, updateResumeField, selectedResumeId } = useResumeStore();
  const { theme } = useContext(ThemeContext);

  const handleProfileImageChange = (imageUrl) => {
    setImageUrl(imageUrl);
    updateResumeField('profileInfo', 'profilePreviewUrl', imageUrl);
  };

  const handleImageRemove = async () => {
    const publicId = resumeData.profileInfo.profilePublicId;

    if (publicId) {
      try {
        const { data } = await axios.post(
          `${server}/deleteImage`,
          { publicId },
          { withCredentials: true }
        );

        if (data.result) {
          updateResumeField('profileInfo', 'profilePreviewUrl', "");
          updateResumeField('profileInfo', 'profilePublicId', "");

          const resumeDetails = useResumeStore.getState().resumeData;
          const id = selectedResumeId;

          await axios.post(
            `${server}/resume/edit-resume`,
            { resumeDetails, id },
            { withCredentials: true }
          );

          toast.success("Image Deleted");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  // Theme-aware styles
  const containerStyle = theme === "dark" 
    ? "space-y-6 p-2 flex flex-col h-full bg-black" 
    : "space-y-6 p-2 flex flex-col h-full bg-gray-50";
    
  const headerStyle = theme === "dark" 
    ? "text-xl font-semibold text-white mt-2 border-b border-gray-800 pb-2"
    : "text-xl font-semibold text-gray-800 mt-2 border-b border-gray-300 pb-2";
    
  const labelStyle = theme === "dark" 
    ? "block text-sm font-medium text-gray-300 mb-1"
    : "block text-sm font-medium text-gray-700 mb-1";
    
  const inputClass = theme === "dark" 
    ? "w-full px-4 py-2.5 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
    : "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all";
    
  const textareaClass = theme === "dark" 
    ? "w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
    : "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all";
    
  // use your orange theme via var(--primary)
  const buttonClass = "flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200";

  return (
    <div className={containerStyle}>

      <h2 className={headerStyle}>
        Personal Information
      </h2>

      <ImageSelector
        onImageChange={handleProfileImageChange}
        setImageUrl={resumeData.profileInfo.profilePreviewUrl}
        onImageRemove={handleImageRemove}
        buttonClass={buttonClass}
        buttonStyle={{
          backgroundColor: "var(--primary)",
          color: "#fff",
        }} // 👈 inline style overrides blue background
      />

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="fullName" className={labelStyle}>
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            className={inputClass}
            placeholder="John Doe"
            value={resumeData.profileInfo?.fullName || ''}
            onChange={(e) => updateResumeField('profileInfo', 'fullName', e.target.value)}
          />
        </div>

        <div className="flex-1">
          <label htmlFor="designation" className={labelStyle}>
            Designation
          </label>
          <input
            type="text"
            id="designation"
            className={inputClass}
            placeholder="Frontend Developer"
            value={resumeData.profileInfo?.designation || ''}
            onChange={(e) => updateResumeField('profileInfo', 'designation', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label htmlFor="summary" className={labelStyle}>
          Summary
        </label>
        <textarea
          id="summary"
          rows={4}
          className={textareaClass}
          placeholder="A passionate frontend developer with 5+ years of experience..."
          value={resumeData.profileInfo?.summary || ''}
          onChange={(e) => updateResumeField('profileInfo', 'summary', e.target.value)}
        />
      </div>

    </div>
  );
}

export default ProfileInfoForm;

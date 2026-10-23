// import React, { useEffect, useState } from 'react';
// import { Upload, Trash2, User } from 'lucide-react';
// import useResumeStore from '../stateManage/useResumeStore';

// function ImageSelector({onImageChange, setImageUrl, onImageRemove}) {
//   const [image, setImage] = useState(setImageUrl || null);
//   const {setSelectedImageFile} = useResumeStore();

//   useEffect(() => {
//     setImage(setImageUrl);
//   }, [setImageUrl]);

//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setImage(imageUrl);
//       onImageChange?.(imageUrl)
//       setSelectedImageFile(file);
//     }
//   };

//   const handleRemove = () => {
//     setImage(null);
//     onImageChange?.(null);
//     setSelectedImageFile(null);
//     onImageRemove?.();
//   };

//   return (
//     <div className="relative w-30 h-30 mx-auto mt-6 z-10">
//       <div className="w-full h-full rounded-full bg-white/5 border border-white/20 backdrop-blur-sm shadow-md flex items-center justify-center relative z-0">

//         {/* Image or default user icon */}
//         {image? (
//           <img
//             src={image}
//             alt="Profile"
//             className="object-cover w-full h-full rounded-full"
//           />
//         ) : (
//           <User className="w-12 h-12 text-white/50" />
//         )}

//         {/* Floating Button (Upload/Delete) */}
//         <div className="absolute bottom-0 right-0 z-10">
//           {!image? (
//             <label className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-lg border-2 border-white transform translate-x-[0%] translate-y-[0%] z-10">
//               <Upload className="w-4 h-4 text-white" />
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleImageChange}
//               />
//             </label>
//           ) : (
//             <button
//               onClick={handleRemove}
//               className="flex items-center justify-center w-9 h-9 rounded-full bg-red-600 hover:bg-red-700 shadow-lg border-2 border-white transform translate-x-[0%] translate-y-[0%] z-10"
//               title="Remove image"
//             >
//               <Trash2 className="w-4 h-4 text-white" />
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ImageSelector;
import React, { useEffect, useState } from 'react';
import { Upload, Trash2, User } from 'lucide-react';
import useResumeStore from '../stateManage/useResumeStore';

function ImageSelector({
  onImageChange,
  setImageUrl,
  onImageRemove,
  buttonClass = "",
  buttonStyle = {}
}) {
  const [image, setImage] = useState(setImageUrl || null);
  const { setSelectedImageFile } = useResumeStore();

  useEffect(() => {
    setImage(setImageUrl);
  }, [setImageUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      onImageChange?.(imageUrl);
      setSelectedImageFile(file);
    }
  };

  const handleRemove = () => {
    setImage(null);
    onImageChange?.(null);
    setSelectedImageFile(null);
    onImageRemove?.();
  };

  return (
    <div className="relative w-30 h-30 mx-auto mt-6 z-10">
      <div className="w-full h-full rounded-full bg-white/5 border border-white/20 backdrop-blur-sm shadow-md flex items-center justify-center relative z-0">

        {/* Image or default user icon */}
        {image ? (
          <img
            src={image}
            alt="Profile"
            className="object-cover w-full h-full rounded-full"
          />
        ) : (
          <User className="w-12 h-12 text-white/50" />
        )}

        {/* Floating Button (Upload/Delete) */}
        <div className="absolute bottom-0 right-0 z-10">
          {!image ? (
            <label
              className={`${buttonClass} w-12 h-12 rounded-full flex items-center justify-center cursor-pointer border-2 border-white shadow-lg transform z-10 bg-blue-600 hover:bg-blue-700`}
              style={buttonStyle}
            >
              <Upload className="w-5 h-5 text-white" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          ) : (
            <button
              onClick={handleRemove}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-white hover:bg-orange-50 shadow-lg border-2 border-white transform z-10"
              title="Remove image"
            >
              <Trash2 className="w-5 h-5 text-orange-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageSelector;

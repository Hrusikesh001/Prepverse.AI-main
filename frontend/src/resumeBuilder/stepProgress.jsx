


import React from 'react' 

function StepProgress({ progress }) {
  return (
    <div className='w-full bg-white h-1 overflow-hidden rounded-[2px]'>
      <div
        className='h-1 bg-[#ff6900] transition-[width] duration-300 ease-in-out rounded'
        style={{ width: typeof progress === 'number' ? `${progress}%` : progress }}
      />
    </div>
  )
}

export default StepProgress

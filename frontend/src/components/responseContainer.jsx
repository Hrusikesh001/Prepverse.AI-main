import React from 'react'
import Paper from '@mui/material/Paper';

function ResponseContainer({message}) {
  return (
    <div>
      <Paper className='w-[30vw] h-[40vh] overflow-scroll' elevation={3}>{message}</Paper>
    </div>
  )
}

export default ResponseContainer
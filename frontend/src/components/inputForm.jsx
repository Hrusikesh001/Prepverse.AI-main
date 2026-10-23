import React, { useRef, useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios'

function InputForm({setMessage}) {

  const [search, setSearch] = useState("");
  const [loading , setLoading] = useState(false);

  const buttonRef = useRef(null);

  const handleOutputButtonClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try{
      const res = await axios.post(
        "http://localhost:8000/sendUserMessage",
        {search}
      );

      console.log(res);

      setMessage(res.data.message);
      setLoading(false);
      setSearch("");
    }catch(err){
      console.log(err);
    }

    
  }

  return (
    <div>
      <div className='flex flex-col h-[40vh] w-[20vw] bg-amber-50 justify-center items-center gap-4 p-6'>
        <TextField 
        id="outlined-basic" 
        label="User Input" 
        variant="outlined" 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        />
        <Button ref={buttonRef} variant="contained" disabled={loading} className='w-[100px]' onClick={e => handleOutputButtonClick(e)}>Get Output</Button>
      </div>
    </div>
  )
}

export default InputForm
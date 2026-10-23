const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function test() {
  const formData = new FormData();
  formData.append('file', fs.createReadStream('dummy.pdf'));
  
  try {
    const res = await axios.post('http://127.0.0.1:5000/api/resume-upload/upload', formData, {
      headers: formData.getHeaders(),
    });
    console.log("Success!", res.data);
  } catch (err) {
    console.error("Error Status:", err.response ? err.response.status : err.message);
    console.error("Error Data:", err.response ? err.response.data : err);
  }
}

test();

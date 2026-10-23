import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

async function test() {
  const formData = new FormData();
  formData.append('file', fs.createReadStream('../dummy.pdf'));
  
  try {
    const res = await axios.post('http://127.0.0.1:3000/parse-resume', formData, {
      headers: formData.getHeaders(),
    });
    console.log("Success parse-resume!", res.data);

    let resume_data = JSON.parse(res.data.resume_data);
    
    const res2 = await axios.post('http://127.0.0.1:3000/summarize', { resume_data });
    console.log("Success summarize!", res2.data);
    
    const res3 = await axios.post('http://127.0.0.1:5001/embed_candidate', {
        summary: res2.data.summary,
        resumeJSONdata: resume_data
    });
    console.log("Success embed_candidate!", res3.data ? "Embedding exists" : "No embedding");
  } catch (err) {
    console.error("Error Status:", err.response ? err.response.status : err.message);
    console.error("Error Data:", err.response ? err.response.data : err);
  }
}

test();

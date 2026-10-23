let IS_PROD = false;

const frontend_url = IS_PROD ? 
  "https://prepverse-ai-python-server.onrender.com" :
  "http://localhost:5173"

export default frontend_url;
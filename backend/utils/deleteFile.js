import fs from 'fs'

export const deleteFile = (path) => {
  fs.unlink(path, (err) => {
    if (err) console.error("Failed to delete file:", err.message);
    else console.log("File deleted:", path);
  });
};

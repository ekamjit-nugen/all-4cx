import React, { createContext, useState } from "react";

const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [ uploadedFiles, setUploadedFiles ] = useState([]);
  const [ folderFiles, setFolderFiles ] = useState([]);

  return (
    <UploadContext.Provider value={{ uploadedFiles, setUploadedFiles, folderFiles, setFolderFiles }}>
      {children}
    </UploadContext.Provider>
  );
};

export default UploadContext;
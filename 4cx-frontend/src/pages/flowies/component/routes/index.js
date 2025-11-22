// // RoutesConfig.js
// import React from "react";
// import Canvas from "@/component/ui/src/views/canvas"; // Ensure the path is correct
// import { Route, Routes } from 'react-router-dom';

// const RoutesConfig = () => (
//   <Routes>
//     <Route path="/" element={<Canvas />} />
//   </Routes>
// );

// export default RoutesConfig;


import React from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Canvas from "@/component/ui/src/views/canvas";  // Ensure the path is correct
import { ThemeProvider } from "@mui/material/styles";
import themes from "@/themes";  // Assuming your themes.js exports a function

const RoutesConfig = () => {
  const customization = useSelector((state) => state.customization);  // Access Redux state for customization

  return (
    <ThemeProvider theme={themes(customization)}>
      <Routes>
        <Route path="/" element={<Canvas />} />
        {/* Add more routes here if needed */}
      </Routes>
    </ThemeProvider>
  );
};

export default RoutesConfig;

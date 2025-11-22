import { Box, Typography } from '@mui/material'
import { websiteTabText, localTabText } from 'assets/information-box-text'
import React from 'react'

function InformationBox({ tabLayout }) {
  
  const currentTabText = tabLayout === "Local" ? localTabText :  websiteTabText

  return (
  <Box borderLeft={1} borderColor={"grey.400"} pl={5} height={"auto"} display={"grid"} width={"100%"} maxWidth={"500px"} gap={"20px"} sx={{ position: "relative" }}>
      <Typography color="#404040" variant="h5">Information</Typography>
      
      {currentTabText.map((section, index) => (
        <Typography key={index}>
          <Typography sx={{color: "#111827"}} variant="body2" component="span" fontWeight="bold">{section.title}</Typography>
          <br />
          <Typography sx={{color:"#52525b"}} variant="body2" fontWeight={"medium"} component="span">{section.content}</Typography>
        </Typography>
      ))}
    </Box>
  )
}

export default InformationBox
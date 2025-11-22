import { Box, Card, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import CodeOffIcon from "@mui/icons-material/CodeOff";
import MemoryIcon from "@mui/icons-material/Memory";
import { useSelector, useDispatch } from "react-redux";
import { updateIndexingStrategy } from "store/features/searchSlice";
import { isEqual } from "lodash";
import { updateUnSaveChanges } from "store/features/searchSlice";

export default function IndexingStrategy() {
  const [temp, setTemp] = useState(null);
  const searchRedux = useSelector((state) => state.searchFlow.flowJsonData);
  const [selectedStrategy, setSelectedStrategy] = useState(searchRedux["Indexing_Strategy"]?.data);
  const dispatch = useDispatch();

  const data = [
    {
      id: 1,
      icon: EditIcon,
      title: "RAG",
    },
    {
      id: 2,
      icon: EditIcon,
      title: "Sequential RAG",
    },
    {
      id: 3,
      icon: CodeOffIcon,
      title: "Sliding Window Indexing",
    },
    {
      id: 4,
      icon: MemoryIcon,
      title: "Hierarchical Chunk Indexing",
    },
    {
      id: 5,
      icon: MemoryIcon,
      title: "Temporal Chunk Indexing",
    },
  ];

  const isValid = isEqual(temp, selectedStrategy);

  // useEffect(() => {
  //   if (temp) {
  //     dispatch(updateUnSaveChanges(!isValid));
  //   }
  // }, [isValid]);

  useEffect(() => {
    if(selectedStrategy != undefined){
      const data = {
        data: selectedStrategy,
        status: true,
      };
      dispatch(updateIndexingStrategy(data));
    }
  }, [selectedStrategy]);

  return (
    <Box
      sx={{
        gap: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: 50,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            width: "60%",
          }}
        >
          <Typography sx={{ fontSize: 22, fontWeight: "700" }}>Choose Indexing Strategy</Typography>
          <Typography sx={{ fontSize: 12, color: "gray" }}>
            How do you want to index the data?
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <Box
        sx={{
          padding: 5,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {data.map((item) => {
          const { id, icon: Icon, title } = item;
          const isSelected = title === selectedStrategy;

          return (
            <Box
              key={id}
              sx={{
                gap: 2,
                paddingX: 2,
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Card
                sx={{
                  border: 1,
                  width: 150,
                  height: 150,
                  boxShadow: 0,
                  fontSize: 20,
                  display: "flex",
                  backgroundColor: isSelected ? "lightgray" : "white",
                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "center",
                  "&:hover": {
                    boxShadow: 10,
                    cursor: "pointer",
                  },
                }}
                onClick={() => setSelectedStrategy(title)}
              >
                <Box sx={{ fontSize: 30 }}>
                  <Icon />
                </Box>
              </Card>
              <Typography sx={{ fontSize: 14 }}>{title}</Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

import React, { useState } from "react";
import DataTable from "./data-table";
import CustomAddColumnModal from "./add-columns-modal";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateSelectColumn } from "store/features/retrievalSlice";

const columns = [
  {
    field: "name",
    headerName: "Name",
    renderCell: (params) => (
      <strong>{params.value}</strong> // Make the name value bold
    ),
  },
  { field: "origin", headerName: "Origin" },
  { field: "description", headerName: "Description" },
];

export default function SelectColumnComponent({ columnsList, setColumnsList, dropDownValue }) {
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    origin: "",
    description: "",
    filter: "",
    isSelected: true,
  });
  const [setPage, setSetPage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const reduxData = useSelector((state) => state.retrieval);
  const dispatch = useDispatch();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log("CLOSE CLOSE");
    setIsModalOpen(false);
  };

  const handleInputFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (data) => {
    const { value } = data;
    setFormData((prevData) => ({ ...prevData, origin: value }));
  };

  const handleModalSubmit = () => {
    const value = reduxData?.retrievalFlowsJson?.select_columns?.data;
    let newId = 0;
    if (reduxData?.retrievalFlowsJson?.select_columns?.data?.length) {
      newId = reduxData?.retrievalFlowsJson?.select_columns?.data?.length;
    } else {
      newId = columnsList.length;
    }
    dispatch(
      updateSelectColumn({
        data: [...(value?.length ? value : columnsList), { ...formData, id: newId + 1 }],
        status: true,
      })
    );
    // Update the columnsList state
    setColumnsList((prev) => [
      ...prev, // Preserve the previous columnsList data
      formData, // Add the new formData to the list
    ]);

    const newTotalDataCount = columnsList.length + 1; // New total with the added column
    const newTotalPages = Math.ceil(newTotalDataCount / entriesPerPage); // entriesPerPage should match the one in DataTable

    // Redirect to the last page
    setPage(newTotalPages);

    handleCloseModal();
  };

  return (
    <>
      <CustomAddColumnModal
        formData={formData}
        open={isModalOpen}
        onClose={handleCloseModal}
        handleInputFieldChange={handleInputFieldChange}
        handleSelectChange={handleSelectChange}
        handleModalSubmit={handleModalSubmit}
      />
      <DataTable
        data={columnsList}
        columns={columns}
        entriesPerPage={entriesPerPage}
        handleOpenModal={handleOpenModal}
        isLoading={false}
        dropDown={dropDownValue}
        setPage={setSetPage}
      />
    </>
  );
}

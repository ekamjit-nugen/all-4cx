import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import fetchData from "services/api";
import { updateVersion } from "store/features/promptSlice";
import { updateSelectedPromptDescription } from "store/features/reactFlowSlice";

const VersionList = ({ selectedValue, updateState, options, onChange }) => {
  const dispatch = useDispatch();
  const reduxOptions = useSelector((state) => state.reactFlow.selectedPromptVersion);
  const description = options?.find(
    (data) => data.prompt_title === selectedValue?.selectedPromptValue
  );

  const fetchDescription = async (version) => {
    const response = await fetchData(`/prompt/${description?._id}/version/${version}`, "GET");
    onChange(response?.data);
    dispatch(updateSelectedPromptDescription(response));
  };

  const handleOnChange = (value) => {
    const obj = {
      selectedVersionValue: value,
    };
    updateState(obj);
    dispatch(updateVersion(value));
    fetchDescription(value);
  };

  return (
    <div>
      <select
        style={{
          width: "100%",
          padding: "8px 10px",
          outline: "none",
          fontSize: "12px",
          cursor: "pointer",
          appearance: "none",
          borderRadius: "8px",
          backgroundColor: "#ffffff",
          border: "1px solid lightGray",
          transition: "border-color 0.3s ease",
        }}
        value={selectedValue.selectedVersionValue}
        onFocus={(e) => e.target.blur()}
        onChange={(e) => {
          handleOnChange(e.target.value);
        }}
        // disabled={reduxOptions === undefined || reduxOptions.length === 0}
      >
        <option value="select_version">Select Version</option>
        {reduxOptions &&
          reduxOptions?.map((data, index) => {
            return (
              <>
                <option key={index} value={`${data}`}>
                  {data}
                </option>
              </>
            );
          })}
      </select>
    </div>
  );
};

export default VersionList;

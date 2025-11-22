import React, { memo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updatePromptId } from "store/features/promptSlice";
import { updateSelectedPromptVersion,updateSelectedPromptDescription } from "store/features/reactFlowSlice";

const PromptList = memo(({ options, selectedValue, updateState}) => {
  const dispatch = useDispatch();
  const version = options?.find((data) => data.prompt_title === selectedValue?.selectedPromptValue);

  const handleOnChange = (event) => {
    if (selectedValue?.selectedPromptValue != event) {
      const obj = {
        selectedPromptValue: event,
        selectedVersionValue: "",
      };
      updateState(obj);
      dispatch(updateSelectedPromptVersion(""));
      dispatch(updateSelectedPromptDescription(""));
    }
  };

  useEffect(() => {
    if (version != undefined && selectedValue?.selectedPromptValue != "") {
      dispatch(updateSelectedPromptVersion(version?.versions));
      dispatch(updatePromptId(version?.prompt_id));
    }
  }, [selectedValue?.selectedPromptValue, version]);

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
         
        }}
        value={selectedValue?.selectedPromptValue}
        onFocus={(e) => e.target.blur()}
        onChange={(e) => handleOnChange(e.target.value)}
        disabled={options.length === 0}
      >
        <option  value="">{options.length > 0 ? "Select Prompt" : "Loading Prompt"}</option>
        {options?.map((data, index) => {
          return (
            <option  key={index} value={data?.prompt_title}>
              {data?.prompt_title}
            </option>
          );
        })}
      </select>
    </div>
  );
});

export default PromptList;

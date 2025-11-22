export const initialSearchReduxData = {
  flowJsonData: {
    Chunk_Enrichment: {
      chunkingType: ["Extract affirmative and factual statements"],
      selectedLanguage: { id: 1, value: "Option 2", label: "Option 2" },
      status: false,
    },
    Chunking_Strategy: {
      chunkingType: "Chunk by Page",
      category: { id: 1, value: "CSV", label: "CSV" },
      inputValue: "",
      status: false,
    },
    Indexing_Strategy: {
      status: false,
    },
    Select_Data_Source: {
      status: false,
    },
  },
  name: "",
  traversal: {
    Select_Data_Source: false,
    Chunk_Enrichment: false,
  },
  process: 0,
  unSaveChanges: false,
  callHandleSave: false,
  createNew: false,
};

export const initialRetrievalReduxData = {
  // retrievalFlowsJson: {
  //   select_columns: {
  //     data: null,
  //     status: false,
  //   },
  //   apply_filter: {
  //     data: null,
  //     status: false,
  //   },
  //   choose_retrieval_strategy: {
  //     status: false,
  //   },
  // },
  // name: "",
  // isLoading: true,
  // drop_down_value: { id: 0, label: "No Option", value: "No Option" },
  // process: 0,
  // unSaveChanges: false,
  // callHandleSave: false,
  // createNew: false,
  retrievalFlowsJson: {
    select_columns: {
      data: null,
      status: false,
    },
    apply_filter: {
      data: null,
      status: false,
    },
    choose_retrieval_strategy: {
      status: false,
    },
  },
  name: "",
  isLoading: true,
  drop_down_value: { id: 0, label: "No Option", value: "No Option" },
  process: 0,
  unSaveChanges: false,
  callHandleSave: false,
  createNew: false,
  indexId: "",
};

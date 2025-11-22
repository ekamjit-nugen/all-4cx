// Define constants for maximum rows and initial state
const MAX_ROWS = 6;

const state = {
  rows: 1,
  keysPressed: new Set(),
};

// Update the number of rows, ensuring it doesn't exceed MAX_ROWS
export const SetInputRows = (rows) => {
  if (rows < MAX_ROWS) {
    state.rows = rows + 1;
  }
};

// Set the number of rows to the maximum allowed
export const SetInputRowsToMax = () => {
  state.rows = MAX_ROWS;
};

// Reset the number of rows to the initial state (1 row)
export const ResetInputRows = () => {
  state.rows = 1;
};

export const onKeyDown = (event, submit) => {
  // Ensure event and submit are valid
  if (!event || !submit || typeof submit !== "function") {
    console.error("Invalid event or submit function:", { event, submit });
    return;
  }

  state.keysPressed.add(event.key);

  if (state.keysPressed.has("Enter") && state.keysPressed.has("Shift")) {
    SetInputRows(state.rows + 1);
  }

  if (
    !event.nativeEvent.isComposing &&
    state.keysPressed.has("Enter") &&
    !state.keysPressed.has("Shift")
  ) {
    submit(event); // Pass event to submit
    ResetInputRows();
    event.preventDefault();
  }
};

// Handle key up events, removing keys from the pressed set
export const onKeyUp = (event) => {
  state.keysPressed.delete(event.key);
};

// Return the current state, replacing the useSnapshot hook
export const useChatInputDynamicHeight = () => {
  return state;
};

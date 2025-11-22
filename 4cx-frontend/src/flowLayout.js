import React from 'react';

const FlowiseLayout = ({ children }) => {
  return (
    <div>
      <header>
        <h1>Flowise Layout</h1>
        {/* This could be a different header for this route */}
      </header>
      <main>{children}</main>
      <footer>
        <p>Footer for Flowise Layout</p>
      </footer>
    </div>
  );
};

export default FlowiseLayout;

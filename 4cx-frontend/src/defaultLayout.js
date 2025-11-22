import React from 'react';

const DefaultLayout = ({ children }) => {
  return (
    <div>
      <header>
        <h1>Default Layout</h1>
        {/* This could be a navigation bar or any other global component */}
      </header>
      <main>{children}</main>
      <footer>
        <p>Footer for Default Layout</p>
      </footer>
    </div>
  );
};

export default DefaultLayout;

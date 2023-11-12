import React from 'react';
import { Routes, Route } from "react-router-dom";

import Layout from './layout';

function App() {
  return (
    <Routes>
      <Route path='/my-bookmark/index.html' element={<Layout />}></Route>
    </Routes>
  );
}

export default App;

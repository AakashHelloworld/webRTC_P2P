import React from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "./Page/Home";
import { Room } from "./Page/Room";
function App() {
  return (
    <div>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/room/:id" element={<Room/>} />
    </Routes>
    </div>
  );
}

export default App;

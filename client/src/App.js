import React from "react";
import { Route, Routes } from "react-router-dom";
import {  Drawercompo } from "./components/Drawercompo";
import { GoldPage } from "./components/LandingPage/GoldPage";



export const App = () => {
  return(
    <>
    <Routes>
      <Route path="/drawer" element = {<Drawercompo/>} />
      <Route path="/gold" element = {<GoldPage/>} />
      
      

    </Routes>
    

    </>
  )

}
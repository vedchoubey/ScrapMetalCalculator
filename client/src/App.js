import React from "react";
import { Route, Routes } from "react-router-dom";
import {  Drawercompo } from "./components/Drawercompo";
import { MainPage } from "./components/LandingPage/MainPage";
import InvoicePdf from "./components/LandingPage/InvoicePdf";



export const App = () => {
  return(
    <>
    <Routes>
      <Route path="/drawer" element = {<Drawercompo/>} />
      <Route path="/" element = {<MainPage/>} />
      
      
      

    </Routes>
    

    </>
  )

}
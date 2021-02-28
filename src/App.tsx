import React from "react";
import { MainNavbar } from "./Components/Navbar/Navbar";
import { Footer } from './Components/Footer/Footer';
import { MineField } from "./Pages/MineField/MineField";

export function App() {

    return (
        <>
            <MainNavbar/>
            <MineField width={80} height={80} bombCount={30}/>
            <Footer/>
        </>
    );
}
import React, {lazy, Suspense} from "react";
import {BrowserRouter} from "react-router-dom";
import {Cursor, Navbar, SmoothScroll} from "./components/index.js";
import ScrollProgress from "./components/ScrollProgress.jsx";
import BookShell from "./components/BookShell.jsx";

const BackgroundScene = lazy(() => import("./components/BackgroundScene.jsx"));

function App() {
    return (
        <BrowserRouter>
            <SmoothScroll/>
            <Cursor/>
            <ScrollProgress/>
            <Suspense fallback={null}>
                <BackgroundScene/>
            </Suspense>
            <div className="relative z-0 bg-primary/30 noise-overlay overflow-x-hidden">
                <Navbar/>
                <BookShell/>
            </div>
        </BrowserRouter>
    );
}

export default App;

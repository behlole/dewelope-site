// Eager exports — only the always-needed shell components.
// Heavy / below-fold sections (Experience, Tech, Works, Feedbacks, Contact, Footer,
// StarsCanvas) are lazy-imported directly in App.jsx to enable code-splitting.
import Hero from "./Hero";
import Navbar from "./Navbar";
import About from "./About";
import SmoothScroll from "./SmoothScroll";
import Cursor from "./Cursor";

export {Hero, Navbar, About, SmoothScroll, Cursor};

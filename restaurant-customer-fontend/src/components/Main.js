import React from "react";
import Container from "./Main/container";
import About from "./Main/about";
import Why_us from "./Main/why-us";
import Menu from "./Main/menu";
import Specials from "./Main/specials";
import Events from "./Main/events";
import BookTable from "./Main/book-a-table";
import Gallery from "./Main/gallery";
import Chefs from "./Main/chefs";
import Contact from "./Main/contact";
const Main = () => {
  return (
    <main>
      <Container />
      <About />
      <Why_us />
      <Menu />
      <Specials />
      <Events />
      <BookTable />
      <Gallery />
      <Chefs />
      <Contact />
    </main>
  );
};

export default Main;

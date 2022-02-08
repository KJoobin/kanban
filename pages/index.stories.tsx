import React from "react";

import * as HomePage from "./index";

export default {
  title: "Pages/Home",
  component: HomePage.default,
};

export const Home = () => {
  return <HomePage.default />;
};

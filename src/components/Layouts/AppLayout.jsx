import React from "react";

import { NavigationBar } from "@Components/";

export default function AppLayout({ children }) {
  return (
    <>
      <NavigationBar />
      {children}
    </>
  );
}

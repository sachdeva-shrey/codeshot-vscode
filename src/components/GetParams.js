import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";

import { StyledEditor } from "./CodeEditor";

export default function QueryParamsRouter() {
  return (
    <Router>
      <QueryParamsDemo />
    </Router>
  );
}

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const QueryParamsDemo = () => {
  let query = useQuery();
  return (
    <div>
      <StyledEditor
        theme={query.get("theme")}
        snippet={query.get("snippet")}
        font={query.get("font")}
        lang={query.get("lang")}
      />
    </div>
  );
};
  
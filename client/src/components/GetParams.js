import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";

import { StyledEditor } from "./CodeEditor";

export default function QueryParamsRouter() {
  return (
    <Router>
      <QueryParams />
    </Router>
  );
}

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const QueryParams = () => {
  let query = useQuery();
  return (
    <div>
      <StyledEditor
        theme={query.get("theme")}
        snippet={query.get("snippet")}
        lang={query.get("lang")}
      />
    </div>
  );
};
  
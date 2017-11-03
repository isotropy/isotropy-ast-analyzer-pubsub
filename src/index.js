import meta from "./analyze-meta";
import read from "./analyze-read";
import write from "./analyze-write";

function makeAnalysisState() {
  return {
    importBindings: []
  };
}

export default function() {
  const state = makeAnalysisState();
  return {
    meta: meta(state),
    read: read(state),
    write: write(state)
  };
}

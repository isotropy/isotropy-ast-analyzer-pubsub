import * as schemas from "./schemas";
import makeAnalyzer from "./make-analyzer";
import { schemas as errorSchemas } from "isotropy-analyzer-errors";

export default function(analysisState) {
  return {
    analyzeCallExpression(path, state) {
      return makeAnalyzer(
        [
          schemas.readFile,
          schemas.getFiles,
          schemas.getFilesRecursively,
          errorSchemas.readErrorSchema(
            schemas.root,
            "Unable to parse file system read expression. Refer to documentation."
          )
        ],
        path,
        state,
        analysisState
      );
    }
  };
}

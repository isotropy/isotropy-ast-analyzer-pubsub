import * as schemas from "./schemas";
import makeAnalyzer from "./make-analyzer";
import { schemas as errorSchemas } from "isotropy-analyzer-errors";

export default function(analysisState) {
  return {
    analyzeAssignmentExpression(path, state) {
      return makeAnalyzer(
        [
          schemas.createFile,
          schemas.updateFile,
          schemas.deleteFile,
          schemas.deleteDir,
          schemas.moveFile,
          schemas.moveDir,
          errorSchemas.writeErrorSchema(
            schemas.root,
            "Unable to parse file system write expression. Refer to documentation."
          )
        ],
        path,
        state,
        analysisState
      );
    }
  };
}

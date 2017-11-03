import getAnalyzers from "../";

export default function(opts) {
  let _analysis, _analysisState;

  function analyze(fn, path, state) {
    const analysis = fn(path, state);
    path.skip();
    if (analysis !== undefined) {
      _analysis = analysis;
    }
  }

  let analyzers;

  return {
    plugin: {
      pre() {
        analyzers = getAnalyzers();
      },
      visitor: {
        ImportDeclaration(path, state) {
          analyze(analyzers.meta.analyzeImportDeclaration, path, state);
          path.skip();
        },

        AssignmentExpression(path, state) {
          analyze(analyzers.write.analyzeAssignmentExpression, path, state);
        },
        
        CallExpression(path, state) {
          analyze(analyzers.read.analyzeCallExpression, path, state);
        }
      }
    },
    getResult: () => {
      return { analysis: _analysis };
    }
  };
}

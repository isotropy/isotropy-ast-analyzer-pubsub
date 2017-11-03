import path from "path";

export default function(analysisState) {
  return {
    analyzeImportDeclaration(babelPath, state) {
      return !state.opts.projects
        ? false
        : (() => {
            const fsProject = state.opts.projects.find(project => {
              const projectDir = project.dir.startsWith("./")
                ? project.dir
                : "./" + project.dir;
              const absolutePath = path.resolve(projectDir);
              return state.file.opts.filename.startsWith(absolutePath);
            });

            return !fsProject
              ? false
              : (() => {
                  const moduleName = babelPath.get("source").node.value;
                  const resolvedName = path.resolve(
                    path.dirname(state.file.opts.filename),
                    moduleName
                  );

                  const module = fsProject.modules.find(m => {
                    const sourceDir = m.source.startsWith("./")
                      ? m.source
                      : "./" + m.source;
                    const absolutePath = path.resolve(sourceDir);
                    return absolutePath === resolvedName;
                  });

                  return !module
                    ? false
                    : (() => {
                        const specifier = babelPath.get("specifiers.0").node
                          .local.name;
                        analysisState.importBindings = analysisState.importBindings.concat(
                          {
                            module,
                            binding: babelPath.scope.bindings[specifier]
                          }
                        );
                        return true;
                      })();
                })();
          })();
    }
  };
}

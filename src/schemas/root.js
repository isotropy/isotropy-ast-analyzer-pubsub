import { Match, Skip } from "chimpanzee";

export default function(state, analysisState) {
  const identifier = (path, key, parents, parentKeys) => context => {
    const env = { path, key, parents, parentKeys };
    return path.type === "Identifier"
      ? (() => {
          const importBinding = analysisState.importBindings.find(
            b => b.binding.identifier.name === path.node.name
          );
          return importBinding &&
            importBinding.binding.referencePaths.includes(path)
            ? new Match(
                {
                  identifier: path.node.name,
                  locations: importBinding.module.locations
                },
                env
              )
            : new Skip(`Did not match any known filesystem modules.`, env);
        })()
      : new Skip(`Root node is not an Identifier`, env);
  };
  
  return identifier;
}

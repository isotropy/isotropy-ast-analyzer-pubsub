import { capture, wrap, Match } from "chimpanzee";
import { root } from "./";
import { composite } from "isotropy-analyzer-utils";

export default function(state, analysisState) {
  return composite(
    {
      type: "MemberExpression",
      object: wrap(root(state, analysisState), {
        selector: "path"
      }),
      property: {
        type: "Identifier",
        name: capture("locationName")
      }
    },
    {
      build: obj => context => result => {
        return result instanceof Match
          ? (() => {
              const location =
                result.value.object.locations[result.value.locationName];
              return location
                ? {
                    identifier: result.value.object.identifier,
                    path: location.path
                  }
                : new Fault(
                    `Could not find isotropy plugin configuration for filesystem location ${result
                      .value.locationName}.`
                  );
            })()
          : result;
      }
    }
  );
}

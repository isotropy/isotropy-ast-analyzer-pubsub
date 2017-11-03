import { collection } from "./";
import {
  capture,
  any,
  array,
  repeatingItem,
  map as mapResult,
  Match,
  wrap,
  Skip
} from "chimpanzee";
import { source, composite } from "isotropy-analyzer-utils";
import R from "ramda";

export default function(state, analysisState) {
  return composite({
    type: "AssignmentExpression",
    operator: "=",
    left: source([collection])(state, analysisState),
    right: {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: source([collection])(state, analysisState),
        property: {
          type: "Identifier",
          name: "concat"
        }
      }
    }
  }).then(({ object: _object }) =>
    composite(
      {
        right: {
          arguments: [capture()]
        }
      },
      {
        build: obj => context => result =>
          result instanceof Match
            ? {
                ..._object,
                operation: "create-file",
                files: result.value.arguments[0]
              }
            : result
      }
    )
  );
}

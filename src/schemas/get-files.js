import { collection } from "./";
import {
  capture,
  any,
  array,
  map,
  wrap,
  permuteObject,
  Match,
  Skip
} from "chimpanzee";
import { source, composite, clean } from "isotropy-analyzer-utils";
import R from "ramda";

export default function(state, analysisState) {
  return composite({
    type: "CallExpression",
    callee: {
      type: "MemberExpression",
      object: source([collection])(state, analysisState),
      property: {
        type: "Identifier",
        name: "filter"
      }
    }
  }).then(({ object: _object }) =>
    composite({
      arguments: array([
        {
          type: "ArrowFunctionExpression",
          params: capture()
        }
      ])
    }).then(({ arguments: [{ params }] }) =>
      composite(
        {
          arguments: array([
            {
              body: any(
                permuteObject(["left", "right"], {
                  type: "BinaryExpression",
                  left: {
                    type: "MemberExpression",
                    object: {
                      type: "Identifier",
                      name: params[0].name
                    },
                    property: {
                      type: "Identifier",
                      name: capture("dir")
                    }
                  },
                  operator: "===",
                  right: capture("dir")
                }),
                { key: "dirExpression" }
              )
            }
          ])
        },
        {
          build: obj => context => result =>
            result instanceof Match
              ? {
                  dir: result.value.arguments[0].dirExpression.dir,
                  identifier: _object.identifier,
                  path: _object.path,
                  operation: "get-files"
                }
              : result
        }
      )
    )
  );
}

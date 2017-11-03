import { collection } from "./";
import {
  capture,
  any,
  array,
  map,
  wrap,
  permuteObject,
  permuteArray,
  Match,
  Skip
} from "chimpanzee";
import { source, composite, clean } from "isotropy-analyzer-utils";
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
          name: "map"
        }
      }
    }
  }).then(({ object: _object }) =>
    composite({
      right: {
        arguments: array([
          {
            type: "ArrowFunctionExpression",
            params: capture()
          }
        ])
      }
    }).then(({ arguments: [{ params }] }) =>
      composite(
        {
          right: {
            arguments: array([
              {
                body: {
                  type: "ConditionalExpression",
                  test: any(
                    permuteObject(["left", "right"], {
                      type: "LogicalExpression",
                      left: any(
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
                              name: "filename"
                            }
                          },
                          operator: "===",
                          right: capture("filename")
                        }),
                        { key: "filenameExpression" }
                      ),
                      operator: "&&",
                      right: any(
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
                              name: "dir"
                            }
                          },
                          operator: "===",
                          right: capture("dir")
                        }),
                        { key: "dirExpression" }
                      )
                    })
                  ),
                  consequent: {
                    type: "ObjectExpression",
                    properties: [
                      {
                        type: "SpreadProperty",
                        argument: {
                          type: "Identifier",
                          name: params[0].name
                        }
                      },
                      {
                        type: "ObjectProperty",
                        key: { type: "Identifier", name: "contents" },
                        value: capture("contents")
                      }
                    ]
                  },
                  alternate: { type: "Identifier", name: params[0].name }
                }
              }
            ])
          }
        },
        {
          build: obj => context => result =>
            result instanceof Match
              ? {
                  filename:
                    result.value.arguments[0].test.filenameExpression.filename,
                  dir: result.value.arguments[0].test.dirExpression.dir,
                  contents: result.value.arguments[0].properties[0].contents,
                  identifier: _object.identifier,
                  path: _object.path,
                  operation: "update-file"
                }
              : result
        }
      )
    )
  );
}

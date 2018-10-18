'use-strict'

const exportWebpackModuleId = 'webpackModuleId'

module.exports = function exportWebpackModuleIdPlugin({
  types: t
}) {
  const shouldContinue = _this => {
    const { include } = _this.opts

    if (include && _this.file.opts.filename) {
      const reg = new RegExp(include, 'i')
      return reg.test(_this.file.opts.filename)
    }

    return true
  }

  return {
    name: 'export-webpack-module-id',
    visitor: {
      ExportDefaultDeclaration(path) {
        if (!shouldContinue(this)) return

        const { declaration } = path.node
        let identifier = declaration

        if (!t.isIdentifier(identifier)) {
          const id = path.scope.generateUidIdentifierBasedOnNode(identifier.id)

          if (!t.isExpression(identifier)) {
            if (t.isFunctionDeclaration(identifier)) {
              identifier = t.FunctionExpression(
                identifier.id,
                identifier.params,
                identifier.body,
                identifier.generator,
                identifier.async
              )
            } else if (t.isClassDeclaration(identifier)) {
              identifier = t.ClassExpression(
                identifier.id,
                identifier.superClass,
                identifier.body,
                identifier.decorators
              )
            }
          }

          path.scope.push({ id, init: identifier })
          path.node.declaration = id
          identifier = id
        }

        const assignExpression = t.expressionStatement(
          t.AssignmentExpression(
            '=',
            t.MemberExpression(
              identifier,
              t.Identifier(
                this.opts.webpackModuleId || exportWebpackModuleId
              )
            ),
            t.MemberExpression(
              t.Identifier('module'),
              t.Identifier('id')
            )
          )
        )

        path.insertBefore(assignExpression)
      },
      Program(path) {
        if (!shouldContinue(this)) return

        const namedDeclaration = t.ExportNamedDeclaration(
          t.VariableDeclaration(
            'const',
            [
              t.VariableDeclarator(
                t.Identifier(
                  this.opts.webpackModuleId || exportWebpackModuleId
                ),
                t.MemberExpression(
                  t.Identifier('module'),
                  t.Identifier('id')
                )
              )
            ]
          ),
          []
        )

        path.node.body.push(namedDeclaration)
      }
    }
  }
}

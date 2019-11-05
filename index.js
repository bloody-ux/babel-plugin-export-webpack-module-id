'use-strict'

const exportWebpackModuleId = 'webpackModuleId'

module.exports = function exportWebpackModuleIdPlugin({
  types: t
}) {
  const shouldContinue = _this => {
    let { include, exclude } = _this.opts

    if (exclude && _this.file.opts.filename) {
      if (typeof exclude === 'string') {
        exclude = [exclude]
      }

      for (let i = 0, length = exclude.length; i < length; i++) {
        const reg = new RegExp(exclude[i], 'i')
        if (reg.test(_this.file.opts.filename)) {
          return false
        }
      }
    }

    if (include && _this.file.opts.filename) {
      if (typeof include === 'string') {
        include = [include]
      }

      for (let i = 0, length = include.length; i < length; i++) {
        const reg = new RegExp(include[i], 'i')
        if (reg.test(_this.file.opts.filename)) {
          return true
        }
      }
    } else {
      return true
    }

    return false
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

          // if there's id exists, rename it back
          if (identifier.id) {
            path.scope.rename(id.name, identifier.id.name)
          }
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

import { upperFirst, camelCase } from "lodash";

const requireDirective = require.context("@/directives", true, /\.js$/);
const requireComponent = require.context(
  // Относительный путь до каталога компонентов
  "@/components/shared",
  // Обрабатывать или нет подкаталоги
  false,
  // Регулярное выражение для определения файлов базовых компонентов
  /Base[A-Z]\w+\.(vue|js)$/
);

const registerIcons = () => {
  const requireAll = (r) => r.keys().forEach(r);

  requireAll(require.context("@/assets/icons/", false, /\.svg$/));
};

const registerComponents = (app) => {
  requireComponent.keys().forEach((filename) => {
    const componentConfig = requireComponent(filename);

    // Get PascalCase name of component
    const componentName = upperFirst(
      camelCase(
        /\/\w+\.vue/
          .exec(filename)[0]
          .replace(/^\.\//, "")
          .replace(/\.\w+$/, "")
      )
    );

    app.component(componentName, componentConfig.default || componentConfig);
  });
};

const registerDirectives = (app) => {
  requireDirective.keys().forEach((fileName) => {
    const directiveConfig = requireDirective(fileName);

    const directiveName = upperFirst(
      camelCase(
        /\/\w+\.js/
          .exec(fileName)[0]
          .replace(/^\.\//, "")
          .replace(/\.\w+$/, "")
      )
    );

    app.directive(directiveName, directiveConfig.default || directiveConfig);
  });
};

const registerAll = (app) => {
  registerIcons();
  registerComponents(app);
  registerDirectives(app);
};

export default {
  registerIcons,
  registerComponents,
  registerDirectives,
  registerAll,
};

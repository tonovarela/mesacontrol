# MesaControl

MesaControl es una aplicación desarrollada con Angular que utiliza TailwindCSS, PrimeNG y Syncfusion para crear una interfaz de usuario moderna y funcional. Este proyecto incluye características como un diseño adaptable, soporte para temas oscuros y claros, y componentes reutilizables.

## Características

- **Framework**: Angular 19.
- **Estilos**: TailwindCSS con integración de `tailwindcss-primeui` y `flowbite`.
- **Componentes**: Uso de PrimeNG y Syncfusion para tablas y otros elementos interactivos.
- **Temas**: Soporte para temas oscuros y claros.
- **Rutas**: Configuración modular con alias definidos en `tsconfig.json`.
- **Responsive**: Diseño adaptable para diferentes tamaños de pantalla.

## Estructura del Proyecto

```plaintext
.editorconfig
.gitignore
[angular.json](http://_vscodecontentref_/0)
[package.json](http://_vscodecontentref_/1)
[README.md](http://_vscodecontentref_/2)
[tailwind.config.js](http://_vscodecontentref_/3)
[tsconfig.app.json](http://_vscodecontentref_/4)
[tsconfig.json](http://_vscodecontentref_/5)
[tsconfig.spec.json](http://_vscodecontentref_/6)
src/
  [index.html](http://_vscodecontentref_/7)
  main.ts
  [styles.css](http://_vscodecontentref_/8)
  app/
    app.component.ts
    [app.component.html](http://_vscodecontentref_/9)
    app.component.css
    shared/
      header/
      sidebar/
    layout/
    pages/
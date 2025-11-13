# Documentación del proyecto FrontEnd Work Force Nexxus 2025
![Vue](https://img.shields.io/npm/v/vue?label=Vue&color=green)
![TypeScript](https://img.shields.io/npm/v/typescript?style=flat&label=TypeScript) ![Tailwind](https://img.shields.io/npm/v/tailwindcss?style=flat&label=Tailwind%20CSS&color=06B6D4) ![Vite](https://img.shields.io/npm/v/vite?style=flat&label=Vite&color=646CFF) ![Axios](https://img.shields.io/npm/v/axios?label=Axios)
![Pinia](https://img.shields.io/npm/v/pinia?logo=vuedotjs&logoColor=%234FC08D&label=Pinia&color=%234FC08D)


### 🌀 Proyecto Frontend Work Force Nexxus  🌀

> Bienvenido a este repositorio, este es un avance del proyecto de gestion de recursos humanos llamado **Work Force Nexxus 2025**. Este proyecto es una aplicación web FullStack desarrollada con .NET en el backend y VueJs con TypeScript en el frontend. El objetivo principal de este proyecto es gestionar y administrar los recursos humanos de una empresa de manera eficiente y efectiva.
> Como primera entrega de la tarea es demostrar la administracion del sistema y de como esta compuesto la arquitectura, y sobre como va funcionar la escalabilidad del sistema
> se aplico los patrones de diseño tanto Facade que es para el llamado de las APIs y el patron Observer que es para la gestion de estados globales con Pinia.

## Lista de elementos aplicados y aprendidos en este proyecto

| #  | Tema               | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Complejidad |
|----|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
| 00 | **Vue Components** | Una de las mejores maneras de trabajar en el FrontEnd es la separacion de componentes, para este caso para componente principal lo sub dividi en componentes para tener un mejor orden al codigo y que sea agradable a la vista. Para el caso de Vue use el moderno Composition API junto con el Script Setup                                                                                                                                                                                                                          |![Static Badge](https://img.shields.io/badge/100-green?style=flat&label=Baja)
| 01 | **Tailwind CSS**   | Para realizar los estilos con efectividad sin necesidad de una caratula llena de estilos mezclados y confusos en CSS. Tailwind es un framework que facilita poner estilos mientras se va diseñando y renderizando cada componente dentro de HTML.                                                                                                                                                                                                                                                                                      |![Static Badge](https://img.shields.io/badge/60-yellow?style=flat&label=Medio)
| 02 | **Axios**          | Algo que se me olvidaba de explicar es la libreria de Axios donde me ayuda a consumir mi API desde el backend de la forma mas sencilla. Esta libreria es compatible con los frameworks mas importantes como React Angular y Vue.                                                                                                                                                                                                                                                                                                       |![Static Badge](https://img.shields.io/badge/90-green?style=flat&label=Baja)
| 03 | **MVC**            | **MVC** es considerado el patron mas antiguo lo cual en su tiempo era el mas efectivo al momento de desarrollar una aplicación. Este patron cosiste en la separacion de resposabilidades, el modelo, la vista y el controlador. Existen varias maneras de implementar el patron MVC, en mi caso aplique el MC para el backend y el V para la vista que es el FrontEnd y lo unifique en un solo proyecto. Este patron sirve mucho para nivel educativo pero para proyectos mas grandes se hae el uso de patrones modernos como el MVVM. |![Static Badge](https://img.shields.io/badge/90-green?style=flat&label=Baja)
| 04 | **Pinia**          | Uno de los nuevos conceptos aprendidos de VueJs es **Pinia** un gestor de estados globales, este paquete fue desarrollado solamente para VueJs con la faciilidad de expandir estados reactivos a nivel global en toda la aplicación. Esto sirve ya para proyectos de nivel medio y complejo. Entonces para este proyecto procedi a usar Pinia ya que me facilitaba gestionar los estados son complicarme con los props y emits tradicionales.                                                                                          |![Static Badge](https://img.shields.io/badge/60-yellow?style=flat&label=Medio)

## Tecnologías usadas

![Vue](https://img.shields.io/badge/VueJs--TS-%234FC08D?style=for-the-badge&logo=vue.js&label=FRAMEWORK&labelColor=black)
![TypeScript](https://img.shields.io/badge/typescript-blue?style=for-the-badge&logo=typescript&label=language&labelColor=black) ![Tailwind](https://img.shields.io/badge/tailwind--css-06B6D4?style=for-the-badge&logo=tailwindcss&label=framework&labelColor=black) ![Vite](https://img.shields.io/badge/vite-646CFF?style=for-the-badge&logo=Vite&label=Tool&labelColor=black)




## Recursos donde se aprendio la implementación
- [Vue Mastery](https://www.vuemastery.com/)
- [C#: Empieza tu camino en el lenguaje (DevTalles)](https://cursos.devtalles.com/courses/csharp?coupon=learn-01)
- [Udemy TypeScript: Tu completa guía y manual de mano. ](https://www.udemy.com/course/typescript-guia-completa/)
- [Udemy Vue.js: De cero a experto](https://www.udemy.com/course/vuejs-fh/)
- [Udemy Vue.js - Intermedio: Lleva tus bases al siguiente nivel)](https://www.udemy.com/course/vue-intermedio/)
- [Udemy Vue.js 3 - La Guía Completa](https://www.udemy.com/course/vuejs-la-guia-completa-composition-pinia-mevn-creando-proyectos-reales)
- [Curso NetMentor](https://www.youtube.com/@NetMentor)
- [.NET web API Zero to Hero (AWS)](https://www.youtube.com/@codewithmukesh)


## Repositorios en GitHub
> - [Backend .NET y AWS Lambda](https://github.com/AngelDavidStudios/WFN-Backend)
>
> - [FrontEnd con VueJs y TypeScript](https://github.com/AngelDavidStudios/UI-WFNSystem)


## Link de la Aplicación Web en Netlify
> - [workforcenexxus.netlify.app](https://workforcenexxus.netlify.app/)


## Video explicacion del proyecto.
> - [Explicacion del proyecto Administracion MVC. ](https://youtu.be/uktmgr9V3bE)

## Instrucciones

**Si desea revisar el proyecto, puede clonar con git clone o descargar Zip.**

1. Una vez clonado o descargado el proyecto, proceda a instalar las dependencias necesarias para el proyecto. Para ello, abra la Terminal (Mac/Linux)/ CMD (Windows) y navegue hasta la carpeta del proyecto y ejecute el siguiente comando:

``` bash
npm install
```
2. Una vez instalado las dependencias proceda a ejecutar el proyecto mediante el comando:

``` bash
npm run dev
```

---

## <img src="https://github.com/AngelDavidStudios/calculadora-propinas/blob/main/src/resources/ads-emote.JPG" width="55" height="55"> Hola, mi nombre es David Angel.
### Multimedia Desginer & Software Architect

Soy diseñador Multimedia cursando una segunda carrera en Ingeniería de Software, me estoy especializando en el desarrollo Backend como arquitecto de software, en este recorrido dia tras dia aprendo tecnologias nuevas.

David Angel Studios es mi marca personal donde mi misión es desarrollar diversos proyectos basado en mi apredizaje de nuevas tecnologias y almacenarlas en mi portafolio personal:

[![Linkedin](https://img.shields.io/badge/Linkedin-4479A1?style=for-the-badge&logo=9gag&label=Angel%20David%20Studios&labelColor=black)](https://www.linkedin.com/in/angeldavidstudios/)
[![Instagram](https://img.shields.io/badge/Instagram-FF0069?style=for-the-badge&logo=instagram&label=Angel%20David%20Studios&labelColor=black)](https://www.instagram.com/angeldavidstudios/) [![Youtube](https://img.shields.io/badge/Angel--David--Studios-FF0000?style=for-the-badge&logo=youtube&label=Youtube.com%2F&labelColor=black)](https://www.youtube.com/channel/UC2VYRq169QluoLeagCYrjVg)
# langlearner

language learner

## Description

This is a simple language learning app. It is a web app that allows users to learn a new language. It is built with React and [Wails](https://wails.io/zh-Hans/docs/introduction).

## screenshot

- [](./docs/img1/app-screenshot1.png)

## 技术栈

- Frontend: React + [FluentUI](https://github.com/microsoft/fluentui)
- Backend: Go + Wails

## ref

- https://wails.io/zh-Hans/docs/introduction
- https://www.creative-tim.com/twcomponents/cheatsheet/
- https://react.fluentui.dev/

## Go Wails

### About

This is the official Wails React-TS template.

You can configure the project by editing `wails.json`. More information about the project settings can be found
here: https://wails.io/docs/reference/project-config

### Live Development

To run in live development mode, run `wails dev` in the project directory. This will run a Vite development
server that will provide very fast hot reload of your frontend changes. If you want to develop in a browser
and have access to your Go methods, there is also a dev server that runs on http://localhost:34115. Connect
to this in your browser, and you can call your Go code from devtools.

### Building

To build a redistributable, production mode package, use `wails build`.

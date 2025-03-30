# SmartRoute - Route Optimization & Intelligence

<p align="center">
  <a href="https://SmartRoute.com" target="_blank" rel="noreferrer">
    <img src="apps/opt-frontend/public/assets/logo_backg.png" alt="SmartRoute Logo" >
  </a>
</p>


Welcome to **SmartRoute** ! A smarter way to plan your transportation routes and optimize travel efficiency using advanced AI algorithms. This project uses modern technologies such as Angular, Spring Boot, Firebase, and machine learning techniques like Genetic Algorithms and Reinforcement Learning to create optimal routes for users.

## Features

- **Real-time route optimization**: Get the best routes in real-time using AI-based algorithms.
- **Interactive UI**: Built with Angular for a seamless and user-friendly experience.
- **Scalable backend**: Powered by Spring Boot, Firebase/MySQL for a robust and scalable system.
- **Smart Planning**: Integration of machine learning for smart transport planning.

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Run the Project](#run-the-project)
- [Tasks](#tasks)
- [Add New Projects](#add-new-projects)
- [Nx Console](#nx-console)
- [Useful Links](#useful-links)

## Getting Started

To get started with Optiroute, clone the repository and follow the setup instructions below.

```sh
git clone https://github.com/OthmaneAbder2303/SmartRoute.git
cd SmartRoute
```

## Install Dependencies

Make sure you have Node.js and Java installed, then install dependencies for both frontend and backend.

For the frontend (Angular):
```sh
cd opt-frontend
npm install
```

For the backend (Spring Boot):
```sh
cd opt-backend
./mvnw clean install
```

## Run the Project

To run the development server for the frontend, use the following command:
```sh
npx nx serve opt-frontend
```

To run the backend (Spring Boot):
```sh
cd opt-backend
./mvnw spring-boot:run
```

The frontend will be available at http://localhost:4200 and the backend API will be running on http://localhost:8080.


## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve opt-frontend
```

To create a production bundle:

```sh
npx nx build opt-frontend
```

To see all available targets to run for a project, run:

```sh
npx nx show project opt-frontend
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/angular:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/angular:lib mylib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)


[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/getting-started/tutorials/angular-monorepo-tutorial?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

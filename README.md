**Yet another "todo" sample**

A minimal Todo app demo and sandbox. Built with Rust, Native Web Components, and Zustand for state management, this app is bundled using Vite with TypeScript support.

## Features

- Add, Edit, and Delete Tasks: Easily manage your tasks with intuitive controls.
- Mark as Complete: Mark tasks as complete to keep track of your progress.
- Persistent State: Using Zustand for state management ensures your tasks are saved.
- Modern Web Components: Leverage the power of Native Web Components for a seamless experience.
- Rust Backend: A robust backend powered by Rust using Tokio and Warp for optimal performance.
- Shoelace UI Library: Utilize Shoelace for modern and customizable UI components.

## Technologies Used

- Rust: For the backend logic and API, using Tokio and Warp.
- Native Web Components: For a modular and reusable front-end.
- Zustand: For state management.
- Vite with TypeScript: For bundling and development.
- Shoelace: For the UI library.
- pnpm: For package management.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or above)
- [Rust](https://www.rust-lang.org/)
- [Vite](https://vitejs.dev/)
- [pnpm](https://pnpm.io/)

### Installation

1.	Clone the repository:
```sh
  git clone https://github.com/kulapoo/todo-web.git
  cd todo-web
```

2.	Install dependencies:

```sh
  pnpm install
```

3. Run the Rust backend:
  Open a separate terminal and navigate to the project directory, then run:
```sh
  cargo run
```

4.	Start the Vite development server:
Open another terminal and navigate to the project directory, then run:
```sh
  pnpm run dev
```


## Project Structure

```sh
todo-web-client/
├── src/
│   ├── pages/
│   │   ├── Login/
│   │   └── Task/
│   │       ├── components/
│   │       │   ├── TaskList.tsx
│   │       │   ├── TaskListItem.tsx
│   │       │   └── TaskDirectory.tsx
│   │       ├── TaskPresenter.ts
│   │       └── TaskService.ts
├── index.html
├── package.json
├── README.md
└── vite.config.ts
```

## Usage

	•	Add a Task: Use the input field to enter a new task and click “Add Task”.
	•	Edit a Task: Click on a task to edit its details.
	•	Delete a Task: Click the delete icon next to a task to remove it.
	•	Mark as Complete: Click the checkbox next to a task to mark it as complete.


The backend API provides a default route /tasks to manage tasks with the following HTTP methods.
(Note that it uses memory as the store)

	•	POST /tasks: Create a new task.
	•	DELETE /tasks/:id: Delete a task by its ID.
	•	PUT /tasks/:id: Update a task by its ID.
	•	PATCH /tasks/:id:/completed Mark a task as completed by its ID.
	•	GET /tasks: Retrieve all tasks.

License

This project is licensed under the MIT License. See the LICENSE file for details.

Feel free to reach out if you have any questions or need further assistance.


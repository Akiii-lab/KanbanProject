
# KanbanProject

KanbanProject is a web application for managing tasks and projects using the Kanban methodology. It allows you to create, view, and move tasks between different states (e.g., Pending, In Progress, Completed) in an intuitive and collaborative way.

Built with [Next.js](https://nextjs.org), TailwindCSS, and SQL Server on Azure.

## Installation & Usage

1. Install dependencies:

```bash
pnpm install
# or npm install, yarn install
```

2. Configure the `.env` file with your SQL Server database credentials.

```bash
DB_SERVER=server.database.windows.net
DB_USER=username
DB_PASSWORD=password
DB_NAME=database_name
DB_PORT=1433
```

3. Start the development server:

```bash
pnpm dev
# or npm run dev, yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

You can edit the UI and logic in the `src/` folder.

## Main Features

- User authentication
- Task creation and editing
- Visual and dynamic Kanban board
- State updates via drag & drop
- Task history and details
- Modern and responsive interface

## Technologies Used

- Next.js
- React
- TailwindCSS
- SQL Server (Azure)

## Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev/)

## Deployment

You can easily deploy the application on [Vercel](https://vercel.com/) or any Node.js-compatible platform.

Check the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

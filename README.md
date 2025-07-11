# My Sequelize App

This project is a Node.js application using Sequelize as an ORM with TypeScript. It provides a structured way to manage users in a database, including functionalities for creating, retrieving, updating, and deleting user records.

## Project Structure

- **src/**: Contains the main application code.
  - **models/**: Defines the database models.
  - **migrations/**: Contains migration files for database schema changes.
  - **seeders/**: Contains seeder files for populating the database with initial data.
  - **config/**: Configuration files, including database settings.
  - **controllers/**: Contains the logic for handling requests.
  - **routes/**: Defines the application routes.
  - **app.ts**: The entry point of the application.

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd my-sequelize-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the database configuration in `src/config/database.ts`.

### Running the Application

To start the application, use the following command:
```
npx ts-node src/app.ts
```

### Running Migrations and Seeders

To run migrations, use:
```
npx sequelize-cli db:migrate
```

To run seeders, use:
```
npx sequelize-cli db:seed:all
```

## License

This project is licensed under the MIT License.
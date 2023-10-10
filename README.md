# sitemate

## Technologies Used

To develop this project, the following technologies and tools were utilized:

- Backend: Express, Zod, Cors
- Frontend: Vite, React, React Query
- Database: Prisma, Sqlite3

## Launching the Application Locally

To run the project on your local machine, please follow the steps below:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/danielbuva/sitemate
   ```
   
2. **Install Dependencies:**

  - Navigate to the server directory:
    ```bash
    cd server
    yarn install
    ```
  - Navigate to the client directory
    ```bash
    cd ../client
    yarn install
    ```
   
3. **Run database migrations:**

  - In the backend directory, execute the follow command:
    ```bash
     npx prisma migrate dev
    ```
  
4. **Start the backend and frontend servers:**

  - In the server directory run:
    ```bash
     yarn dev
    ```
  - In the client directory run:
    ```bash
    yarn dev
    ```
    
5. **Access the application:**

  - Open your web browser and visit http://localhost:5173/ to access the client.

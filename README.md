# MObywatel

## Setup instructions

### Prerequisites

Ensure the following are installed

- [Docker](https://www.docker.com/get-started) (for containerization)
- [Docker Compose](https://docs.docker.com/compose/install/) (for multi-container applications)
- [Git](https://git-scm.com/downloads) (for cloning the repository)
- [Java](https://www.java.com/)

### Installation and Preparation

This is a setup development. For production version go to [Production Deployment Guide](PRODUCTION.md).

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/PandaMisiu/mobywatel
   ```

2. **Navigate to project directory**

   ```bash
   cd mobywatel
   ```

3. **Add the `application.properties` and Oracle Database wallet into `src/main/resources` directory**

4. **Build the project**
   ```bash
   mvn clean install # If you have Maven installed globally
   or
   .\mvnw.cmd clean install # If you don't have Maven installed globally
   ```

- This will build the project and run the tests

5. **Run with Docker**

- Run the following command to build and start the containers:

  ```bash
  docker-compose up
  ```

- This will result in the application being available at:
  - **Main Application (Frontend + API)**: http://localhost (port 80)
  - **Direct API Access**: http://localhost/api/
  - **Swagger UI**: http://localhost/swagger-ui/index.html

The application uses nginx as a reverse proxy to serve both frontend and backend under the same origin, eliminating CORS issues.

## Architecture

The application consists of three main services:

- **Frontend**: React application served by Vite development server
- **Backend**: Spring Boot application with REST API
- **Nginx**: Reverse proxy that routes requests to appropriate services

Nginx configuration:

- Routes `/` to the frontend React application
- Routes `/api/` to the Spring Boot backend
- Routes `/swagger-ui` and API docs to the backend
- All services share the same origin (localhost), preventing CORS issues

## Using Swagger UI

The API is documented using **Swagger UI**, which you can access when the application is running locally:

[http://localhost/swagger-ui/index.html](http://localhost/swagger-ui/index.html)

---

### Step 1: Log In to Set the JWT Cookie

1. Open Swagger UI in your browser at
   `http://localhost/swagger-ui/index.html`.

2. In the top right corner, open the **Select a definition** dropdown and choose the `public` group.
   This group contains endpoints that do **not** require authentication, including `/api/auth/login`.
   ![image](https://github.com/user-attachments/assets/49d97626-819e-4f82-b211-b32cc4f64f55)

3. Locate the `POST /api/auth/login` endpoint, if You don't have account locate the `POST /api/auth/register` and make one.
   ![image](https://github.com/user-attachments/assets/1baa4f8d-29ef-44f9-a125-95b0be3cc140)

4. Click **Try it out**, and provide valid credentials in the request body. Example:

   ```json
   {
     "username": "your-username",
     "password": "your-password"
   }
   ```

   ![image](https://github.com/user-attachments/assets/4b9a062f-94f6-49a1-9bb1-689382c6c027)

5. Click **Execute**.
   If successful, the API sets a cookie named `jwt` in your browser. This cookie contains your JWT token and will be used to authenticate requests to secured endpoints.

**Tip:** You can verify the cookie in your browser via Developer Tools:
`F12 → Application → Cookies → http://localhost`
![image](https://github.com/user-attachments/assets/5e2ed655-4ae3-40ee-944f-c1fa44c7b4ad)

---

### Step 2: Access Secured Endpoints

The API defines two groups of secured endpoints:

- **official** – Requires roles: `ROLE_OFFICIAL` or `ROLE_ADMIN`
  - **Path:** `/api/official/**`

- **admin** – Requires role: `ROLE_ADMIN`
  - **Path:** `/api/admin/**`

- **citizen** – Requires role: `ROLE_CITIZEN` or `ROLE_ADMIN`
    - **Path:** `/api/citizen/**`

With the `jwt` cookie in place, you can now interact with these secured endpoints through Swagger UI.
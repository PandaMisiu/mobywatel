# MObywatel

## Setup instructions

### Prerequisites

Ensure the following are installed
- [Docker](https://www.docker.com/get-started) (for containerization)
- [Docker Compose](https://docs.docker.com/compose/install/) (for multi-container applications)
- [Git](https://git-scm.com/downloads) (for cloning the repository)
- [Java](https://www.java.com/)

### Installation and Preparation

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

- This will result in the server starting at port **8080**


## Using Swagger UI

The API is documented using **Swagger UI**, which you can access when the application is running locally:

[http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

---

### Step 1: Log In to Set the JWT Cookie

1. Open Swagger UI in your browser at
   `http://localhost:8080/swagger-ui/index.html`.

2. In the top right corner, open the **Select a definition** dropdown and choose the `public` group.
   This group contains endpoints that do **not** require authentication, including `/api/auth/login`.
   ![image](https://github.com/user-attachments/assets/49d97626-819e-4f82-b211-b32cc4f64f55)

4. Locate the `POST /api/auth/login` endpoint, if You don't have account locate the `POST /api/auth/register` and make one.
    ![image](https://github.com/user-attachments/assets/1baa4f8d-29ef-44f9-a125-95b0be3cc140)

6. Click **Try it out**, and provide valid credentials in the request body. Example:

   ```json
   {
     "username": "your-username",
     "password": "your-password"
   }
   ```

   ![image](https://github.com/user-attachments/assets/4b9a062f-94f6-49a1-9bb1-689382c6c027)


7. Click **Execute**.
   If successful, the API sets a cookie named `jwt` in your browser. This cookie contains your JWT token and will be used to authenticate requests to secured endpoints.

 **Tip:** You can verify the cookie in your browser via Developer Tools:
`F12 → Application → Cookies → http://localhost:8080`
![image](https://github.com/user-attachments/assets/5e2ed655-4ae3-40ee-944f-c1fa44c7b4ad)

---

### Step 2: Access Secured Endpoints

The API defines two groups of secured endpoints:

* **official** – Requires roles: `ROLE_OFFICIAL` or `ROLE_ADMIN`
    - **Path:** `/api/official/**`

* **admin** – Requires role: `ROLE_ADMIN`
    - **Path:** `/api/admin/**`

With the `jwt` cookie in place, you can now interact with these secured endpoints through Swagger UI.

## Endpoints

### Login and Register

- POST `api/auth/login`
  - request body
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```

    - the password should have at least 8 characters including: lowercase, uppercase, number and symbol

  - response body
    ```json
    {
      "success": "boolean",
      "message": "string",
      "userID": "int"
    }
    ```

    - On success adds a `jwt` cookie

- POST `api/auth/register`
  - request body
    ```json
    {
      "email": "string",
      "password": "string",
      "firstName": "string",
      "lastName": "string",
      "birthDate": "string",
      "PESEL": "string",
      "gender": "string"
    }
    ```

    - Format of birthdate is `YYYY-MM-DD`, and gender is uppercase ("MALE"/"FEMALE")

  - response body
    ```json
    {
      "success": "boolean",
      "message": "string"
    }
    ```

### Admin Module

- GET `api/admin/official?officialID=int`
  - Gets official with specific ID
  - Request has no JSON body
  - response body
    ```json
    {
      "officialID": "int",
      "firstName": "string",
      "lastName": "string",
      "position": "string",
      "email": "string"
    }
    ```

- POST `api/admin/official`
  - request body
    ```json
    {
      "officialID": "int",
      "email": "string",
      "password": "string",
      "firstName": "string",
      "lastName": "string",
      "position": "string"
    }
    ```

    - Creates an Official account

  - response body
    ```json
    {
      "message": "string",
      "successful": "boolean"
    }
    ```

- PUT `api/admin/official`
  - Updated Official account
  - request body
    ```json
    {
      "officialID": "int",
      "email": "string",
      "password": "string",
      "firstName": "string",
      "lastName": "string",
      "position": "string"
    }
    ```

  - response body
    ```json
    {
      "message": "string",
      "successful": "boolean"
    }
    ```

- DELETE `api/admin/official?officialID=int`
  - Deletes Official account with specific ID
  - Request has no JSON body
  - response body
    ```json
    {
      "message": "string",
      "successful": "boolean"
    }
    ```

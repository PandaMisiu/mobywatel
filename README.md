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

## Endpoints

### Login and Register

- POST `api/auth/login`
  - request body
    ```json
    {
      "email": string,
      "password": string
    }
    ```
    
    - the password should have at least 8 characters including: lowercase, uppercase, number and symbol
    
  - response body
    ```json
    {
      "success": boolean,
      "message": message,
      "userID": int
    }
    ```
    
    - On success adds a `jwt` cookie

- POST `api/auth/register`
  - request body
    ```json
    {
      "email": string,
      "password": string,
      "firstName": string,
      "lastName": string,
      "birthDate": string,
      "PESEL": string,
      "gender": string
    }
    ```
    
    - Format of birthdate is `YYYY-MM-DD`, and gender is uppercase ("MALE"/"FEMALE")
    
  - response body
    ```json
    {
      "success": boolean,
      "message": message
    }
    ```

### Admin Module

- GET `api/admin/official?officialID=int`
  - Gets official with specific ID
  - Request has no JSON body
  - response body
    ```json
    {
      "officialID": 1,
      "firstName": string,
      "lastName": string,
      "position": string,
      "email": string
    }
    ```

- POST `api/admin/official`
  - request body
    ```json
    {
      "officialID": int,
      "email": string,
      "password": string,
      "firstName": string,
      "lastName": string,
      "position": string
    }
    ```
    
    - Creates an Official account

  - response body
    ```json
    {
      "message": message,
      "successful": boolean
    }
    ```

- PUT `api/admin/official`
  - Updated Official account
  - request body
    ```json
    {
      "officialID": int,
      "email": string,
      "password": string,
      "firstName": string,
      "lastName": string,
      "position": string
    }
    ```
    
  - response body
    ```json
    {
      "message": message,
      "successful": boolean
    }
    ```
    
- DELETE `api/admin/official?officialID=int`
  - Deletes Official account with specific ID
  - Request has no JSON body
  - response body
    ```json
    {
      "message": message,
      "successful": boolean
    }
    ```
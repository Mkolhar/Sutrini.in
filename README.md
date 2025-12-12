# Sutrini Studio - Full-Stack E-Commerce Platform

Sutrini Studio is a modern, full-stack web application designed for custom embroidery and e-commerce. It features a robust Spring Boot backend with MongoDB and a dynamic Next.js frontend with TailwindCSS.

## 🚀 Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.1
- **Language**: Java 17
- **Database**: MongoDB
- **Security**: Spring Security + JWT
- **Documentation**: SpringDoc OpenAPI (Swagger UI)
- **Payment**: Stripe API
- **Build Tool**: Maven

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Library**: React 18
- **Language**: TypeScript
- **Styling**: TailwindCSS, Radix UI, Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React

---

## 🛠 Prerequisites

Before running the project on **Windows, macOS, or Linux**, ensure you have the following installed:

1.  **Java Development Kit (JDK) 17**
    *   *Required for Backend.*
    *   [Download JDK 17 (Amazon Corretto)](https://docs.aws.amazon.com/corretto/latest/corretto-17-ug/downloads-list.html) or [Adoptium](https://adoptium.net/temurin/releases/?version=17).
    *   **Verify**: Run `java -version` in your terminal. Result should mention version 17.

2.  **Node.js (LTS Version 20+)**
    *   *Required for Frontend.*
    *   [Download Node.js](https://nodejs.org/en/download/).
    *   **Verify**: Run `node -v` (should be v20.x.x) and `npm -v`.

3.  **Maven (Apache Maven)**
    *   *Required to build the Backend.*
    *   [Download Maven](https://maven.apache.org/download.cgi).
    *   On **Windows**: Extract zip, add `bin` folder to your PATH environment variable.
    *   On **Mac**: `brew install maven`
    *   **Verify**: Run `mvn -v`.

4.  **MongoDB**
    *   *Database.*
    *   **Option A (Recommended)**: Use Docker. [Install Docker Desktop](https://www.docker.com/products/docker-desktop/).
    *   **Option B**: Install [MongoDB Community Server](https://www.mongodb.com/try/download/community) locally.

---

## 📥 Installation & Setup Steps

Clone the repository:
```bash
git clone <your-repo-url>
cd Sutrini.in
```

### 1. Database Setup (MongoDB)

You need a running MongoDB instance listening on port `27017`.

**Using Docker (Easiest)**:
Open a terminal in the project root (where `docker-compose.yml` is) and run:
```bash
docker-compose up -d
```
This will start MongoDB in the background.

**Using Local Install**:
Start the MongoDB service manually via your OS services or terminal (e.g., `brew services start mongodb-community` on Mac, or via Services on Windows).


### 2. Database Seeding (Optional)

To populate the database with dummy product data, use the provided seed script.

**Prerequisite**: You need `mongosh` (MongoDB Shell) installed.

Run from the project root:
```bash
mongosh localhost:27017/sutrini backend/scripts/seed_db.js
```
*Successfully seeded data will print: "Seeding completed..."*

### 3. Backend Setup


The backend configuration is located in `backend/src/main/resources/application.properties`.

**Steps:**
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  (Optional) Update `application.properties` if your MongoDB is not on `localhost:27017` or if you have a real Stripe Key.
3.  Clean and Install dependencies:
    ```bash
    mvn clean install
    ```
4.  Run the application:
    ```bash
    mvn spring-boot:run
    ```

> **Note**: The backend will start on **port 8081**.
> You should see logs indicating "Started SutriniApplication in ... seconds".

### 4. Frontend Setup


**Steps:**
1.  Open a new terminal window and navigate to the frontend:
    ```bash
    cd frontend
    ```
2.  Install Node dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```

> **Note**: The frontend will start on **http://localhost:3000**.

---

### 6. Accessing the Application


Once both servers are running:

- **Frontend (UI)**: [http://localhost:3000](http://localhost:3000)
- **Backend API Docs (Swagger)**: [http://localhost:8081/swagger-ui.html](http://localhost:8081/swagger-ui.html)
- **API Spec (JSON)**: [http://localhost:8081/api-docs](http://localhost:8081/api-docs)

---

### 7. Configuration & Environment Variables


### Backend (`application.properties`)
You can override these by setting system environment variables or modifying the file.

| Variable | Default | Description |
| :--- | :--- | :--- |
| `SERVER_PORT` | `8081` | Port for the backend server |
| `MONGODB_URI` | `mongodb://localhost:27017/sutrini` | Connection string for MongoDB |
| `JWT_SECRET` | *(Internal default)* | Secret key for signing tokens |
| `stripe.api.key` | `sk_test_...` | Stripe Secret Key for payments |

### Frontend
Create a `.env.local` file in the `frontend/` directory if you need to override API URLs.

```bash
# Example frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8081
```

*(Note: The current code may expect the backend at localhost:8081 by default)*

---

### 8. Troubleshooting


**1. "Port 8081 is already in use"**
*   **Solution**: Kill the process using the port.
    *   **Windows**: `netstat -ano | findstr :8081` then `taskkill /PID <PID> /F`
    *   **Mac/Linux**: `lsof -i :8081` then `kill -9 <PID>`

**2. "Connection refused: connect" (MongoDB)**
*   Ensure MongoDB is running (`docker ps` or check services).
*   Check if the Connection URI in `application.properties` matches your setup.

**3. "Java version mismatch"**
*   Ensure `java -version` says "17". If you have multiple versions, check your `JAVA_HOME` environment variable.

**4. Maven "BUILD FAILURE"**
*   Check if `backend/pom.xml` exists in the current directory.
*   Run `mvn clean` to clear old artifacts.

## 📜 Version History

- **v0.3.1** (2025-12-12)
    - Fixed Admin Product Deletion issue by replacing native `window.confirm` with Shadcn `AlertDialog`.
    - Improved UX for delete confirmation.
- **v0.3.0** (2025-12-12)
    - Fixed Product Catalog "Error Loading Products" by resolving CORS conflicts in Backend Controllers.
    - Updated `next.config.mjs` to allow external image domains (`images.unsplash.com`, `via.placeholder.com`).
    - Verified End-to-End Data Flow: Admin Product Creation -> API -> Consumer View.
- **v0.2.0** (2025-12-12)
    - Rebased `main` branch with `master`.
    - Removed Lombok dependency to resolve build issues with Java 24 (`TypeTag :: UNKNOWN` error).
    - Refactored all Models and DTOs to use manual Getters/Setters/Constructors.
    - Updated `SecurityConfig` and added `WebConfig` to strictly enable CORS for frontend (`http://localhost:3000`).
    - Fixed frontend build issues (missing `autoprefixer`).
- **v0.1.0** (2025-12-12)
    - Added comprehensive setup instructions (Prerequisites, Backend, Frontend, Docker).
    - Documented Tech Stack and Troubleshooting steps.
    - Extracted hardcoded API and Stripe keys to environment files.
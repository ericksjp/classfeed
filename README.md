# Classfeed
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Running the Project

### Required Software
- Docker
- Git

### Step 1 - Clone the Repository

```bash
git clone https://github.com/ericksjp/classfeed
cd classfeed
```

### Step 2 - Set Up the .env File

To configure the server, you need to create a `.env` file based on the provided `.env.example` template. Follow the instructions below for your operating system:

#### Linux/macOS:
```bash
cd server
cp .env.example .env
```

#### Windows:
```powershell
cd server
Copy-Item .env.example .env
```

After copying the file, open the newly created `.env` file and update the configuration settings as required for your environment.

### Step 3 - Running Docker

To build the images and run the containers, navigate to the directory containing the Docker Compose files. If you are in the `server` folder, first navigate back to the root directory:

```bash
cd ..
```

#### Development Build
To run the project using the development build, execute the following command:

```bash
docker-compose -f docker-compose.dev.yaml up --build
```

#### Production Build (Unstable at This Moment)
To run the project using the production build, execute the following command:

```bash
docker-compose -f docker-compose.prod.yaml up --build
```

### Additional Information

- Ensure Docker is running before executing the Docker commands.

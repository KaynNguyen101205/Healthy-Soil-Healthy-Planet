# Healthy Soil, Healthy Planet 

**Healthy Soil, Healthy Planet** is a full-stack environmental data platform designed to visualize and track erosion rates across the United States. The project integrates interactive tools including a chatbot, data-driven graphs, a community forum, and a dynamic erosion map.

## 🚀 Features

- **📈 Erosion Rate Graphs:**  
  Visualize erosion data stored in a PostgreSQL database using dynamic graphs.

- **🗺️ Erosion Map – Leetfleet:**  
  An interactive map showing erosion rates for all 50 U.S. states.

- **💬 AI-Powered Chatbot:**  
  Custom chatbot to answer user queries using pre-defined data or dynamic APIs.

- **🌐 Community Forum:**  
  Lightweight Reddit-style forum with upvote, comment, and search functionality.

- **🖥️ Frontend:**  
  Fully responsive UI built with **HTML**, **CSS**, and **JavaScript**.

## 🧰 Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Python (FastAPI)  
- **Database:** PostgreSQL  
- **DevOps:** GitHub Actions (CI/CD), Docker, Minikube (Kubernetes)

## 🔧 Project Architecture

```
Frontend (HTML/CSS/JS)
        |
        v
Backend (FastAPI) <---> PostgreSQL
        |
        v
 Chatbot API   Graph API   Forum API   Map API
        |
        v
    Kubernetes (Minikube)
        |
        v
 GitHub Actions CI/CD Pipeline
```

## 🐳 Deployment

The project is containerized and deployed using **Docker** and **Minikube** for local Kubernetes orchestration. CI/CD is automated with **GitHub Actions**.

### To Run Locally

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/ocean-prj.git
   cd ocean-prj
   ```

2. **Start Minikube:**
   ```bash
   minikube start
   ```

3. **Build Docker Images:**
   ```bash
   eval $(minikube docker-env)
   docker build -t ocean-frontend ./frontend
   docker build -t ocean-backend ./backend
   ```

4. **Deploy to Kubernetes:**
   ```bash
   kubectl apply -f k8s/
   ```

5. **Access the App:**
   ```bash
   minikube service ocean-frontend-service
   ```

### CI/CD with GitHub Actions

- Every push to `main` triggers:
  - Lint and test workflows
  - Docker image build and push (if using Docker Hub)
  - Kubernetes deployment (if configured)

## 📂 Project Structure

```
.
├── backend/              # FastAPI backend (chatbot, forum, graph APIs)
├── frontend/             # Static HTML/CSS/JS frontend
├── k8s/                  # Kubernetes manifests (deployment, service)
├── .github/workflows/    # GitHub Actions CI/CD pipelines
├── database/             # PostgreSQL schema and data scripts
├── README.md             # You’re here!
```

## 📍 Future Improvements

- Add user authentication to the forum  
- Implement real-time chatbot responses via WebSocket  
- Expand map with interactive filters  
- Improve accessibility and mobile responsiveness

## 🧑‍💻 Author

**Nam Khanh Nguyen**  
Project Lead and Full-Stack Developer

---

> “Built to raise awareness through data, visualization, and interaction.” 🌍

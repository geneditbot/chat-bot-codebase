# GenEDIt
A LLM based chatbot that supports educators to integrate EDI principles in their ICT lesson plans. 

## Technologies
- **Backend** - FastAPI Python web framework
- **Frontend** - React
- **Database** - MySQL

## Prerequisites 
- Python installed in your machine
- Node.js installed in your machine
- OpenAI API key
- MySQL Databse

## Environment Variables
- OPENAI_API_KEY : Your OpenAI API key

- DB_HOST : Hostname of the database
- DB_NAME : Name of the database
- DB_USER : User of the database
- DB_PASSWORD : Password of the database
- DB_PORT : Port of the database (default: `3306`)

## Execution Instructions
1. Clone the repository
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```
2. Activate virtual environment
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate # On Windows
   ```
3. Install python packages and libraries
   ```bash
   pip install -r requirements.txt
   ```
4. Start backend
   ```bash
   uvicorn app.app:app 
   ```
   Backend will run at: http://127.0.0.1:8000
5. Start frontend
   ```bash
   cd ..
   cd frontend
   npm run dev
   ```
   Frontend will run at: http://localhost:5173
6. Access the application
   - Open your browser and go to http://localhost:5173

## Resources
- System prompt - https://github.com/geneditbot/chat-bot-codebase/blob/main/SystemPrompt.txt
- GenEDIt Demo - https://github.com/geneditbot/chat-bot-codebase/blob/main/GenEDIt_Demo.mp4

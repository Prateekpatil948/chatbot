# Chatbot for Banking System  Web App

This is a simple web application that provides answers to frequently asked questions (FAQs) for a bank. It uses a combination of Python (Flask) and Node.js for backend services, with a Bootstrap-based frontend.

## Features

- Web interface with FAQ content
- CSV file (`BankFAQs.csv`) for storing questions and answers
- API server in Node.js (`apiserver.mjs`)
- Frontend built using Bootstrap and custom JS/CSS
- Templates rendered using a Python web framework

## Project Structure

```
Project/
├── apiserver.mjs             # Node.js API server script
├── BankFAQs.csv              # CSV containing FAQ data
├── main.py                   # Python backend (possibly Flask)
├── static/                   # Static frontend assets
│   ├── css/
│   └── js/
├── templates/                # HTML templates
│   ├── home.html
│   └── index.html
```

## Getting Started

### Prerequisites

- Python 3.x
- Node.js (for running `apiserver.mjs`)
- pip (Python package manager)

### Install Dependencies

```bash
pip install flask  # or the appropriate framework used
```

### Run the Python App

```bash
python main.py
```

### Run the API Server

```bash
node apiserver.mjs
```

Then open your browser at `http://localhost:5000` (or as configured).

## Notes

- Ensure both backend services (Python and Node.js) are running simultaneously if integrated.
- Customize the `BankFAQs.csv` file to update FAQs.

## License

This project is open-source and available under the MIT License.

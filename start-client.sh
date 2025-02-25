#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Запуск клиентской части приложения Склад ===${NC}"

# Проверка наличия Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js не установлен. Пожалуйста, установите Node.js (версия 14.x или выше).${NC}"
    exit 1
fi

# Проверка версии Node.js
NODE_VERSION=$(node -v | cut -d 'v' -f 2)
NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d '.' -f 1)

if [ $NODE_MAJOR_VERSION -lt 14 ]; then
    echo -e "${RED}Требуется Node.js версии 14.x или выше. Текущая версия: $NODE_VERSION${NC}"
    exit 1
fi

echo -e "${GREEN}Node.js версии $NODE_VERSION обнаружен${NC}"

# Проверка наличия директории client
if [ ! -d "client" ]; then
    echo -e "${YELLOW}Директория client не найдена. Создание...${NC}"
    mkdir -p client
    
    # Инициализация проекта React, если директория была создана
    echo -e "${YELLOW}Инициализация клиентского приложения React...${NC}"
    cd client
    
    # Создание package.json
    cat > package.json << EOF
{
  "name": "sklad-client",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.3.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.9.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "proxy": "http://localhost:5001"
}
EOF
    
    # Создание базовой структуры
    mkdir -p src/components src/pages src/services src/utils
    
    # Создание базового App.js
    cat > src/App.js << EOF
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Склад</h1>
        <p>Система управления складом и учета рабочего времени</p>
      </header>
      <main>
        <p>Клиентское приложение в разработке</p>
      </main>
    </div>
  );
}

export default App;
EOF
    
    # Создание базового CSS
    cat > src/App.css << EOF
.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  min-height: 20vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

main {
  padding: 20px;
}
EOF
    
    # Создание index.js
    cat > src/index.js << EOF
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF
    
    # Создание index.css
    cat > src/index.css << EOF
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
EOF
    
    # Создание public/index.html
    mkdir -p public
    cat > public/index.html << EOF
<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Система управления складом и учета рабочего времени"
    />
    <title>Склад</title>
  </head>
  <body>
    <noscript>Для работы приложения необходимо включить JavaScript.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF
    
    cd ..
    echo -e "${GREEN}Базовая структура клиентского приложения создана${NC}"
fi

# Переход в директорию клиента
cd client

# Проверка наличия файла package.json
if [ ! -f "package.json" ]; then
    echo -e "${RED}Файл package.json не найден в директории client.${NC}"
    exit 1
fi

echo -e "${YELLOW}Установка зависимостей клиента...${NC}"
npm install

# Проверка успешности установки
if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка при установке зависимостей клиента.${NC}"
    exit 1
fi

echo -e "${GREEN}Зависимости клиента успешно установлены${NC}"
echo -e "${GREEN}Запуск клиентского приложения...${NC}"
echo -e "${YELLOW}Клиентское приложение будет доступно по адресу: http://localhost:3000${NC}"
echo -e "${YELLOW}Для остановки приложения нажмите Ctrl+C${NC}"

# Запуск клиентского приложения
npm start 
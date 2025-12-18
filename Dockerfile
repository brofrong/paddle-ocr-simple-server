# Используем официальный образ Bun
FROM oven/bun:1 AS base

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package.json bun.lock ./

# Устанавливаем зависимости
RUN bun install --frozen-lockfile

# Копируем исходный код
COPY . .

# Экспортируем порт (по умолчанию Hono использует 3000)
EXPOSE 3000

# Запускаем приложение
CMD ["bun", "run", "src/index.ts"]


import { type Context, Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { logger } from "hono/logger";
import { PaddleOcrService } from "ppu-paddle-ocr";

const app = new Hono();
app.use(logger());

const service = new PaddleOcrService();
await service.initialize();

app.get("/", (c: Context) => {
	return c.text("Hello Hono!");
});

app.post(
	"/recognize",
	bodyLimit({
		maxSize: 10 * 1024 * 1024, // 10MB
	}),
	async (c: Context) => {
		// Получаем multipart form данные
		const formData = await c.req.formData();

		// Проверяем наличие поля 'img'
		const imgFile = formData.get("img");

		if (!imgFile) {
			return c.json({ error: 'Field "img" is missing in the request' }, 400);
		}

		// Проверяем, что это файл (File объект)
		if (!(imgFile instanceof File)) {
			return c.json({ error: 'Field "img" must contain a file' }, 400);
		}

		// Проверяем тип файла (должно быть изображение)
		const allowedTypes = [
			"image/jpeg",
			"image/jpg",
			"image/png",
			"image/gif",
			"image/webp",
		];
		if (!allowedTypes.includes(imgFile.type)) {
			return c.json(
				{
					error: `Unsupported file type. Allowed types: ${allowedTypes.join(", ")}`,
				},
				400,
			);
		}

		if (imgFile.size === 0) {
			return c.json({ error: "File is empty" }, 400);
		}

		// Конвертируем файл в Buffer для дальнейшей обработки
		const arrayBuffer = await imgFile.arrayBuffer();
		const result = await service.recognize(arrayBuffer);
		return c.json(result);
	},
);

export default app;

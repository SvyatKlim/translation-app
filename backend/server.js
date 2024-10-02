import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors'; // Импортируем cors
import * as deepl from 'deepl-node';

dotenv.config();  // Подгружаем переменные из .env

const app = express();
const port = 3000;
const translator = new deepl.Translator(process.env.DEEPL_API_KEY);

app.use(cors({
    origin: 'http://localhost:5173', // Укажите ваш фронтенд-адрес
}));app.use(express.json());
app.post('/translate', async (req, res) => {
    const { text, target_lang } = req.body;
    // Проверка на пустые строки
    // if (!text || (Array.isArray(text) && text.length === 0) || (typeof text === 'string' && text.trim() === '')) {
    //     return res.status(400).json({ error: 'Параметр "text" должен быть непустой строкой или массивом непустых строк.' });
    // }

    try {
        const result = await translator.translateText(text, null, target_lang);
        res.json(result.text);
    } catch (error) {
        console.error('Ошибка при переводе:', error.message); // Выводим сообщение об ошибке
        res.status(500).json({ error: 'Ошибка при запросе к API DeepL', details: error.message }); // Отправляем клиенту сообщение об ошибке
    }
});


app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});


import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import cors from 'cors';
import fs from 'fs/promises';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;
// const uri = 'mongodb+srv://333olegovich333:SeXhDcPC90OEN7xr@cluster0.k2elk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);
const db = client.db('todoDB');
const todosCollection = db.collection('todos');


client.connect()
    .then(() => {
        console.log('!!! Підключено до MongoDB Atlas');
    })
    .catch(err => {
        console.error('!!! Помилка підключення до MongoDB:', err);
    });

const app = express();
const port = process.env.PORT || 5555;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors());
app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.json());

app.get('/todos', (req, res) => {

    todosCollection.find().toArray()
        .then(todos => {
            res.json({ message: 'Задачі зчитано з бази!', todos });
        })
        .catch(err => {
            console.error('Помилка при отриманні задач:', err);
            res.status(500).json({ error: 'Помилка сервера' });
        });
});



app.post('/todos', (req, res) => {
    const tasks = req.body;
    if (!Array.isArray(tasks)) {
        return res.status(400).json({ error: 'Некоректний формат даних' });
    }
    todosCollection.deleteMany({})
        .then(() => todosCollection.insertMany(tasks))
        .then(() => {
            res.json({ message: 'Задачі збережено!', todos: tasks });
        })
        .catch(error => {
            console.error('Помилка при збереженні задач:', error);
            res.status(500).json({ error: 'Помилка сервера' });
        });
});


app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;

    todosCollection.deleteOne({ id })
        .then(result => {
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Задачу не знайдено' });
            }
            res.json({ message: 'Задачу видалено' });
        })
        .catch(error => {
            console.error('Помилка при видаленні:', error);
            res.status(500).json({ error: 'Помилка сервера' });
        });
});


app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { isDone } = req.body;

    todosCollection.updateOne(
        { id },
        { $set: { isDone } }
    )
        .then(result => {
            if (result.matchedCount === 0) {
                return res.status(404).json({ error: 'Задачу не знайдено' });
            }
            res.json({ message: 'Задачу оновлено', id, isDone });
        })
        .catch(error => {
            console.error('Помилка при оновленні:', error);
            res.status(500).json({ error: 'Помилка сервера' });
        });
});



app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});


app.listen(port, () => {
    console.log('hi' + ' ' + port);
})
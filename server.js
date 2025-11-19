const express = require('express');
const app = express();
const PORT = 3000;

// Middleware: Nos permite entender datos JSON que vengan del navegador
app.use(express.json());
// Middleware: Sirve los archivos estáticos (HTML, CSS, JS) desde una carpeta "public"
app.use(express.static('public'));

// Simulación de base de datos (un arreglo en memoria por ahora)
let tareas = [
    { id: 1, texto: "Comprar pañales para el bebé", completada: false },
    { id: 2, texto: "Estudiar Node.js", completada: true }
];

// RUTA 1: Obtener todas las tareas (GET)
app.get('/api/tareas', (req, res) => {
    res.json(tareas);
});

// RUTA 2: Crear una tarea nueva (POST)
app.post('/api/tareas', (req, res) => {
    const nuevaTarea = {
        id: tareas.length + 1,
        texto: req.body.texto,
        completada: false
    };
    tareas.push(nuevaTarea);
    res.json(nuevaTarea);
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
const express = require('express');
const fs = require('fs'); // <--- AÑADIDO: MÓDULO FS PARA PERSISTENCIA
const app = express();
const PORT = 3000;

// Archivo de almacenamiento
const TAREAS_FILE = 'tareas.json';

// Función para leer las tareas del archivo
const leerTareas = () => {
    try {
        const data = fs.readFileSync(TAREAS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Si el archivo no existe o está vacío, iniciamos con un arreglo vacío
        return []; 
    }
};

// Función para guardar las tareas en el archivo
const guardarTareas = (data) => {
    fs.writeFileSync(TAREAS_FILE, JSON.stringify(data, null, 2), 'utf8');
};

// Inicializamos las tareas leyendo el archivo.
// Esto reemplaza la simulación en memoria anterior.
let tareas = leerTareas();

// Middleware: Nos permite entender datos JSON que vengan del navegador
app.use(express.json());
// Middleware: Sirve los archivos estáticos (HTML, CSS, JS) desde una carpeta "public"
app.use(express.static('public'));

// RUTA 1: Obtener todas las tareas (GET)
app.get('/api/tareas', (req, res) => {
    res.json(tareas);
});

// RUTA 2: Crear una tarea nueva (POST) - AÑADIDO: GUARDAR AL DISCO
app.post('/api/tareas', (req, res) => {
    const nuevaTarea = {
        // Nueva lógica para ID: garantiza que el ID sea mayor al último ID existente
        id: tareas.length > 0 ? tareas[tareas.length - 1].id + 1 : 1, 
        texto: req.body.texto,
        completada: false
    };
    tareas.push(nuevaTarea);
    guardarTareas(tareas); // <--- ACCIÓN CLAVE: GUARDAR
    res.json(nuevaTarea);
});

// RUTA 3: Marcar/Desmarcar una tarea (PUT) - AÑADIDO: GUARDAR AL DISCO
app.put('/api/tareas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const tareaIndex = tareas.findIndex(t => t.id === id);

    if (tareaIndex !== -1) {
        // Invertir el estado (true -> false, o false -> true)
        tareas[tareaIndex].completada = !tareas[tareaIndex].completada;
        guardarTareas(tareas); // <--- ACCIÓN CLAVE: GUARDAR
        res.json(tareas[tareaIndex]);
    } else {
        res.status(404).send({ mensaje: "Tarea no encontrada" });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
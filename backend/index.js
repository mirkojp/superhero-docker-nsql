const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const seedHeroes = require('./seedHeroes');

const app = express();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(file.originalname.split('.').pop().toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only JPEG, JPG, and PNG images are allowed'));
    }
});

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://mongo:27017/superheroes', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    seedHeroes(false); // Use force=false to avoid reseeding if data exists
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

const Superhero = require('./models/Superhero');

// Routes
app.get('/api/superheroes', async (req, res) => {
    const { house } = req.query;
    const filter = house ? { house } : {};
    const superheroes = await Superhero.find(filter);
    // Convert image buffers to base64
    const superheroesWithBase64 = superheroes.map(hero => ({
        ...hero._doc,
        images: hero.images.map(img => ({
            data: img.data.toString('base64'),
            contentType: img.contentType
        })),
        yearOfFirstAppearance: hero.yearOfFirstAppearance
    }));
    res.json(superheroesWithBase64);
});

app.get('/api/superheroes/:id', async (req, res) => {
    try {
        const superhero = await Superhero.findById(req.params.id);
        if (!superhero) return res.status(404).json({ error: 'Superhero not found' });
        // Convert image buffers to base64
        const superheroWithBase64 = {
            ...superhero._doc,
            images: superhero.images.map(img => ({
                data: img.data.toString('base64'),
                contentType: img.contentType
            })),
            yearOfFirstAppearance: superhero.yearOfFirstAppearance
        };
        res.json(superheroWithBase64);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/superheroes', upload.array('images', 5), async (req, res) => {
    try {
        const { name, realName, house, biography, abilities, yearOfFirstAppearance } = req.body;
        if (!req.files || req.files.length < 1) {
            return res.status(400).json({ error: 'At least 1 image is required' });
        }
        if (req.files.length > 5) {
            return res.status(400).json({ error: 'Maximum 5 images allowed' });
        }
        const images = req.files.map(file => ({
            data: file.buffer,
            contentType: file.mimetype
        }));
        const superhero = new Superhero({
            name,
            realName,
            house,
            biography,
            abilities: abilities.split(',').map(item => item.trim()),
            images,
            yearOfFirstAppearance: parseInt(yearOfFirstAppearance)
        });
        await superhero.save();
        res.status(201).json(superhero);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/superheroes/:id', upload.array('images', 5), async (req, res) => {
    try {
        const { name, realName, house, biography, abilities, yearOfFirstAppearance } = req.body;
        if (!yearOfFirstAppearance) {
            return res.status(400).json({ error: 'Year of first appearance is required' });
        }
        const newImages = req.files ? req.files.map(file => ({
            data: file.buffer,
            contentType: file.mimetype
        })) : [];
        if (newImages.length > 5) {
            return res.status(400).json({ error: 'Maximum 5 images allowed' });
        }

        // Fetch the existing superhero
        const superhero = await Superhero.findById(req.params.id);
        if (!superhero) return res.status(404).json({ error: 'Superhero not found' });

        // Update images: remove specified images and append new ones
        let updatedImages = [...superhero.images]; // Start with existing images
        const removeImages = req.body.removeImages
            ? (Array.isArray(req.body.removeImages)
                ? req.body.removeImages.map(idx => parseInt(idx))
                : [parseInt(req.body.removeImages)])
            : [];
        if (removeImages.length > 0) {
            updatedImages = updatedImages.filter((_, index) => !removeImages.includes(index));
        }
        updatedImages = [...updatedImages, ...newImages];

        // Validate image count
        if (updatedImages.length < 1) {
            return res.status(400).json({ error: 'At least 1 image is required' });
        }
        if (updatedImages.length > 5) {
            return res.status(400).json({ error: 'Maximum 5 images allowed' });
        }

        // Validate each image object
        updatedImages = updatedImages.map(img => ({
            data: img.data || Buffer.from(''), // Default to empty buffer if undefined
            contentType: img.contentType || 'image/jpeg' // Default content type
        }));

        const updateData = {
            name,
            realName,
            house,
            biography,
            abilities: abilities.split(',').map(item => item.trim()),
            images: updatedImages,
            yearOfFirstAppearance: parseInt(yearOfFirstAppearance)
        };

        const updatedSuperhero = await Superhero.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedSuperhero) return res.status(404).json({ error: 'Superhero not found' });

        // Convert image buffers to base64 for the response
        const superheroWithBase64 = {
            ...updatedSuperhero._doc,
            images: updatedSuperhero.images.map(img => ({
                data: img.data.toString('base64'),
                contentType: img.contentType
            })),
            yearOfFirstAppearance: updatedSuperhero.yearOfFirstAppearance
        };
        res.json(superheroWithBase64);
    } catch (err) {
        console.error('Error in PUT /api/superheroes/:id:', err);
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/superheroes/:id', async (req, res) => {
    try {
        const superhero = await Superhero.findByIdAndDelete(req.params.id);
        if (!superhero) return res.status(404).json({ error: 'Superhero not found' });
        res.json({ message: 'Superhero deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => console.log('Backend running on port 5000'));
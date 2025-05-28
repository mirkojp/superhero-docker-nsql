import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';


/// No tengo idea por que, pero si borro este archivo deja de andar todo :D



const SuperheroForm = ({ setSuperheroes }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: '',
        realName: '',
        house: '',
        biography: '',
        abilities: ''
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(isEdit);

    useEffect(() => {
        if (isEdit) {
            const fetchSuperhero = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/superheroes/${id}`);
                    if (!response.ok) throw new Error('Failed to fetch');
                    const data = await response.json();
                    setFormData({
                        name: data.name,
                        realName: data.realName || '',
                        house: data.house,
                        biography: data.biography,
                        abilities: data.abilities.join(', ')
                    });
                    setLoading(false);
                } catch (error) {
                    toast.error('Error fetching superhero');
                    setLoading(false);
                }
            };
            fetchSuperhero();
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', formData.name);
        form.append('realName', formData.realName);
        form.append('house', formData.house);
        form.append('biography', formData.biography);
        form.append('abilities', JSON.stringify(formData.abilities.split(',').map(a => a.trim()).filter(a => a)));
        for (let i = 0; i < images.length; i++) {
            form.append('images', images[i]);
        }

        try {
            const url = isEdit
                ? `http://localhost:5000/api/superheroes/${id}`
                : 'http://localhost:5000/api/superheroes';
            const method = isEdit ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                body: form
            });
            if (!response.ok) throw new Error('Failed to save superhero');
            const data = await response.json();
            setSuperheroes(prev => isEdit ? prev.map(h => h._id === data._id ? data : h) : [...prev, data]);
            toast.success(isEdit ? 'Superhero updated' : 'Superhero created');
            navigate('/');
        } catch (error) {
            toast.error('Error saving superhero');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            <Link to="/" className="text-blue-500 hover:underline mb-4 block">
                Back to Home
            </Link>
            <h1 className="text-3xl font-bold mb-4">{isEdit ? 'Edit Superhero' : 'Add Superhero'}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Real Name</label>
                    <input
                        type="text"
                        name="realName"
                        value={formData.realName}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">House</label>
                    <input
                        type="text"
                        name="house"
                        value={formData.house}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Biography</label>
                    <textarea
                        name="biography"
                        value={formData.biography}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Abilities (comma-separated)</label>
                    <input
                        type="text"
                        name="abilities"
                        value={formData.abilities}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Images (up to 5)</label>
                    <input
                        type="file"
                        name="images"
                        accept="image/jpeg,image/png"
                        multiple
                        onChange={handleImageChange}
                        className="w-full border rounded p-2"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    {isEdit ? 'Update Superhero' : 'Add Superhero'}
                </button>
            </form>
        </div>
    );
};

export default SuperheroForm;
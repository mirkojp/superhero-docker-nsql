import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const AddSuperhero = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        realName: '',
        house: 'Marvel', // Default to Marvel
        biography: '',
        abilities: '',
        yearOfFirstAppearance: ''
    });
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files).slice(0, 5); // Limit to 5 images
        if (files.length < 1) {
            alert('At least 1 image is required');
            return;
        }
        setImages(files);

        // Generate previews for new images
        const previews = [];
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                previews.push(reader.result);
                if (previews.length === files.length) {
                    setPreviewImages(previews);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (images.length < 1 || images.length > 5) {
            alert('Please upload between 1 and 5 images');
            return;
        }
        const form = new FormData();
        form.append('name', formData.name);
        form.append('realName', formData.realName);
        form.append('house', formData.house);
        form.append('biography', formData.biography);
        form.append('abilities', formData.abilities);
        form.append('yearOfFirstAppearance', formData.yearOfFirstAppearance);
        for (let i = 0; i < images.length; i++) {
            form.append('images', images[i]);
        }

        try {
            const response = await fetch(`http://localhost:5000/api/superheroes`, {
                method: 'POST',
                body: form
            });
            if (response.ok) {
                navigate('/');
            } else {
                const errorData = await response.json();
                alert(`Failed to add superhero: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error adding superhero:', error);
            alert('Error adding superhero');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-gray-300">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <div className="flex-1 container mx-auto p-6">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Add New Superhero</h1>
                <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
                        {/* New Images Preview */}
                        {previewImages.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-700 mb-4">Images to Upload</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {previewImages.map((preview, index) => (
                                        <div key={index} className="relative w-full h-48 bg-black rounded-lg flex items-center justify-center shadow-md">
                                            <img
                                                src={preview}
                                                alt={`New image ${index + 1}`}
                                                className="h-full w-full object-contain rounded-lg"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-gray-700 font-semibold">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">Real Name</label>
                            <input
                                type="text"
                                name="realName"
                                value={formData.realName}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">House</label>
                            <select
                                name="house"
                                value={formData.house}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="Marvel">Marvel</option>
                                <option value="DC">DC</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">Biography</label>
                            <textarea
                                name="biography"
                                value={formData.biography}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">Abilities (comma-separated)</label>
                            <input
                                type="text"
                                name="abilities"
                                value={formData.abilities}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">Year of First Appearance</label>
                            <input
                                type="number"
                                name="yearOfFirstAppearance"
                                value={formData.yearOfFirstAppearance}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                min="1900"
                                max="2025"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">Images (1-5 required)</label>
                            <input
                                type="file"
                                name="images"
                                accept="image/jpeg,image/png"
                                multiple
                                onChange={handleImageChange}
                                className="w-full border rounded-lg p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="text-center">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition shadow-md"
                            >
                                Add Superhero
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default AddSuperhero;
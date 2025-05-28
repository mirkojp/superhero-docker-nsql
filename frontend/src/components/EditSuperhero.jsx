import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const EditSuperhero = () => {
  const { id } = useParams();
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
  const [existingImages, setExistingImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuperhero = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/superheroes/${id}`);
        const data = await response.json();
        setFormData({
          name: data.name || '',
          realName: data.realName || '',
          house: data.house || 'Marvel', // Default to Marvel if not present
          biography: data.biography || '',
          abilities: data.abilities ? data.abilities.join(', ') : '',
          yearOfFirstAppearance: data.yearOfFirstAppearance || ''
        });
        setExistingImages(data.images || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching superhero:', error);
        setLoading(false);
      }
    };
    fetchSuperhero();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5); // Limit to 5 images
    if (files.length > 5 - (existingImages.length - imagesToRemove.length)) {
      alert('Maximum 5 images allowed (including existing)');
      return;
    }
    if (files.length < 1 && existingImages.length - imagesToRemove.length < 1) {
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

  const handleRemoveImage = (index) => {
    setImagesToRemove((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      }
      return [...prev, index];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const remainingImages = existingImages.length - imagesToRemove.length + images.length;
    if (remainingImages < 1 || remainingImages > 5) {
      alert('Please ensure between 1 and 5 images remain after updates');
      return;
    }
    const form = new FormData();
    form.append('name', formData.name);
    form.append('realName', formData.realName);
    form.append('house', formData.house);
    form.append('biography', formData.biography);
    form.append('abilities', formData.abilities);
    form.append('yearOfFirstAppearance', formData.yearOfFirstAppearance);
    imagesToRemove.forEach((index) => form.append('removeImages', index));
    for (let i = 0; i < images.length; i++) {
      form.append('images', images[i]);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/superheroes/${id}`, {
        method: 'PUT',
        body: form
      });
      if (response.ok) {
        navigate('/');
        alert('Superhero updated successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to update superhero: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating superhero:', error);
      alert('Error updating superhero');
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-500">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-gray-300">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-1 container mx-auto p-6">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Edit Superhero</h1>
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
            {/* Existing Images Preview with Remove Option */}
            {existingImages.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Existing Images</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {existingImages.map((image, index) => (
                    <div key={index} className="relative w-full h-48 bg-black rounded-lg flex items-center justify-center shadow-md">
                      <img
                        src={`data:${image.contentType};base64,${image.data}`}
                        alt={`${formData.name} image ${index + 1}`}
                        className="h-full w-full object-contain rounded-lg"
                      />
                      <label className="absolute top-2 right-2">
                        <input
                          type="checkbox"
                          checked={imagesToRemove.includes(index)}
                          onChange={() => handleRemoveImage(index)}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">Remove</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Preview */}
            {previewImages.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">New Images to Upload</h2>
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
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition shadow-md"
              >
                Update Superhero
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

export default EditSuperhero;
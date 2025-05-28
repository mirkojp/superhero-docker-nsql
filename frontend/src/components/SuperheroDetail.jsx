import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

// Import the logo images
import marvelLogo from '../assets/marvel-logo.png';
import dcLogo from '../assets/dc-logo.png';

const SuperheroDetail = () => {
    const { id } = useParams();
    const [superhero, setSuperhero] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchSuperhero = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/superheroes/${id}`);
                const data = await response.json();
                setSuperhero(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching superhero:', error);
                setLoading(false);
            }
        };
        fetchSuperhero();
    }, [id]);

    const nextImage = () => {
        if (superhero && superhero.images) {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === superhero.images.length - 1 ? 0 : prevIndex + 1
            );
        }
    };

    const prevImage = () => {
        if (superhero && superhero.images) {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === 0 ? superhero.images.length - 1 : prevIndex - 1
            );
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this superhero?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/superheroes/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    window.location.href = '/'; // Redirect to home after successful deletion
                } else {
                    alert('Failed to delete superhero');
                }
            } catch (error) {
                console.error('Error deleting superhero:', error);
                alert('Error deleting superhero');
            }
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-500">Loading...</div>;
    if (!superhero) return <div className="flex items-center justify-center min-h-screen text-gray-500">Superhero not found</div>;

    // Determine logo based on house
    const getHouseLogo = () => {
        if (superhero.house.toLowerCase() === 'marvel') {
            return (
                <img
                    src={marvelLogo}
                    alt="Marvel Logo"
                    className="ml-2 h-10 w-auto rounded inline-block"
                />
            );
        } else if (superhero.house.toLowerCase() === 'dc') {
            return (
                <img
                    src={dcLogo}
                    alt="DC Logo"
                    className="ml-2 h-10 w-auto rounded inline-block"
                />
            );
        }
        return null; // No logo for other houses
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-gray-300">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <div className="flex-1 container mx-auto p-6">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
                    {superhero.name} {getHouseLogo()}
                </h1>
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Image Section */}
                    <div className="flex-1 flex justify-center">
                        {superhero.images && superhero.images.length > 0 ? (
                            <div className="relative w-full max-w-xl bg-black">
                                <img
                                    src={`data:${superhero.images[currentImageIndex].contentType};base64,${superhero.images[currentImageIndex].data}`}
                                    alt={superhero.name}
                                    className="h-96 w-full object-contain rounded-2xl shadow-md mx-auto"
                                />
                                {superhero.images.length > 1 && (
                                    <>
                                        <div className="absolute top-1/2 w-full flex justify-between px-4 transform -translate-y-1/2">
                                            <button
                                                onClick={prevImage}
                                                className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition shadow-md"
                                            >
                                                ←
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition shadow-md"
                                            >
                                                →
                                            </button>
                                        </div>
                                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded-full">
                                            {currentImageIndex + 1}/{superhero.images.length}
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="h-96 w-full max-w-xl bg-black rounded-2xl flex items-center justify-center mx-auto shadow-md">
                                <span className="text-gray-500">No Image</span>
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="flex-1">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            {superhero.realName && (
                                <p className="text-xl mb-4">
                                    <strong className="font-semibold text-gray-800">Real Name:</strong>{' '}
                                    <span className="text-gray-600">{superhero.realName}</span>
                                </p>
                            )}
                            <p className="text-xl mb-4">
                                <strong className="font-semibold text-gray-800">House:</strong>{' '}
                                <span className="text-gray-600">{superhero.house}</span>
                            </p>
                            <p className="text-xl mb-4">
                                <strong className="font-semibold text-gray-800">Biography:</strong>{' '}
                                <span className="text-gray-600">{superhero.biography}</span>
                            </p>
                            <p className="text-xl mb-4">
                                <strong className="font-semibold text-gray-800">Year of First Appearance:</strong>{' '}
                                <span className="text-gray-600">{superhero.yearOfFirstAppearance}</span>
                            </p>
                            <p className="text-xl">
                                <strong className="font-semibold text-gray-800">Abilities:</strong>{' '}
                                <span className="text-gray-600">{superhero.abilities.join(', ')}</span>
                            </p>
                        </div>
                        <div className="mt-6 flex justify-center space-x-4">
                            <Link
                                to={`/edit/${id}`}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition shadow-md"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition shadow-md"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default SuperheroDetail;
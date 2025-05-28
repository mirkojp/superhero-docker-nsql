import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header'; // Import the new Header component
import Footer from './Footer'; // Import the new Footer component

const Home = ({ superheroes, setSuperheroes, house }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this superhero?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/superheroes/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setSuperheroes(superheroes.filter((hero) => hero._id !== id));
                } else {
                    alert('Failed to delete superhero');
                }
            } catch (error) {
                console.error('Error deleting superhero:', error);
                alert('Error deleting superhero');
            }
        }
    };

    // Filter superheroes based on search term
    const filteredSuperheroes = superheroes.filter((hero) =>
        hero.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!superheroes.length) return <div className="text-center text-gray-500">Loading...</div>;

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-gray-300">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <div className="flex-1 container mx-auto p-6">
                {/* Search Bar */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Search superheroes by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-md mx-auto block p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Title */}
                <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
                    Superheroes {house ? `(${house})` : ''}
                </h1>

                {/* Grid of Cards */}
                {filteredSuperheroes.length === 0 ? (
                    <p className="text-center text-gray-500">No superheroes found.</p>
                ) : (
                    <div className="grid grid-cols-2 gap-8">
                        {filteredSuperheroes.map((hero) => (
                            <div
                                key={hero._id}
                                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition hover:scale-102 hover:shadow-2xl h-full flex flex-col"
                            >
                                {/* Image */}
                                <div className="w-full h-64 bg-black flex items-center justify-center rounded-t-xl overflow-hidden">
                                    {hero.images && hero.images.length > 0 && hero.images[0].data ? (
                                        <img
                                            src={`data:${hero.images[0].contentType};base64,${hero.images[0].data}`}
                                            alt={hero.name}
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800 mb-2">{hero.name}</h2>
                                        {hero.realName && (
                                            <p className="text-gray-600 text-sm">Real Name: {hero.realName}</p>
                                        )}
                                        <p className="text-gray-600 text-sm">House: {hero.house}</p>
                                        <p className="text-gray-600 text-sm mt-1">
                                            Biography: {hero.biography.length > 100 ? `${hero.biography.slice(0, 100)}...` : hero.biography}
                                        </p>
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        <Link
                                            to={`/superhero/${hero._id}`}
                                            className="block text-blue-500 hover:text-blue-700 font-medium"
                                        >
                                            View Details
                                        </Link>
                                        <Link
                                            to={`/edit/${hero._id}`}
                                            className="block text-green-500 hover:text-green-700 font-medium"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(hero._id)}
                                            className="block text-red-500 hover:text-red-700 font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Home;
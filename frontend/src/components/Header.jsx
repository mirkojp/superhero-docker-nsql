import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-gray-800 text-gray-800 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <Link
                    to="/"
                    className="text-2xl font-bold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Superhero Database
                </Link>
                <div className="space-x-4">
                    <Link
                        to="/marvel"
                        className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                        Marvel
                    </Link>
                    <Link
                        to="/dc"
                        className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        DC
                    </Link>
                    <Link
                        to="/add"
                        className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition"
                    >
                        New
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
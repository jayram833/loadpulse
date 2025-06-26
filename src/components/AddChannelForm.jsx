import { useState } from 'react';

const AddChannelForm = ({ onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAdd = () => {
        if (formData.name) {
            onAdd(formData);
            setFormData({ name: '', description: '' });
            onClose();
        }
    };

    const handleClose = () => {
        setFormData({ name: '', description: '' });
        onClose();
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-md transition-all duration-300"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 m-4 w-full max-w-md transform transition-all duration-300 scale-100">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">
                        Add New Entry
                    </h2>
                    <div className="mt-2 h-1 bg-indigo-900 rounded-full mx-auto w-16"></div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200 bg-gray-50 dark:bg-gray-800 dark:text-white focus:bg-white dark:focus:bg-gray-700"
                            placeholder="Enter name"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200 bg-gray-50 dark:bg-gray-800 dark:text-white focus:bg-white dark:focus:bg-gray-700 resize-none"
                            placeholder="Enter a brief description..."
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-8">
                    <button
                        onClick={handleClose}
                        className="flex-1 py-3 px-6 text-gray-600 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition-all cursor-pointer duration-200 font-semibold"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleAdd}
                        className="flex-1 py-3 px-6 bg-indigo-900 text-white rounded-lg hover:bg-indigo-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>

    );
};

export default AddChannelForm;
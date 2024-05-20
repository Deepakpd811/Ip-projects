import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

function Addstudent() {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleRollNumberChange = (e) => {
    setRollNumber(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !rollNumber || !image) {
      toast.error('Please fill in all fields!');
      return;
    }

    setIsLoading(true);
    toast.info('Uploading student data...');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('rollNumber', rollNumber);
    formData.append('photo', image);

    try {
      const response = await axios.post('http://localhost:3000/faces/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const uploadPercentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          toast.update(infoToastId => ({
            ...infoToastId,
            props: {
              ...infoToastId.props,
              body: `Uploading student data: ${uploadPercentage}%`
            }
          }));
        }
      });

      setIsLoading(false);
      toast.success(response.data.msg); // Display server success message

      setName('');
      setRollNumber('');
      setImage(null);
    } catch (error) {
      setIsLoading(false);
      console.error('Error adding student:', error);
      toast.error('Error adding student!');
    }
  };

  let infoToastId = null
  
    return (
        <div className="container">
           <ToastContainer />
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <div className="card mt-5">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">Add Student</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name:</label>
                    <input type="text" className="form-control" id="name" value={name} onChange={handleNameChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="rollNumber" className="form-label">Roll Number:</label>
                    <input type="text" className="form-control" id="rollNumber" value={rollNumber} onChange={handleRollNumberChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="image" className="form-label">Image:</label>
                    <input type="file" className="form-control" id="image" accept="image/*" onChange={handleImageChange} />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
        {isLoading ? 'Uploading...' : 'Add Student'}
      </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    );
}

export default Addstudent
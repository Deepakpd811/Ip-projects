import React from 'react'
import { useState } from 'react';
import axios from 'axios';
function Addstudent() {
    const [name, setName] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [image, setImage] = useState(null);
  
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
  
      const formData = new FormData();
      formData.append('name', name);
      formData.append('rollNumber', rollNumber);
      formData.append('photo', image);
      try {
          console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
          await axios.post('http://localhost:3000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
  
        setName('');
        setRollNumber('');
        setImage(null);
      } catch (error) {
        console.error('Error adding student:', error);
      }
    };
  
    return (
        <div className="container">
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
                  <button type="submit" className="btn btn-primary">Add Student</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    );
}

export default Addstudent
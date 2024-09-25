'use client';
import { useState } from 'react';
import './register.css';
import { useRouter } from 'next/navigation';
import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia";

const Register = () => {
  const router = useRouter();
  const [type, setType] = useState({ password: true, confirmPassword: true });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log("User Data:", data);

      if (data.status) {
        setSuccess('User registered successfully!');
        setFormData({
          name: '',
          email: '',
          password: '',
          confirm_password: '',
        });

        // Redirect immediately
        router.push('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('An error occurred while registering the user.');
    }
  };

  return (
    <section className="register-form w-full bg-slate-100 h-screen">
      <form
        className="flex flex-col w-full max-w-2xl mx-auto bg-white p-10 rounded-lg"
        onSubmit={handleSubmit}
      >
        <h1 className="text-center font-bold mb-5 text-2xl underline">Sign Up</h1>
        <hr />
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <div className="mb-3 mt-2 flex flex-col">
          <label htmlFor="name" className="mb-2 text-xl">Name</label>
          <input
            type="text"
            className="border border-gray-100 rounded p-2"
            name="name"
            id="name"
            placeholder="Enter Your Name..."
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3 flex flex-col">
          <label htmlFor="email" className="mb-2 text-xl">Email</label>
          <input
            type="email"
            className="border border-gray-100 rounded p-2"
            name="email"
            id="email"
            placeholder="Enter Your Email..."
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3 flex flex-col relative">
          <label htmlFor="password" className="mb-2 text-xl">Password</label>
          <input
            type={type.password ? 'password' : 'text'}
            className="border border-gray-100 rounded p-2"
            name="password"
            id="password"
            placeholder="Enter Your Password..."
            value={formData.password}
            onChange={handleChange}
            required
          />
          {type.password ? (
            <LiaEyeSolid className='absolute right-3 top-14 transform -translate-y-1/2 cursor-pointer' onClick={() => setType({ ...type, password: false })} />
          ) : (
            <LiaEyeSlashSolid className='absolute right-3 top-14 transform -translate-y-1/2 cursor-pointer' onClick={() => setType({ ...type, password: true })} />
          )}
        </div>

        <div className="mb-3 flex flex-col relative">
          <label htmlFor="confirm_password" className="mb-2 text-xl">Confirm Password</label>
          <input
            type={type.confirmPassword ? 'password' : 'text'}
            className="border border-gray-100 rounded p-2"
            name="confirm_password"
            id="confirm_password"
            placeholder="Confirm Your Password..."
            value={formData.confirm_password}
            onChange={handleChange}
            required
          />
          {type.confirmPassword ? (
            <LiaEyeSolid className='absolute right-3 top-14 transform -translate-y-1/2 cursor-pointer' onClick={() => setType({ ...type, confirmPassword: false })} />
          ) : (
            <LiaEyeSlashSolid className='absolute right-3 top-14 transform -translate-y-1/2 cursor-pointer' onClick={() => setType({ ...type, confirmPassword: true })} />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 border border-gray-300 text-white flex items-center justify-center px-10 py-3 rounded hover:bg-blue-600"
        >
          Sign Up
        </button>
      </form>
    </section>
  );
};

export default Register;

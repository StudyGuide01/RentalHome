'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia";
import Image from 'next/image';
import { auth } from '@/app/api/auth/googleFirbase/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

// Images
import google_logo from '/public/images/google-logo.png';

const Login = ({ asideOpen }) => {
  const router = useRouter();
  const [type, setType] = useState({ password: true });
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const googleAuth = new GoogleAuthProvider();
  const [user, setUser] = useAuthState(auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', formData);
      const user = response.data.data;
      localStorage.setItem("token", user.token);
      localStorage.setItem("email", user.email);
      router.push('/dashboard');
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error.response?.data?.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleAuth);
      const user = result.user;
      console.log('Google Sign-In successful:', user);
      router.push('/dashboard');
    } catch (error) {
      console.error("Google login error:", error);
      setErrorMessage("An error occurred during Google sign-in.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <section className="register-form w-full bg-slate-100 h-screen flex items-center justify-center">
      <div className="flex flex-col bg-white w-full max-w-md mx-auto p-8 rounded-lg shadow-md">
        <h1 className={`text-center font-bold mb-5 text-2xl underline ${asideOpen ? 'text-red-500' : 'text-green-500'}`}>Sign In</h1>
        <hr />
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}

        <form className="flex flex-col" onSubmit={handleLogin}>
          <div className="mb-3 flex flex-col">
            <label htmlFor="email" className="mb-2 text-lg">Email</label>
            <input
              type="email"
              className="border border-gray-300 rounded p-2"
              name="email"
              id="email"
              placeholder="Enter Your Email..."
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 flex flex-col relative">
            <label htmlFor="password" className="mb-2 text-lg">Password</label>
            <input
              type={type.password ? 'password' : 'text'}
              className="border border-gray-300 rounded p-2"
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

          <button
            type="submit"
            className="bg-blue-500 font-bold border border-gray-300 text-white flex items-center justify-center px-10 py-3 rounded hover:bg-blue-600 text-lg"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className='flex flex-col items-center mt-4'>
          <p className='text-center my-4'>--OR--</p>
          {/* code actived */}
          <button className='flex py-2   w-full justify-center items-center gap-2 bg-blue-300 rounded-md' onClick={loginWithGoogle} disabled={loading}>
            <Image src={google_logo} width={40} height={40} alt="Google logo" />
            <p className='text-lg text-white font-bold'>Sign In With Google</p>
          </button>
        </div>

        <button className='mt-4 text-blue-600' onClick={() => auth.signOut()}>Sign Out</button>

        {user && (
          <div className="mt-4 text-center">
            <p>{user.email}</p>
            <p>{user.uid}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Login;

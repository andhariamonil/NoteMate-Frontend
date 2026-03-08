import { useState, useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/20/solid';
import Signup from './Signup';
import Signin from './Signin';
import Cards from './Cards';
import Searchbar from './Search';
import Inputs from './Inputs';

export default function Example({
  isLogIn,
  setIsLogIn,
  search,
  setSearch,
  cardRefresh,
  setCardRefresh,
}) {
  const [showSignup, setShowSignup] = useState(false);
  const [showSignin, setShowSignin] = useState(false);

  // ❗ Prevent body scroll only on landing page
  useEffect(() => {
    if (!isLogIn && !showSignup && !showSignin) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLogIn, showSignup, showSignin]);

  // ✅ Logged-in view
  if (isLogIn) {
    return (
      <>
        <Searchbar setSearch={setSearch} />
        <Inputs setCardRefresh={setCardRefresh} />
        <Cards search={search} setSearch={setSearch} cardRefresh={cardRefresh} />
      </>
    );
  }

  // ✅ Guest view
  return (
    <>
      {/* 🔳 Transparent Navbar */}
      <Disclosure
  as="nav"
  className="bg-white/30 backdrop-blur-md shadow-md z-20 sticky top-0 transition-all duration-300"
>
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
      {/* 🔹 Logo (always visible, never overlaps) */}
      <div className="flex-shrink-0">
        <img
          className="h-16 w-auto rounded-md drop-shadow-md"
          src="../../public/note mate logo 2.png"
          alt="NoteMate"
        />
      </div>

      {/* 🔸 Auth Buttons */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => {
            setShowSignup(true);
            setShowSignin(false);
          }}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow hover:shadow-md transition"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5 inline" />
          Sign Up
        </button>
        <button
          onClick={() => {
            setShowSignin(true);
            setShowSignup(false);
          }}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow hover:shadow-md transition"
        >
          Sign In
        </button>
      </div>
    </div>
  </div>
</Disclosure>

      {/* ✍️ Auth Screens */}
      {showSignup && <Signup setIsLogIn={setIsLogIn} />}

      {showSignin && <Signin setIsLogIn={setIsLogIn} />}

      {/* 🖼️ Landing Page */}
      {!showSignin && !showSignup && (
        <div className="relative w-full h-screen overflow-hidden bg-gray-50">
          {/* 📷 Background Image + Gradient */}
          <div className="absolute inset-0">
            <img
              src="https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTEwL2hpcHBvdW5pY29ybl9taW5pbWFsX2ZsYXRfdmVjdG9yX2Flc3RoZXRpY19pbGx1c3RyYXRpb25fb2ZfYV9ub18xOGU4MzkwNi1kY2UyLTRhZDEtOTY4Yy0xMzM2M2UzNzJlOWJfMi5qcGc.jpg"
              alt="Books Background"
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 opacity-60 mix-blend-multiply" />
          </div>

          {/* ✨ Overlay Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 animate-fade-in">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 drop-shadow-xl animate-slide-down">
              Welcome to <span className="text-gray-900">NoteMate</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-700 max-w-2xl animate-slide-up">
              ✨ “Capture your thoughts, organize your ideas, and let productivity flow.”
            </p>
            <button
              onClick={() => setShowSignup(true)}
              className="mt-8 px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-700 hover:shadow-xl transition-all duration-300 animate-bounce-in"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </>
  );
}

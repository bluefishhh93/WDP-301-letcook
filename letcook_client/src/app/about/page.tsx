import React from 'react';
import Image from 'next/image';
import { CookingPot, HeartIcon, Users2Icon } from 'lucide-react';


const AboutUs = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-yellow-400 py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">About Foodie Fusion</h1>
          <p className="text-xl text-gray-700">Bringing the world&apos;s flavors to your kitchen</p>
        </div>
      </header>

      <main className="container mx-auto py-16">
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">Our Story</h2>
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <Image
                src="/images/about-us-hero.jpg"
                alt="Foodie Fusion Team"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2 md:pl-8">
              <p className="text-gray-600 mb-4">
                Foodie Fusion was born out of a passion for diverse cuisines and a desire to bring the world&apos;s flavors into every home kitchen. Our journey began in 2023 when a group of food enthusiasts came together with a shared vision: to create a platform that celebrates culinary diversity and empowers home cooks to explore global recipes.
              </p>
              <p className="text-gray-600">
                Today, we are proud to offer a vibrant community where food lovers from all corners of the globe can share their favorite recipes, discover new dishes, and connect over their love for cooking.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">Our Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <CookingPot className="text-4xl text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Culinary Exploration</h3>
              <p className="text-gray-600">
                We aim to inspire culinary adventures by providing a diverse collection of recipes from around the world.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Users2Icon className="text-4xl text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community Building</h3>
              <p className="text-gray-600">
                We foster a supportive community where food enthusiasts can share, learn, and grow together.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <HeartIcon className="text-4xl text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Passion for Food</h3>
              <p className="text-gray-600">
                We celebrate the joy of cooking and the power of food to bring people together across cultures.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { name: 'Jane Doe', role: 'Founder & CEO', image: '/images/team-member-1.jpg' },
              { name: 'John Smith', role: 'Head Chef', image: '/images/team-member-2.jpg' },
              { name: 'Emily Chen', role: 'Community Manager', image: '/images/team-member-3.jpg' },
              { name: 'Michael Brown', role: 'Food Photographer', image: '/images/team-member-4.jpg' },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={200}
                  height={200}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">Join Our Community</h2>
          <div className="bg-yellow-100 p-8 rounded-lg shadow-md">
            <p className="text-gray-700 mb-4">
              Become a part of the Foodie Fusion family! Share your recipes, discover new dishes, and connect with fellow food lovers from around the world.
            </p>
            <button className="bg-yellow-400 text-gray-800 font-semibold py-2 px-4 rounded hover:bg-yellow-500 transition duration-300">
              Sign Up Now
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 Foodie Fusion. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
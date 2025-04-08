import React, { useEffect, useState } from 'react';
import Hero from '../Components/Hero/Hero';
import Popular from '../Components/Popular/Popular';
import Offers from '../Components/Offers/Offers';
import NewCollections from '../Components/NewCollections/NewCollections';
import NewsLetter from '../Components/NewsLetter/NewsLetter';

const Shop = () => {
  const [popular, setPopular] = useState([]);
  const [newCollection, setNewCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      const [popularRes, newCollectionRes] = await Promise.all([
        fetch('http://localhost:4000/popularinwomen'),
        fetch('http://localhost:4000/newcollections'),
      ]);

      if (!popularRes.ok || !newCollectionRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const popularData = await popularRes.json();
      const newCollectionData = await newCollectionRes.json();

      setPopular(popularData);
      setNewCollection(newCollectionData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error: {error}</h2>;

  return (
    <div>
      <Hero />
      <Popular data={popular} />
      <Offers />
      <NewCollections data={newCollection} />
      <NewsLetter />
    </div>
  );
};

export default Shop;

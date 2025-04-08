import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (!token) {
          setError('You must be logged in to view orders.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:4000/myorders', {
          headers: {
            'auth-token': token,
          },
        });

        if (response.data.success) {
          setOrders(response.data.orders || []);
        } else {
          setError(response.data.message || 'Failed to load orders.');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading your orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>You haven't made any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h3>Order ID: <span>{order._id}</span></h3>
                <p>Date: {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</p>
                <p>Total: ₹{order.totalAmount || '0.00'}</p>
              </div>
              <div className="order-items">
                {Array.isArray(order.items) && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <img
                        src={item.productId?.image || '/placeholder.png'}
                        alt={item.productId?.name || 'Product'}
                        className="order-item-img"
                      />
                      <div className="order-item-info">
                        <h4>{item.productId?.name || 'Unknown Product'}</h4>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ₹{item.productId?.price || 'N/A'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No items found for this order.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;

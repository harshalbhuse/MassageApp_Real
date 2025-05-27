import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Spinner, Alert, Image, Container } from 'react-bootstrap';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    profile_photo: null,
  });

  const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axios.get(`http://localhost:8000/api/profile?user_id=${userId}`)
      .then(res => {
        setProfile(res.data);
        setForm({
          first_name: res.data.first_name || '',
          last_name: res.data.last_name || '',
          email: res.data.email || '',
          username: res.data.username || '',
          profile_photo: null,
        });
        setPhotoPreview(res.data.profile_photo_url || null);
      })
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_photo') {
      setForm(f => ({ ...f, profile_photo: files[0] }));
      setPhotoPreview(files[0] ? URL.createObjectURL(files[0]) : null);
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('first_name', form.first_name);
      formData.append('last_name', form.last_name);
      formData.append('email', form.email);
      formData.append('username', form.username);
      if (form.profile_photo) formData.append('profile_photo', form.profile_photo);
      const res = await axios.post('http://localhost:8000/api/profile/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Profile updated successfully!');
      setProfile(res.data);
      if (res.data.profile_photo_url) setPhotoPreview(res.data.profile_photo_url);
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <Container className="py-4 d-flex justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
        <Card style={{ width: '100%', maxWidth: 500, borderRadius: 18, boxShadow: '0 4px 32px rgba(0,0,0,0.10)' }}>
          <Card.Body>
            <h2 className="mb-4 text-center">Edit Profile</h2>
            {loading ? (
              <div className="text-center my-5"><Spinner animation="border" /></div>
            ) : (
              <Form onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <div className="text-center mb-3">
                  {photoPreview ? (
                    <Image src={photoPreview} roundedCircle width={96} height={96} style={{ objectFit: 'cover' }} />
                  ) : (
                    <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white mx-auto" style={{ width: 96, height: 96, fontWeight: 600, fontSize: 36 }}>
                      {form.first_name ? form.first_name[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  <Form.Group className="mt-2">
                    <Form.Label className="btn btn-outline-primary btn-sm mb-0">Change Photo
                      <Form.Control type="file" name="profile_photo" accept="image/*" onChange={handleChange} style={{ display: 'none' }} />
                    </Form.Label>
                  </Form.Group>
                </div>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" name="first_name" value={form.first_name} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" name="last_name" value={form.last_name} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" name="username" value={form.username} onChange={handleChange} required />
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100" disabled={saving}>{saving ? <Spinner animation="border" size="sm" /> : 'Save Changes'}</Button>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Container>
    </DashboardLayout>
  );
};

export default ProfilePage; 
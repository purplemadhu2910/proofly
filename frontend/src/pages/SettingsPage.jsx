import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';
import { Settings, User, Key, Check } from 'lucide-react';

export const SettingsPage = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [toast, setToast] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setToast('Account settings updated successfully.');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      {toast && <Toast message={toast} onClose={() => setToast('')} />}

      <div className="border-b border-slate-800/80 pb-6">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Account Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your business profile credentials and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" />
            <span>Owner Profile</span>
          </CardTitle>
          <CardDescription>Update your personal account details.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSave}>
          <CardContent className="space-y-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              readOnly
              disabled
              helper="Email cannot be changed directly."
            />
          </CardContent>

          <CardFooter>
            <Button type="submit" variant="primary">
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

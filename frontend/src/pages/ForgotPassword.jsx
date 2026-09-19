import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await forgotPassword({ email });
      setSubmitted(true);
      if (res.data.resetToken) {
        setResetToken(res.data.resetToken);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Request failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-3 text-indigo-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl">Password Recovery</CardTitle>
          <CardDescription>Enter your email to receive simulated password reset instructions.</CardDescription>
        </CardHeader>

        {submitted ? (
          <CardContent className="space-y-4 text-center">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              Password reset instructions have been generated!
            </div>

            {resetToken && (
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-left">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Simulated Reset Link</p>
                <Link
                  to={`/reset-password?token=${resetToken}`}
                  className="text-xs text-indigo-400 font-mono underline break-all mt-1 block"
                >
                  /reset-password?token={resetToken}
                </Link>
              </div>
            )}

            <Link to="/login" className="inline-block mt-4 text-xs text-slate-400 hover:text-white">
              ← Return to login
            </Link>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </CardContent>

            <CardFooter className="flex-col gap-3">
              <Button type="submit" variant="primary" loading={loading} className="w-full">
                Send Reset Link
              </Button>

              <Link to="/login" className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </Link>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
};

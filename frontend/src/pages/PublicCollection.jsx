import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicSpace, submitPublicTestimonial, uploadPublicFile } from '../services/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input, Textarea, Label } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { RatingStars } from '../components/ui/RatingStars';
import { Skeleton } from '../components/ui/Skeleton';
import { Sparkles, CheckCircle2, Upload, MessageSquareQuote, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PublicCollection = () => {
  const { spaceSlug } = useParams();
  const [space, setSpace] = useState(null);
  const [loadingSpace, setLoadingSpace] = useState(true);
  const [errorSpace, setErrorSpace] = useState('');

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [companyRole, setCompanyRole] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [avatar, setAvatar] = useState('');

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchSpace = async () => {
      setLoadingSpace(true);
      try {
        const res = await getPublicSpace(spaceSlug);
        setSpace(res.data);
      } catch (err) {
        setErrorSpace('Space not found or link is inactive.');
      } finally {
        setLoadingSpace(false);
      }
    };
    if (spaceSlug) fetchSpace();
  }, [spaceSlug]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const res = await uploadPublicFile(file);
      setAvatar(res.data.url);
    } catch (err) {
      console.error("Avatar upload error:", err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);

    try {
      await submitPublicTestimonial(spaceSlug, {
        customerName,
        customerEmail,
        companyRole: companyRole.trim() || 'Customer',
        rating,
        reviewText,
        avatar: avatar.trim() || undefined
      });
      setSubmitSuccess(true);
      
      // Trigger celebratory confetti burst
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } catch (err) {
      setSubmitError(err.response?.data?.detail || 'Failed to submit feedback. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingSpace) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4">
        <Card className="w-full max-w-lg text-center py-12 space-y-4">
          <Skeleton height="h-12" width="w-12" className="mx-auto rounded-full" />
          <Skeleton height="h-6" width="w-48" className="mx-auto" />
          <Skeleton height="h-32" />
        </Card>
      </div>
    );
  }

  if (errorSpace || !space) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center py-12 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
            <MessageSquareQuote className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Collection Page Unavailable</h2>
          <p className="text-xs text-slate-400">{errorSpace || 'This feedback space does not exist.'}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center p-4 font-sans selection:bg-indigo-500 selection:text-white">
      <Card className="w-full max-w-xl my-8">
        {/* Space Header */}
        <CardHeader className="text-center pb-6 border-b border-slate-800/80">
          {space.logo ? (
            <img src={space.logo} alt={space.businessName} className="w-16 h-16 rounded-2xl object-cover mx-auto mb-4 border border-slate-700 shadow-lg" />
          ) : (
            <div className="w-16 h-16 rounded-2xl coss-gradient-bg text-white font-extrabold text-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
              {space.businessName.charAt(0)}
            </div>
          )}
          <CardTitle className="text-2xl font-extrabold">{space.businessName}</CardTitle>
          {space.description && <CardDescription>{space.description}</CardDescription>}

          {/* Custom Prompt */}
          <div className="mt-4 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-sm font-semibold italic text-center">
            "{space.customPrompt}"
          </div>
        </CardHeader>

        {submitSuccess ? (
          <CardContent className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="text-2xl font-extrabold text-white">Thank you!</h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              Your feedback has been submitted successfully. We deeply appreciate your support and response!
            </p>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-6">
              {submitError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {submitError}
                </div>
              )}

              {/* Star Rating Picker */}
              {space.showRating && (
                <div className="text-center space-y-2 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
                  <Label>Overall Rating</Label>
                  <RatingStars
                    rating={rating}
                    interactive
                    onChange={(r) => setRating(r)}
                    size="lg"
                  />
                  <p className="text-xs text-amber-400 font-semibold">{rating} of 5 Stars</p>
                </div>
              )}

              {/* Review Text */}
              <Textarea
                label="Your Review / Testimonial"
                placeholder="Share your experience, results, or favorite features..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                required
              />

              {/* Custom Questions Display */}
              {space.customQuestions && space.customQuestions.length > 0 && (
                <div className="space-y-2 p-4 bg-slate-900/40 border border-slate-800 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Guide Questions</span>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                    {space.customQuestions.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name"
                  placeholder="e.g. Alex Morgan"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />

                <Input
                  label="Your Email"
                  type="email"
                  placeholder="alex@company.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Company & Role (Optional)"
                placeholder="e.g. Founder @ CreatorStudio"
                value={companyRole}
                onChange={(e) => setCompanyRole(e.target.value)}
              />

              {/* Avatar Upload */}
              {space.showAvatar && (
                <div>
                  <Label>Profile Avatar Photo (Optional)</Label>
                  <div className="flex items-center gap-4 mt-1">
                    {avatar ? (
                      <img src={avatar} alt="Avatar preview" className="w-12 h-12 rounded-full object-cover border border-slate-700" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 text-xs font-bold">
                        Photo
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Image URL or upload below..."
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                      />
                      <label className="cursor-pointer text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingAvatar ? 'Uploading image...' : 'Upload Image File'}</span>
                        <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="pt-4">
              <Button type="submit" variant="primary" loading={submitting} className="w-full text-sm py-3">
                <Sparkles className="w-4 h-4" />
                <span>Submit Feedback</span>
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>

      <footer className="text-center text-xs text-slate-500">
        Powered by <span className="font-bold text-slate-400">Proofly</span> Social Proof Collector
      </footer>
    </div>
  );
};

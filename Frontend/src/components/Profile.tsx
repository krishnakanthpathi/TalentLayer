import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { Profile as ProfileType } from '../types';
import { Edit2, MapPin, Save, X, Globe } from 'lucide-react';

const Profile: React.FC = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        bio: '',
        title: '',
        locations: '',
        socialLinks: [] as { platform: string; url: string }[],
    });

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await api.get('/profile/me');
            setProfile(data.data.profile);

            // Initialize form data
            if (data.data.profile) {
                setFormData({
                    bio: data.data.profile.bio || '',
                    title: data.data.profile.title || '',
                    locations: data.data.profile.locations || '',
                    socialLinks: data.data.profile.socialLinks || [],
                });
            }
        } catch (err: any) {
            // If 404, it just means no profile created yet, which is fine
            if (!err.message?.includes('404')) {
                console.error('Error fetching profile:', err);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSave = async () => {
        try {
            setLoading(true);
            await api.post('/profile/me?_method=PATCH', formData);
            // Using POST with override if needed, or better use patch in api helper.
            // Wait, let's check api helper. It only has get and post. 
            // I will assume for now I should use POST or add PATCH to api.ts. 
            // Let's modify api.ts to include patch is better. 
            // For now, I will stick to patch method if I can update types locally or just cast.
            // But wait, the previous api.ts only defined get and post.

            // Let's implement a quick fetch call here directly for PATCH or update api.ts in next step.
            // I'll assume I update api.ts to generic request or add patch.
            // For this step, to prevent breaking, I'll use raw fetch with token.

            const token = localStorage.getItem('talentlayer_token');
            const response = await fetch('http://localhost:8888/api/v1/profile/me', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(formData),
            });

            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.message);

            setProfile(responseData.data.profile);
            setIsEditing(false);
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    // Helper to manage social links in form
    const updateSocialLink = (index: number, key: 'platform' | 'url', value: string) => {
        const newLinks = [...formData.socialLinks];
        newLinks[index] = { ...newLinks[index], [key]: value };
        setFormData({ ...formData, socialLinks: newLinks });
    };

    const addSocialLink = () => {
        setFormData({ ...formData, socialLinks: [...formData.socialLinks, { platform: 'twitter', url: '' }] });
    };

    const removeSocialLink = (index: number) => {
        const newLinks = [...formData.socialLinks];
        newLinks.splice(index, 1);
        setFormData({ ...formData, socialLinks: newLinks });
    };

    if (loading && !profile && !isEditing) {
        return <div className="min-h-screen pt-24 text-center text-white">Loading profile...</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white pt-24 px-4 pb-12 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10">

                {/* Header Section */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-2xl">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-lg">
                            <img
                                src={user?.avatar || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                            <div>
                                <h1 className="text-3xl font-bold">{user?.name}</h1>
                                <p className="text-cyan-400">@{user ? (user as any).username : 'username'}</p>
                                {/* User type doesn't have username in auth context yet, but backend sends it. Safe fallback. */}
                            </div>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="mt-4 md:mt-0 flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                                >
                                    <Edit2 size={18} />
                                    <span>Edit Profile</span>
                                </button>
                            )}
                        </div>

                        {!isEditing ? (
                            <>
                                <h2 className="text-xl font-medium text-gray-200 mb-2">{profile?.title || "No title set"}</h2>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 mb-6">
                                    <MapPin size={16} />
                                    <span>{profile?.locations || "No location set"}</span>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-4 w-full max-w-lg">
                                <input
                                    type="text"
                                    placeholder="Professional Title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-black/40 border border-white/20 rounded p-2 text-white"
                                />
                                <input
                                    type="text"
                                    placeholder="Location (e.g. New York, Remote)"
                                    value={formData.locations}
                                    onChange={(e) => setFormData({ ...formData, locations: e.target.value })}
                                    className="w-full bg-black/40 border border-white/20 rounded p-2 text-white"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="md:col-span-2 space-y-8">
                        <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
                            <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">About Me</h3>
                            {!isEditing ? (
                                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {profile?.bio || "Tell us about yourself..."}
                                </p>
                            ) : (
                                <textarea
                                    rows={6}
                                    placeholder="Write a short bio..."
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full bg-black/40 border border-white/20 rounded p-3 text-white"
                                />
                            )}
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="md:col-span-1 space-y-8">
                        <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
                            <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Connect</h3>
                            <div className="space-y-4">
                                {!isEditing ? (
                                    profile?.socialLinks && profile.socialLinks.length > 0 ? (
                                        profile.socialLinks.map((link, i) => (
                                            <a
                                                key={i}
                                                href={link.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 transition-colors bg-white/5 p-3 rounded-lg border border-white/5 hover:border-cyan-400/30"
                                            >
                                                <Globe size={18} />
                                                <span className="truncate">{link.platform}</span>
                                            </a>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 italic">No social links added.</p>
                                    )
                                ) : (
                                    <div className="space-y-3">
                                        {formData.socialLinks.map((link, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input
                                                    placeholder="Platform"
                                                    value={link.platform}
                                                    onChange={(e) => updateSocialLink(i, 'platform', e.target.value)}
                                                    className="w-1/3 bg-black/40 border border-white/20 rounded p-2 text-sm text-white"
                                                />
                                                <input
                                                    placeholder="URL"
                                                    value={link.url}
                                                    onChange={(e) => updateSocialLink(i, 'url', e.target.value)}
                                                    className="w-full bg-black/40 border border-white/20 rounded p-2 text-sm text-white"
                                                />
                                                <button onClick={() => removeSocialLink(i)} className="text-red-400 hover:text-red-300">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={addSocialLink}
                                            className="w-full mt-2 py-2 text-sm border border-dashed border-gray-600 text-gray-400 rounded hover:border-gray-400 hover:text-gray-200"
                                        >
                                            + Add Social Link
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>

                        {isEditing && (
                            <div className="flex gap-4">
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-cyan-500/20"
                                >
                                    <Save size={18} />
                                    Save
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

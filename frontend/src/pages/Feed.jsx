import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Send, Users } from "lucide-react";
import {
    currentUserId,
    users,
    restaurants,
    socialPosts,
    getUserById,
    getRestaurantBySlug,
    getFeedPostsForUser,
} from "../mock";

const formatRelative = (isoDate) => {
    const ms = Date.now() - new Date(isoDate).getTime();
    const minutes = Math.floor(ms / 60000);
    if (minutes < 60) return `il y a ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `il y a ${hours} h`;
    const days = Math.floor(hours / 24);
    return `il y a ${days} j`;
};

const Feed = () => {
    const [posts, setPosts] = useState(socialPosts);
    const [restaurantSlug, setRestaurantSlug] = useState(restaurants[0]?.slug || "");
    const [content, setContent] = useState("");

    const viewer = useMemo(() => getUserById(currentUserId, users), []);
    const friends = useMemo(
        () => users.filter((u) => viewer?.friendsIds?.includes(u.id)),
        [viewer],
    );

    const feed = useMemo(() => {
        return getFeedPostsForUser(currentUserId, posts, users).map((p) => ({
            ...p,
            author: getUserById(p.authorId, users),
            restaurant: getRestaurantBySlug(p.restaurantSlug, restaurants),
        }));
    }, [posts]);

    const handlePublish = (e) => {
        e.preventDefault();
        const text = content.trim();
        if (!text || !restaurantSlug) return;

        const newPost = {
            id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `p-${Date.now()}`,
            authorId: currentUserId,
            restaurantSlug,
            content: text,
            visibility: "friends",
            createdAt: new Date().toISOString(),
            likes: 0,
        };

        setPosts((prev) => [newPost, ...prev]);
        setContent("");
    };

    return (
        <div className="pt-[104px] min-h-screen">
            <section className="max-w-4xl mx-auto px-6 pt-10">
                <div className="text-xs tracking-[0.3em] uppercase text-[#C8102E] font-bold mb-3">
                    Feed prive
                </div>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    Ce que tes amis ont
                    <br />
                    <em className="text-gradient-red">vraiment adore</em>
                </h1>
                <p className="text-[#6B6B6B] mt-4 text-lg">
                    Les posts de ce feed sont visibles uniquement entre amis.
                    Les avis officiels des restaurants restent ceux des experts Michelin.
                </p>
            </section>

            <section className="max-w-4xl mx-auto px-6 mt-8">
                <div className="bg-white rounded-3xl border border-[#EAE6DF] p-6">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#6B6B6B] mb-4">
                        <Users className="w-4 h-4" />
                        Amis ({friends.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {friends.map((f) => (
                            <span
                                key={f.id}
                                className="px-3 py-1.5 rounded-full bg-[#FFF8F0] text-sm border border-[#EAE6DF]"
                            >
                @{f.handle}
              </span>
                        ))}
                    </div>
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-6 mt-6">
                <form
                    onSubmit={handlePublish}
                    className="bg-white rounded-3xl border border-[#EAE6DF] p-6"
                >
                    <div className="text-sm font-semibold mb-3">Partager une experience</div>
                    <div className="grid md:grid-cols-3 gap-3">
                        <select
                            value={restaurantSlug}
                            onChange={(e) => setRestaurantSlug(e.target.value)}
                            className="md:col-span-1 px-4 py-3 rounded-xl border-2 border-[#EAE6DF] outline-none focus:border-[#C8102E]"
                        >
                            {restaurants.map((r) => (
                                <option key={r.id} value={r.slug}>
                                    {r.name}
                                </option>
                            ))}
                        </select>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={3}
                            placeholder="Ex: J'ai mange ici c'etait trop cool, vous devriez y aller."
                            className="md:col-span-2 px-4 py-3 rounded-xl border-2 border-[#EAE6DF] outline-none focus:border-[#C8102E] resize-none"
                        />
                    </div>
                    <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-[#6B6B6B]">
              Publication visible uniquement par tes amis.
            </span>
                        <button type="submit" className="btn-primary inline-flex items-center gap-2">
                            Publier <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </section>

            <section className="max-w-4xl mx-auto px-6 py-10">
                <div className="space-y-4">
                    {feed.length === 0 && (
                        <div className="text-center py-14 bg-white rounded-3xl border border-[#EAE6DF]">
                            <h3 className="text-2xl font-bold">Aucun post pour le moment</h3>
                            <p className="text-[#6B6B6B] mt-2">
                                Tes amis n'ont pas encore partage d'experience.
                            </p>
                        </div>
                    )}

                    {feed.map((post) => (
                        <article key={post.id} className="bg-white rounded-3xl border border-[#EAE6DF] p-5">
                            <div className="flex items-center gap-3">
                                <img
                                    src={post.author?.avatar}
                                    alt={post.author?.name}
                                    className="w-11 h-11 rounded-full object-cover"
                                />
                                <div>
                                    <div className="font-bold">{post.author?.name}</div>
                                    <div className="text-xs text-[#6B6B6B]">
                                        @{post.author?.handle} · {formatRelative(post.createdAt)}
                                    </div>
                                </div>
                            </div>

                            <p className="mt-4 text-[15px] leading-relaxed">{post.content}</p>

                            {post.restaurant && (
                                <Link
                                    to={`/restaurants/${post.restaurant.slug}`}
                                    className="mt-4 block rounded-2xl overflow-hidden border border-[#EAE6DF] hover:border-[#C8102E] transition-colors"
                                >
                                    <div className="grid sm:grid-cols-[140px_1fr]">
                                        <img
                                            src={post.restaurant.image}
                                            alt={post.restaurant.name}
                                            className="w-full h-full object-cover min-h-[110px]"
                                        />
                                        <div className="p-4">
                                            <div className="text-xs uppercase tracking-widest text-[#6B6B6B] mb-1">
                                                {post.restaurant.city} · {post.restaurant.cuisine}
                                            </div>
                                            <div className="text-xl font-bold">{post.restaurant.name}</div>
                                            <div className="text-sm text-[#6B6B6B] mt-1">
                                                {post.restaurant.chef} · {post.restaurant.priceRange}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )}

                            <div className="flex items-center gap-5 mt-4 text-[#6B6B6B]">
                <span className="inline-flex items-center gap-1 text-sm">
                  <Heart className="w-4 h-4" /> {post.likes}
                </span>
                                <span className="inline-flex items-center gap-1 text-sm">
                  <MessageCircle className="w-4 h-4" /> Commenter
                </span>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Feed;

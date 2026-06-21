import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';

export const BlogDetails = () => {
  const { slug } = useParams();

  const blogDatabase = {
    "mechanical-chronographs": {
      title: "The Art of Mechanical Chronographs",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      date: "June 18, 2026",
      readTime: "6 min read",
      author: "Edward V. Mercer",
      body: "Mechanical chronographs represent the zenith of watch complications. Driven by an intricate system of column wheels, levers, and hairsprings, these timepieces function independently of battery grids. Historically utilized for aviator logs and race pacing, they now exist as symbols of premium vintage craftsmanship..."
    },
    "designer-outerwear-guide": {
      title: "A Modern Guide to Designer Outerwear",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
      date: "May 29, 2026",
      readTime: "4 min read",
      author: "Sophia R. Sterling",
      body: "Transition weather requires thoughtful styling configurations. Luxury outerwear balances breathability with robust wind defense, utilizing double-face wool, treated canvases, and waterproof elements. When selecting premium coats, priority must be given to shoulders alignment and sleeve drape..."
    },
    "security-tokenization-decoded": {
      title: "E-Commerce Security: Tokenization Decoded",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800",
      date: "April 15, 2026",
      readTime: "8 min read",
      author: "Marcus T. Chen",
      body: "Tokenization represents the modern gold standard of checkout security. Unlike legacy databases that cached debit parameters, tokenized architectures swap customer cards with secure mathematical hashes. If a network bridge is intercepted, hackers resolve useless keys, safeguarding client accounts..."
    }
  };

  const post = blogDatabase[slug] || {
    title: "Article Not Found",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    date: "June 21, 2026",
    readTime: "0 min read",
    author: "System Curator",
    body: "The requested article is not found in the Nexa Journal database."
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
      <Helmet>
        <title>{post.title} | Nexa Journal</title>
      </Helmet>

      <div>
        <Link 
          to="/blog" 
          className="inline-flex items-center space-x-1 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Journal</span>
        </Link>
      </div>

      <div className="space-y-4">
        <h1 className="font-poppins text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">{post.title}</h1>
        
        <div className="flex items-center space-x-4 text-xs text-gray-400 font-inter border-b border-gray-100 pb-4">
          <span className="font-semibold text-gray-700">By {post.author}</span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{post.date}</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{post.readTime}</span>
          </span>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden h-80 bg-gray-100">
        <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
      </div>

      <article className="prose prose-red max-w-none text-sm leading-relaxed text-gray-600 font-inter whitespace-pre-line py-4">
        {post.body}
      </article>
    </div>
  );
};
export default BlogDetails;

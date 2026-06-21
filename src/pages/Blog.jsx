import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Clock, ArrowRight } from 'lucide-react';

export const Blog = () => {
  const posts = [
    {
      title: "The Art of Mechanical Chronographs",
      slug: "mechanical-chronographs",
      excerpt: "Deep dive into the delicate gearworks, complications, and history powering luxury wristwatches.",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
      date: "June 18, 2026",
      readTime: "6 min read"
    },
    {
      title: "A Modern Guide to Designer Outerwear",
      slug: "designer-outerwear-guide",
      excerpt: "Unpacking fabric weight, luxury tailoring, and matching accents for transition seasons.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600",
      date: "May 29, 2026",
      readTime: "4 min read"
    },
    {
      title: "E-Commerce Security: Tokenization Decoded",
      slug: "security-tokenization-decoded",
      excerpt: "How modern retailers secure payment pipelines using state-of-the-art secure hash keys.",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600",
      date: "April 15, 2026",
      readTime: "8 min read"
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      <Helmet>
        <title>Nexa Journal | NexaCommerce Premium</title>
      </Helmet>

      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#E63946] font-poppins">Nexa Journal</span>
        <h1 className="font-poppins text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Luxury Retrospective</h1>
        <p className="text-sm text-gray-500 font-inter max-w-sm mx-auto">
          Insights, tips, and design reviews authored by our brand curators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div 
            key={post.slug}
            className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="h-48 overflow-hidden bg-gray-100 relative">
              <img src={post.image} alt={post.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[10px] font-semibold text-gray-400 font-inter">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span className="flex items-center space-x-0.5">
                    <Clock className="h-3 w-3" />
                    <span>{post.readTime}</span>
                  </span>
                </div>
                <h3 className="font-poppins font-bold text-gray-900 text-md group-hover:text-[#E63946] transition-colors leading-snug">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-xs text-gray-500 font-inter leading-relaxed line-clamp-2">{post.excerpt}</p>
              </div>

              <Link 
                to={`/blog/${post.slug}`} 
                className="text-xs font-bold text-[#E63946] flex items-center space-x-1 hover:text-[#C1121F] mt-auto"
              >
                <span>Read Article</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Blog;

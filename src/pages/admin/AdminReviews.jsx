import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminReviews, approveReview, deleteReview } from '../../redux/slices/adminSlice';
import { MessageSquare, Star, Check, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export const AdminReviews = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  const { reviews, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminReviews(page));
  }, [dispatch, page]);

  const handleApprove = async (id) => {
    try {
      await dispatch(approveReview(id)).unwrap();
      toast.success('Review approved and visible on storefront');
      dispatch(fetchAdminReviews(page));
    } catch (err) {
      toast.error('Failed to approve review');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await dispatch(deleteReview(id)).unwrap();
      toast.success('Review deleted successfully');
      dispatch(fetchAdminReviews(page));
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  const reviewsList = reviews?.data || reviews || [];

  return (
    <div className="space-y-6 animate-fadeIn text-gray-200">
      <div className="pb-4 border-b border-gray-800">
        <h1 className="font-poppins text-2xl font-bold text-white font-poppins">Review Moderator</h1>
        <p className="text-xs text-gray-500 font-inter mt-1">Audit, approve, or delete pending client reviews.</p>
      </div>

      {loading && reviewsList.length === 0 ? (
        <div className="flex justify-center py-12">
          <RefreshCw className="h-6 w-6 text-[#E63946] animate-spin" />
        </div>
      ) : reviewsList.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-250 border-gray-200 p-12 text-center text-sm text-gray-500">
          No reviews pending moderation.
        </div>
      ) : (
        <div className="space-y-4">
          {reviewsList.map((rev) => (
            <div 
              key={rev.id}
              className="rounded-xl border border-gray-800 bg-[#0E1322] p-5 shadow-sm space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <strong className="text-sm font-semibold text-white">{rev.user?.name || 'Customer'}</strong>
                  <span className="block text-[10px] text-gray-400 font-inter mt-0.5">Product: {rev.product?.name}</span>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < rev.rating ? 'fill-current' : 'text-gray-700'}`} />
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-400 font-inter leading-relaxed bg-[#0A0D18] p-3 rounded-lg border border-gray-800/40">
                "{rev.review_text}"
              </p>

              <div className="flex justify-between items-center text-[10px] text-gray-500 font-inter">
                <span>Posted on: {new Date(rev.created_at).toLocaleDateString()}</span>
                
                <div className="flex items-center space-x-2">
                  {!rev.approved && (
                    <button
                      onClick={() => handleApprove(rev.id)}
                      className="inline-flex items-center space-x-1 rounded bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-500 hover:bg-emerald-500/20 cursor-pointer transition-colors"
                    >
                      <Check className="h-3 w-3" />
                      <span>Approve</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="inline-flex items-center space-x-1 rounded bg-red-500/10 px-2.5 py-1 text-[10px] font-bold text-red-400 hover:bg-red-500/20 cursor-pointer transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default AdminReviews;

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addProductReview } from "../../redux/slices/productsSlice";
import { toast } from "sonner";

const ProductReviewForm = ({ productId }) => {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

 const submitHandler = async (e) => {
  e.preventDefault();
  if (!rating) return alert("Rating required");

  try {
    await dispatch(
      addProductReview({ productId, rating, comment })
    ).unwrap();

    toast.success("Review submitted");
    setRating(0);
    setComment("");
  } catch (err) {
    
    toast.error(err.message);
    setRating(0);
    setComment("");
  }
};


  return (
    <form onSubmit={submitHandler} className="mt-3 border rounded p-3 bg-gray-50">
      <p className="font-medium mb-2">Rate this product</p>

      {/* ⭐ stars */}
      <div className="flex gap-1 mb-2">
        {[1,2,3,4,5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => setRating(star)}
            className={`text-2xl ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a review (optional)"
        className="w-full border p-2 rounded mb-2"
      />

      <button className="bg-black text-white px-4 py-1 rounded">
        Submit Review
      </button>
    </form>
  );
};

export default ProductReviewForm;

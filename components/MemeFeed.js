"use client";
import React, { useState, useEffect, useRef } from "react";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";

const MemeFeed = () => {
  const [memes, setMemes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef(null);
  const firstRender = useRef(true); // Track first render

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false; // Skip first render
      return;
    }
    fetchMemes();
  }, [page]);

  const fetchMemes = async () => {
    if (!hasMore || loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/memes?page=${page}`);
      const data = await res.json();

      setMemes((prev) => [...prev, ...data.memes]);
      setHasMore(data.memes.length > 0);
    } catch (error) {
      console.error("Failed to fetch memes:", error);
    }
    setLoading(false);
  };

  const lastMemeRef = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (node) observer.current.observe(node);
  };

  return (
    <div className="w-full flex flex-col items-center text-white bg-black pt-10">
      <div className="w-full max-w-lg">
        {memes.map((meme, index) => (
          <div
            key={index}
            ref={index === memes.length - 1 ? lastMemeRef : null}
            className="w-full p-4 bg-black pt-3"
          >
            <img
              src={meme.imageUrl}
              alt={meme.caption}
              className="rounded-lg w-full shadow-md"
            />
            <div className="bg-black px-5 py-1">
              <div className="flex items-center justify-between">
                <h1 className="text-gray-300">{meme.likes} likes </h1>
                <h1 className="text-gray-300">{meme.comments.length} comments </h1>
              </div>
              <div className="flex items-center gap-3 mt-2 mb-3 ">
                <FaRegHeart className="text-2xl"/>
                <FaRegComment className="text-2xl"/>
                <FaTelegramPlane className="text-2xl"/>
              </div>
              <p className="text-gray-300">{meme.caption}</p>
              <p className="text-sm text-gray-500">
                Uploaded by {meme.uploaderName}
              </p>
            </div>
            <hr className="text-gray-600/60 mt-3" />
          </div>
        ))}
      </div>

      {loading && <p className="text-gray-400 mt-4">Loading more memes...</p>}
      {hasMore && <div className="text-gray-400 mt-4 flex flex-col items-center justify-center">
        <IoCheckmarkDoneCircle className="text-5xl"/>
        <h1 className="mt-2 mb-10">End of Feed...</h1>
      </div>}
    </div>
  );
};

export default MemeFeed;

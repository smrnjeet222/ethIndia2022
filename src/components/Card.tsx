import React from "react";
import { Link } from "react-router-dom";

function Card() {
  return (
    <Link
      to={`/collection/blahblah`}
      className="cursor-pointer my-2 border-2 rounded-md border-black 
      hover:scale-105 duration-300
      shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
    >
      <figure>
        <img src="/logo.png" className="rounded-t h-72 w-full object-cover" />

        <figcaption className="p-4">
          <button
            onClick={(e) => e.preventDefault()}
            className="retro-btn w-full"
          >
            Fork it !!!
          </button>

          <small className="leading-5 text-gray-500 dark:text-gray-400"></small>
        </figcaption>
      </figure>
    </Link>
  );
}

export default Card;

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";

const MyCollection = () => {
  const { connector, isConnected } = useAccount();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isConnected) {
      navigate("/");
    }
  }, []);

  return (
    <div className="container m-auto my-4">
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-black">My Grids</h3>
        <button className="py-2 px-4 text-lg w-max retro-btn">
          Create a Grid
        </button>
      </div>
    </div>
  );
};

export default MyCollection;

import { Contract, ContractInterface } from "ethers";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import COLLECTION_ABI from "../collection_abi.json";
import CreateGridBtn from "./CreateGridBtn";
import ForkItBtn from "./ForkItBtn";

function Card({ collection }: any) {
  const { address, connector } = useAccount();
  const [data, setData] = useState<any>({});
  const [refetchTrigger, setRefetchTrigger] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    (async () => {
      const signer = await connector?.getSigner();
      const collectionContract = new Contract(
        collection,
        COLLECTION_ABI as ContractInterface,
        signer
      );
      const M = (await collectionContract.M()).toString();
      const N = (await collectionContract.N()).toString();
      const owner = await collectionContract.Owner();
      const parent = await collectionContract.Parent();
      const minted = await collectionContract.minted();
      const baseURI = await collectionContract.baseURI();

      const name = await collectionContract.name();
      const sym = await collectionContract.symbol();

      setData({ name, sym, M, N, owner, parent, minted, baseURI });
      setLoading(false);
    })();
  }, [collection, refetchTrigger]);

  const handleCompleteCollection = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const signer = await connector?.getSigner();

    const collectionContract = new Contract(
      collection,
      COLLECTION_ABI as ContractInterface,
      signer
    );

    try {
      const completeTx = await collectionContract.complete();
      await completeTx.wait();
      setRefetchTrigger((p) => !p);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div
      className="my-2 border-2 rounded-md border-black 
      hover:scale-105 duration-300 overflow-hidden
      shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
    >
      <figure>
        <img
          src={loading ? "/loader.svg" : data.baseURI || "/logo.png"}
          className="cursor-pointer hover:scale-110 duration-300 w-full object-cover border-b-2 border-black"
          onClick={() => navigate(`/collection/${collection}`)}
        />

        <figcaption className="p-4">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl font-semibold">
              {data.name?.slice(0, 12) ?? " - "}
            </span>{" "}
            <span className="font-mono">({data.sym ?? " - "})</span>
          </div>
          <p className="mb-3">
            Size: {data.M ?? "-"} x {data.N ?? "-"}
          </p>

          {!data.name ? (
            "..."
          ) : data.minted ? (
            <ForkItBtn collection={collection} />
          ) : address === data.owner ? (
            <button
              className="retro-btn w-full"
              onClick={handleCompleteCollection}
            >
              Complete Grid
            </button>
          ) : (
            <code className="leading-5 text-xs text-error">
              Grid is not yet completed by the owner.
            </code>
          )}
        </figcaption>
      </figure>
    </div>
  );
}

export default Card;

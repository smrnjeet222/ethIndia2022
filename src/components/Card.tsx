import { Contract, ContractInterface } from "ethers";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import COLLECTION_ABI from "../collection_abi.json";

function Card({ collection }: any) {
  const { address, connector } = useAccount();
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);

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
  }, [collection]);

  return (
    <Link
      to={`/collection/blahblah`}
      className="cursor-pointer my-2 border-2 rounded-md border-black 
      hover:scale-105 duration-300
      shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
    >
      <figure>
        <img
          src={loading ? "/loader.svg" : data.baseURI || "/logo.png"}
          className="rounded-t h-72 w-full object-cover border-b-2 border-black"
        />

        <figcaption className="p-4">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl font-semibold">{data.name ?? " - "}</span> <span className="font-mono">({data.sym ?? " - "})</span>
          </div>
          <p className="mb-2">
            Size: {data.M ?? "-"} x {data.N ?? "-"}
          </p>

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

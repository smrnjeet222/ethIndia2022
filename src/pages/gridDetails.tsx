import axios from "axios";
import { Contract, ContractInterface } from "ethers";
import React, { useEffect, useState } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import COLLECTION_ABI from "../contracts/collection_abi.json";

function GridDetails() {
  const { collectionId } = useParams();
  const { address, connector } = useAccount();
  const [data, setData] = useState<any>({});
  const [mints, setMints] = useState<any[]>([]);

  const fetchMints = async () => {
    const resp = await axios.post(
      "https://api.thegraph.com/subgraphs/name/yashthakor/eth-india-grid1",
      {
        query: `{
        mints(where: { collection_: {  id: "${collectionId}" } }) {
          id
          tokenId
        }
      }`,
        variables: null,
      }
    );

    setMints(resp.data.mints);
  };

  const handleCompleteCollection = async (e: any) => {
    e.preventDefault();
    if (!collectionId) return;
    const signer = await connector?.getSigner();

    const collectionContract = new Contract(
      collectionId,
      COLLECTION_ABI as ContractInterface,
      signer
    );

    try {
      const completeTx = await collectionContract.complete();
      await completeTx.wait();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!collectionId) return;
    try {
      (async () => {
        fetchMints()
          .then(console.log)
          .catch((error) => console.error("failed to fetch mints: ", error));

        const signer = await connector?.getSigner();
        const collectionContract = new Contract(
          collectionId,
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
      })();
    } catch (err) {
      console.error(err);
    }
  }, [collectionId]);

  console.log(data);

  if (!data.M || !data.N) return <progress className="progress"></progress>;

  return (
    <div className="container m-auto my-4">
      {data.owner === address && (
        <div className="flex justify-center my-4 mb-8">
          <button className="retro-btn" onClick={handleCompleteCollection}>
            Complete Grid
          </button>
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${data.M}, 1fr)`,
          gridTemplateRows: `repeat(${data.M}, 1fr)`,
        }}
        className="mx-auto w-2/3"
      >
        {[...Array(Number(data.M) * Number(data.N)).keys()].map((i) => (
          <div key={i} className="border border-black p-5 aspect-square">
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GridDetails;

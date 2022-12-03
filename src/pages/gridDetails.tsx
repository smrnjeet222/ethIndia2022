import axios from "axios";
import { Contract, ContractInterface } from "ethers";
import React, {useCallback, useEffect, useState} from "react";
import { Routes, Route, useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import Block from "../components/block";
import COLLECTION_ABI from "../contracts/collection_abi.json";

function GridDetails() {
  const { collectionId } = useParams();
  const { address, connector } = useAccount();
  const [data, setData] = useState<any>({});
  const [mints, setMints] = useState<any[]>([]);
  const [parentCollections, setParentCollections] = useState<any[]>([]);

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

    setMints(resp.data.data.mints);
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

  const fetchParent = useCallback((parent: string, otherParents: any[] = []) => {
    axios.post('https://api.thegraph.com/subgraphs/name/yashthakor/eth-india-grid1', {
      query: `{
        collection(id: "${parent}") {
          id
          parent
          baseUrl
          mint {
            id
            tokenId
          }
          name
          owner
        }
      }`,
      variables: null,
    })
        .then((resp) => {
          if (!resp.data?.data?.collection?.parent) {
            setParentCollections([...otherParents]);
            const mappedMints = Array.from({ length: Number(data.N) * Number(data.M) });
            mints.map((m) => {
              mappedMints[Number(m.tokenId.toString())] = {
                ...m,
                meta: `${data.baseURI}/${m.tokenId}.json`,
              }
            })
            otherParents.reverse().map((op: any) => {
              op.mints.map((mint: any) => {
                if (!mappedMints[Number(mint.tokenId)]) {
                  mappedMints[Number(mint.tokenId.toString())] = {
                    ...mint,
                    meta: `${op.baseUrl}/${mint.tokenId}.json`,
                  }
                }
              });
            });
            setMints([...mappedMints]);
            return;
          }
          fetchParent(resp.data?.data?.collection?.parent, [...otherParents, resp.data?.data?.collection]);
        })
        .catch((error) => console.error('failed to fetch parents: ', error))
        .finally(() => setParentCollections([...otherParents]));
  }, [mints, data?.N, data?.M]);

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

  useEffect(() => {
    if (data.N && data.M) {
      fetchParent(data.parent, []);
    }
  }, [data?.N, data?.M, data?.parent]);

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
        {mints.map((m, i) => (
          <div
              key={m?.tokenId || i}
              className="border border-black p-5 aspect-square"
              // mint={m}
          >
            <Block key={i} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default GridDetails;

import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import {Contract, utils} from 'ethers';
// import InfiniteScroll from 'react-infinite-scroll-component';

import { Factory_abi, Multicall } from '../contracts/types';
import CFABI from '../contracts/factory_abi.json';
// import CABI from '../contracts/collection_abi.json';
// import MulticallABI from '../contracts/multicall.json';
import { FACTORY_ADDRESS, MULTICALL_ADDRESS } from "../constants";
import Card from "../components/Card";

import CreateGridBtn from "../components/CreateGridBtn";

const MyCollection = () => {
  const { connector, isConnected, address } = useAccount();
  const navigate = useNavigate();
  const [collectionAddresses, setCollectionAddresses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState<number>(10);
  const [listState, setListState] = useState<{
    list: any[];
    total: null | number;
  }>({
    list: [],
    total: null,
  });

  useEffect(() => {
    if (!isConnected && !address) {
      navigate("/");
    }
    getUserCollections().catch((error) =>
      console.error("failed to fetch user collections: ", error)
    );
  }, [isConnected, address]);

  const getUserCollections = async () => {
    setLoading(true);
    const provider = await connector?.getSigner();
    const cf: Factory_abi = new Contract(
      FACTORY_ADDRESS,
      CFABI,
      provider
    ) as Factory_abi;

    if (address) {
      const collections = await cf.getUserCollections(address);

      setCollectionAddresses(collections);
      setListState({
        ...listState,
        total: collections.length,
      });
      // getUserCollectionsDetails(collections)
      //     .catch((error) => console.error('failed to fetch user collections: ', error));
    }
    setLoading(false);
  };

  // const getUserCollectionsDetails = useCallback(async (cAddress: string[] = collectionAddresses) => {
  //   const provider = await connector?.getSigner()
  //   const collectionToFetch = cAddress.slice(listState.list.length, pageCount);
  //   const CI = new utils.Interface(CABI);
  //   const Multicall: Multicall = new Contract(MULTICALL_ADDRESS, MulticallABI, provider) as Multicall;
  //
  //   let calls: any[] = [];
  //
  //   collectionToFetch.map((target) => {
  //     calls.push({
  //       target,
  //       callData: CI.encodeFunctionData('name', [])
  //     });
  //     calls.push({
  //       target,
  //       callData: CI.encodeFunctionData('symbol', [])
  //     });
  //     calls.push({
  //       target,
  //       callData: CI.encodeFunctionData('M', [])
  //     });
  //     calls.push({
  //       target,
  //       callData: CI.encodeFunctionData('N', [])
  //     });
  //     calls.push({
  //       target,
  //       callData: CI.encodeFunctionData('Parent', [])
  //     });
  //     calls.push({
  //       target,
  //       callData: CI.encodeFunctionData('minted', [])
  //     });
  //     calls.push({
  //       target,
  //       callData: CI.encodeFunctionData('baseURI', [])
  //     });
  //   });
  //   const responses = await Multicall.aggregate(calls);
  //
  //   const collections: any[] = []
  //   collectionToFetch.map((collectionAddress, index) => {
  //     const startIndex = index * 7
  //     collections.push({
  //       id: collectionAddress,
  //       name: hex_to_ascii(responses.returnData[startIndex].split('0x')[1]),
  //       symbol: hex_to_ascii(responses.returnData[startIndex + 1].split('0x')[1]),
  //       m: hex_to_ascii(responses.returnData[startIndex + 2].split('0x')[1]),
  //       n: hex_to_ascii(responses.returnData[startIndex + 3].split('0x')[1]),
  //       parent: hex_to_ascii(responses.returnData[startIndex + 4].split('0x')[1]),
  //       minted: Boolean(hex_to_ascii(responses.returnData[startIndex + 5].split('0x')[1])),
  //       baseURI: hex_to_ascii(responses.returnData[startIndex + 6].split('0x')[1]),
  //     });
  //   });
  //
  //   setListState({
  //     ...listState,
  //     list: [...listState.list, ...collections],
  //   });
  // }, [collectionAddresses, listState]);

  return (
    <div className={`container m-auto  ${loading ? "my-0" : "my-6"}`}>
      {loading && <progress className="progress my-1"></progress>}
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-black">My Grids</h3>
        <CreateGridBtn />
      </div>
      <div className="my-8 grid grid-flow-row gap-6 text-neutral-600 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {collectionAddresses.map((c) => (
          <Card collection={c} />
        ))}
      </div>
    </div>
  );
};

export default MyCollection;

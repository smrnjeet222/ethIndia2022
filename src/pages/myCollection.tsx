import {useEffect, useState} from "react";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import {Contract, utils} from 'ethers';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Factory_abi, Multicall } from '../contracts/types';
import CFABI from '../contracts/factory_abi.json';
import CABI from '../contracts/collection_abi.json';
import MulticallABI from '../contracts/multicall.json';
import { FACTORY_ADDRESS, MULTICALL_ADDRESS } from "../constants";
import Card from "../components/Card";



const MyCollection = () => {
  const { connector, isConnected, address } = useAccount();
  const navigate = useNavigate();
  const [collectionAddresses, setCollectionAddresses] = useState<string[]>([]);
  const [pageCount, setPageCount] = useState<number>(10);
  const [listState, setListState] = useState<{
    list: any[]
    total: null | number
  }>({
    list: [],
    total: null
  })

  useEffect(() => {
    if (!isConnected || !address) {
      navigate("/");
    }
    getUserCollections()
        .catch((error) => console.error('failed to fetch user collections: ', error));
  }, [isConnected, address]);

  const getUserCollections = async () => {
    const cf: Factory_abi = new Contract(FACTORY_ADDRESS, CFABI) as Factory_abi;

    if (address) {
      const collections = await cf.getUserCollections(address);

      setCollectionAddresses(collections);
      setListState({
        ...listState,
        total: collections.length,
      });
    }
  }

  const getUserCollectionsDetails = async () => {
    const collectionToFetch = collectionAddresses.slice(listState.list.length, pageCount);
    const CI = new utils.Interface(CABI);
    const Multicall: Multicall = new Contract(MULTICALL_ADDRESS, MulticallABI) as Multicall;

    let calls: any[] = [];

    collectionToFetch.map((target) => {
      calls.push({
        target,
        callData: CI.encodeFunctionData('name')
      });
      calls.push({
        target,
        callData: CI.encodeFunctionData('symbol')
      });
      calls.push({
        target,
        callData: CI.encodeFunctionData('M')
      });
      calls.push({
        target,
        callData: CI.encodeFunctionData('N')
      });
      calls.push({
        target,
        callData: CI.encodeFunctionData('Parent')
      });
      calls.push({
        target,
        callData: CI.encodeFunctionData('minted')
      });
      calls.push({
        target,
        callData: CI.encodeFunctionData('baseURI')
      });
    });
    const responses = await Multicall.aggregate(calls);

    const collections: any[] = []
    collectionToFetch.map((collectionAddress, index) => {
      const startIndex = index * 7
      collections.push({
        id: collectionAddress,
        name: responses[startIndex],
        symbol: responses[startIndex + 1],
        m: responses[startIndex + 2],
        n: responses[startIndex + 3],
        parent: responses[startIndex + 4],
        minted: responses[startIndex + 5],
        baseURI: responses[startIndex + 6],
      });
    });

    setListState({
      ...listState,
      list: [...listState.list, ...collections],
    });
  }

  return (
    <div className="container m-auto my-4">
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-black">My Grids</h3>
        <button className="py-2 px-4 text-lg w-max retro-btn">
          Create a Grid
        </button>
      </div>
      <InfiniteScroll
          dataLength={listState.list.length}
          next={getUserCollectionsDetails}
          hasMore={listState.total == null || listState.list.length < listState.total}
          className="my-8 grid grid-flow-row gap-6 text-neutral-600 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          loader={'loading...'}
      >
        {listState.list.map((c) => (
            <Card
                collection={c.id}
                baseURI={c.baseURI}
                M={c.m}
                N={c.n}
                Name={c.name}
                Symbol={c.symbol}
            />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default MyCollection;

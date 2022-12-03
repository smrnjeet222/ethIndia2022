import { Contract, ContractInterface } from "ethers";
import { useState } from "react";
import { useAccount } from "wagmi";
import { FACTORY_ADDRESS } from "../constants";
import COLLECTION_ABI from "../contracts/collection_abi.json";
import FACTORY_ABI from "../contracts/factory_abi.json";

function CreateGridBtn() {
  const { connector } = useAccount();
  const [loading, setLoading] = useState(false);

  const handleForm = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    let { name, sym, m, n } = e.target;
    [name, sym, m, n] = [name.value, sym.value, m.value, n.value];

    console.log({ name, sym, m, n });

    const signer = await connector?.getSigner();

    const contract = new Contract(FACTORY_ADDRESS, FACTORY_ABI as ContractInterface, signer);

    const createTx = await contract.createCollection(name, sym, m, n);

    const txReceipt = await createTx.wait();

    const collectionAddress = (
      (txReceipt.events || []).find(
        (e: { event: string }) => e.event === "CollectionCreated"
      ) || { args: { Collection: null } }
    ).args?.Collection;

    const collectionContract = new Contract(
      collectionAddress,
      COLLECTION_ABI as ContractInterface,
      signer
    );

    const setBaseUriTx = await collectionContract.setBaseURI(`demo.com`)

    await setBaseUriTx.wait();

    setLoading(false);
    window.location.reload();
  };
  return (
    <>
      <label htmlFor="my-modal-6" className="py-2 px-4 text-lg w-max retro-btn">
        Create a Grid
      </label>

      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <label
            htmlFor="my-modal-6"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="font-bold text-lg">Create Your Grid</h3>
          <form onSubmit={handleForm} className="form-control gap-4 pt-8">
            <label className="input-group input-group-md">
              <span>Grid&nbsp;Name</span>
              <input
                name="name"
                type="text"
                placeholder="Enter Name"
                className="input input-bordered input-md w-full"
              />
            </label>
            <label className="input-group input-group-md">
              <span>Symbol</span>
              <input
                name="sym"
                type="text"
                placeholder="Enter Symbol"
                className="input input-bordered input-md w-full"
              />
            </label>
            <label className="input-group input-group-md">
              <span>Size</span>
              <input
                name="m"
                type="number"
                placeholder="Width"
                min={0}
                step={1}
                className="input input-bordered input-md w-full"
              />
              <small className="flex place-content-center m-2 text-lg text-neutral">
                X
              </small>
              <input
                name="n"
                type="number"
                placeholder="Height"
                min={0}
                step={1}
                className="input input-bordered input-md w-full"
              />
            </label>

            <div className="modal-action justify-center">
              <button
                type="submit"
                className={`btn btn-wide ${loading && "loading"}`}
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateGridBtn;

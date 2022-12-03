import { Dialog, Transition } from "@headlessui/react";
import { Contract, ContractInterface } from "ethers";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { FACTORY_ADDRESS } from "../App";
import COLLECTION_ABI from "../collection_abi.json";
import FACTORY_ABI from "../factory_abi.json";

export default function ForkItBtn({ collection }: any) {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const { connector } = useAccount();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForm = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    let { name, sym } = e.target;
    [name, sym] = [name.value, sym.value];

    console.log({ name, sym });

    const signer = await connector?.getSigner();

    const contract = new Contract(
      FACTORY_ADDRESS,
      FACTORY_ABI as ContractInterface,
      signer
    );

    try {
      const forkTx = await contract.forkCollection(name, sym, collection);

      const txReceipt = await forkTx.wait();

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

      const setBaseUriTx = await collectionContract.setBaseURI(`demo.com`);

      await setBaseUriTx.wait();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
    closeModal();
    navigate("/my-collection")
    // window.location.reload();
  };

  return (
    <>
      <button type="button" onClick={openModal} className="retro-btn w-full">
        Fork It !!!
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="modal modal-open modal-bottom sm:modal-middle">
                  <div className="modal-box">
                    <label
                      className="btn btn-sm btn-circle absolute right-2 top-2"
                      onClick={closeModal}
                    >
                      ✕
                    </label>
                    <h3 className="font-bold text-lg">Fork This Grid</h3>
                    <small>{collection}</small>
                    <form
                      onSubmit={handleForm}
                      className="form-control gap-4 pt-8"
                    >
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

                      <div className="modal-action justify-center">
                        <button
                          type="submit"
                          className={`btn btn-wide ${loading && "loading"}`}
                        >
                          Fork It !!!
                        </button>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

import { useAccount } from "wagmi";
import Card from "../components/Card";
import CreateGridBtn from "../components/CreateGridBtn";

const Home = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  if (isConnecting)
    return (
      <div className="container text-center m-auto my-4 text-4xl">
        Connecting...
      </div>
    );
  if (isDisconnected)
    return (
      <div className="container text-center m-auto my-4 text-4xl">
        Disconnected
      </div>
    );
  return (
    <div className="container m-auto my-4">
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-black">Explore Grids</h3>
        <CreateGridBtn />
      </div>
      <div className="my-8 grid grid-flow-row gap-6 text-neutral-600 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
};

export default Home;

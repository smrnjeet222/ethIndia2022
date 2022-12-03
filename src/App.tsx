import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { Route, Routes } from "react-router-dom";
import { createClient, WagmiConfig } from "wagmi";
import { NFTStorage } from 'nft.storage'
import Navbar from "./components/Navbar";
import GridDetails from "./pages/gridDetails";
import Home from "./pages/home";
import MyCollection from "./pages/myCollection";

const INFURA_ID = "fc380194e9eb418ea0702eef8018bf3d";
const NFT_STORAGE_TOKEN = 'your-api-token'

const client = createClient(
  getDefaultClient({
    appName: "Grid1",
    infuraId: INFURA_ID,
    autoConnect: true,
  })
);

const nftStorageClient = new NFTStorage({ token: NFT_STORAGE_TOKEN })

const App = () => {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider theme="retro">
        <Navbar />
        <div className="divider my-0"/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-collection" element={<MyCollection />} />
          <Route path="/collection/:collectionId" element={<GridDetails />} />
        </Routes>
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default App;

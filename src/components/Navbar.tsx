import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import { Link } from "react-router-dom";

function Navbar() {
  const { isConnected } = useAccount();
  return (
    <div className="container m-auto my-2 navbar bg-base-100">
      <div className="navbar-start gap-6">
        {/* <div className="avatar">
          <div className="w-14 rounded">
            <img src="/logo.svg" />
          </div>
        </div> */}
        <Link to="/" className="btn btn-sm normal-case text-md">
          Home
        </Link>
        {isConnected && (
          <Link to="/my-collection" className="btn btn-sm normal-case text-md">
            My Collection
          </Link>
        )}
      </div>
      <div className="navbar-center">
        <a className="uppercase text-4xl tracking-wider font-black">Grid1</a>
      </div>
      <div className="navbar-end">
        <ConnectKitButton  />
      </div>
    </div>
  );
}

export default Navbar;

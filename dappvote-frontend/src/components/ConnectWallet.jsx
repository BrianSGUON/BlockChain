export default function ConnectWallet({ account, onConnect }) {
  const truncate = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="connect-wallet">
      {account ? (
        <span className="address">{truncate(account)}</span>
      ) : (
        <button onClick={onConnect}>Connecter MetaMask</button>
      )}
    </div>
  );
}
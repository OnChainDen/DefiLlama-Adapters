const { getConfig } = require("../helper/cache");

const POOL_DATA_URI = "https://app.init.capital/static/json/pools.json";

const tvl = async (timestamp, block, _, { api }) => {
  const allPoolData = await getConfig("init-capital", POOL_DATA_URI);
  const chainId = api.getChainId();

  const tokens = Object.keys(allPoolData[chainId]).map(
    (pool) => allPoolData[chainId][pool].underlyingToken
  );

  let pools = [];

  if (chainId === 81457) {
    pools = Object.keys(allPoolData[chainId]).map(
      (pool) => allPoolData[chainId][pool].rebaseWrapperAddress
    );
  } else {
    pools = Object.keys(allPoolData[chainId]);
  }

  return api.sumTokens({ tokensAndOwners2: [tokens, pools] });
};

const borrowed = async (timestamp, block, _, { api }) => {
  const allPoolData = await getConfig("init-capital", POOL_DATA_URI);
  const chainId = api.getChainId();
  const pools = Object.keys(allPoolData[chainId]);
  const tokens = Object.keys(allPoolData[chainId]).map(
    (pool) => allPoolData[chainId][pool].underlyingToken
  );

  let debts = await api.multiCall({ abi: "uint256:totalDebt", calls: pools });

  if (chainId === 81457) {
    debts = await api.multiCall({
      calls: debts.map((debt, i) => ({
        target: allPoolData[chainId][pools[i]].rebaseWrapperAddress,
        params: [debt],
      })),
      abi: "function toAmt(uint256) returns (uint256)",
    });
  }
  api.addTokens(tokens, debts);
};

module.exports = {
  methodology:
    "Count all the underlying locked and borrowed under every INIT Lending Pools",
  mantle: {
    tvl,
    borrowed,
  },
  blast: {
    tvl,
    borrowed,
  },
};

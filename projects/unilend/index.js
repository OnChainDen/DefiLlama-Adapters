
const { sumTokensExport } = require("../helper/unwrapLPs");

const UnilendContract = "0x13A145D215182924c89F2aBc7D358DCc72F8F788";
const tvl = { tvl: sumTokensExport({ owners: [UnilendContract], fetchCoValentTokens: true, blacklistedTokens: ['0x0202Be363B8a4820f3F4DE7FaF5224fF05943AB1', '0x5b4cf2c120a9702225814e18543ee658c5f8631e']})}

module.exports = {
  ethereum: tvl,
  polygon: tvl,
  bsc: tvl,
  methodology:
    "We count liquidity on the Pools through UnilendFlashLoansCore Contract",
};

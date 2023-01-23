const XXHASH64_HASH_ALGO='xxhash64'

module.exports = {
    trailingSlash: true,
    webpack: (
        config,
        options
      ) => {
        // console.log(
        //     `Overriding algorithm to use for webpack5: ${XXHASH64_HASH_ALGO}`
        // )
        config.output['hashFunction'] = XXHASH64_HASH_ALGO;

        return config
      },
};

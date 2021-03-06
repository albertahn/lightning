const {test} = require('tap');

const {getPeers} = require('./../../../lnd_methods');

const tests = [
  {
    args: {},
    description: 'LND is required',
    error: [400, 'ExpectedAuthenticatedLndToGetConnectedPeers'],
  },
  {
    args: {lnd: {default: {disconnectPeer: ({}, cbk) => cbk('err')}}},
    description: 'LND is required',
    error: [400, 'ExpectedAuthenticatedLndToGetConnectedPeers'],
  },
  {
    args: {lnd: {default: {listPeers: ({}, cbk) => cbk('err')}}},
    description: 'Errors are passed back',
    error: [503, 'UnexpectedGetPeersError', {err: 'err'}],
  },
  {
    args: {lnd: {default: {listPeers: ({}, cbk) => cbk()}}},
    description: 'A response is expected',
    error: [503, 'ExpectedResponseForListPeers'],
  },
  {
    args: {lnd: {default: {listPeers: ({}, cbk) => cbk(null, {})}}},
    description: 'An array response is expected',
    error: [503, 'ExpectedPeersArrayWhenListingPeers'],
  },
  {
    args: {lnd: {default: {listPeers: ({}, cbk) => cbk(null, {peers: [{}]})}}},
    description: 'An array of valid peers is expected',
    error: [503, 'ExpectedPeerAddressInRpcPeer'],
  },
  {
    args: {lnd: {default: {listPeers: ({}, cbk) => cbk(null, {peers: []})}}},
    description: 'Peers are returned',
    expected: {peers: []},
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, async ({deepEqual, end, equal, rejects}) => {
    if (!!error) {
      rejects(() => getPeers(args), error, 'Got expected error');
    } else {
      const {peers} = await getPeers(args);

      deepEqual(peers, expected.peers, 'Got expected peers');
    }

    return end();
  });
});

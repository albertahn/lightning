const {test} = require('tap');

const authenticatedLndGrpc = require('./../../lnd_grpc/authenticated_lnd_grpc');

const expectedServices = [
  'autopilot',
  'chain',
  'default',
  'invoices',
  'router',
  'signer',
  'tower_client',
  'tower_server',
  'version',
  'wallet',
];

const tests = [
  {
    args: {macaroon: Buffer.alloc(1).toString('hex')},
    description: 'An authenticated LND gRPC Object is returned',
    expected: {services: expectedServices},
  },
  {
    args: {cert: '00', macaroon: Buffer.alloc(1).toString('hex')},
    description: 'Passing a cert for the authenticated LND grpc is supported',
    expected: {services: expectedServices},
  },
];

tests.forEach(({args, description, expected}) => {
  return test(description, async ({deepIs, end, equal}) => {
    const {lnd} = authenticatedLndGrpc(args);

    equal(!!lnd, true, 'Got LND object');
    deepIs(Object.keys(lnd), expected.services, 'Got expected services');

    return end();
  });
});

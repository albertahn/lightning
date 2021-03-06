const {test} = require('tap');

const {verifyBackup} = require('./../../../lnd_methods');

const tests = [
  {
    args: {},
    description: 'A backup to verify is required',
    error: [400, 'ExpectedChannelBackupToVerify'],
  },
  {
    args: {backup: '00'},
    description: 'An authenticated LND object is required',
    error: [400, 'ExpectedLndToVerifyChannelBackup'],
  },
  {
    args: {
      backup: '00',
      lnd: {default: {verifyChanBackup: ({}, cbk) => cbk('err')}},
    },
    description: 'Channel backup is invalid',
    expected: {err: 'err', is_valid: false},
  },
  {
    args: {
      backup: '00',
      lnd: {default: {verifyChanBackup: ({}, cbk) => cbk()}},
    },
    description: 'Channel backup is valid',
    expected: {is_valid: true},
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, async ({deepEqual, end, equal, rejects}) => {
    if (!!error) {
      await rejects(verifyBackup(args), error, 'Got expected error');
    } else {
      const res = await verifyBackup(args);

      deepEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

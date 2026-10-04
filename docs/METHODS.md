# SDS Method Reference

Generated from [`https://sds0.steemworld.org`](https://sds0.steemworld.org) — reference version `0.1.10`, 22 modules, 285 methods. Source: [github.com/faisalamin9696/sds](https://github.com/faisalamin9696/sds).

| Module | Namespace | Group | Methods |
| --- | --- | --- | --- |
| [`blocks_api`](#blocks_api) | `sds.blocks` | Base | 14 |
| [`chain_api`](#chain_api) | `sds.chain` | Base | 10 |
| [`steem_requests_api`](#steem_requests_api) | `sds.steemRequests` | Base | 14 |
| [`transactions_api`](#transactions_api) | `sds.transactions` | Base | 4 |
| [`accounts_api`](#accounts_api) | `sds.accounts` | Accounts | 15 |
| [`account_history_api`](#account_history_api) | `sds.accountHistory` | Accounts | 6 |
| [`authorities_api`](#authorities_api) | `sds.authorities` | Accounts | 8 |
| [`delegations_api`](#delegations_api) | `sds.delegations` | Accounts | 5 |
| [`followers_api`](#followers_api) | `sds.followers` | Accounts | 13 |
| [`mentions_api`](#mentions_api) | `sds.mentions` | Accounts | 2 |
| [`notifications_api`](#notifications_api) | `sds.notifications` | Accounts | 9 |
| [`rewards_api`](#rewards_api) | `sds.rewards` | Accounts | 7 |
| [`transfers_api`](#transfers_api) | `sds.transfers` | Accounts | 7 |
| [`witnesses_api`](#witnesses_api) | `sds.witnesses` | Accounts | 15 |
| [`communities_api`](#communities_api) | `sds.communities` | Posts | 15 |
| [`content_history_api`](#content_history_api) | `sds.contentHistory` | Posts | 2 |
| [`content_search_api`](#content_search_api) | `sds.contentSearch` | Posts | 21 |
| [`feeds_api`](#feeds_api) | `sds.feeds` | Posts | 83 |
| [`posts_api`](#posts_api) | `sds.posts` | Posts | 14 |
| [`post_resteems_api`](#post_resteems_api) | `sds.postResteems` | Posts | 3 |
| [`post_tags_api`](#post_tags_api) | `sds.postTags` | Posts | 13 |
| [`system_api`](#system_api) | `sds.system` | System | 5 |

---

## `blocks_api`

Namespace: `sds.blocks` · Group: Base · 14 methods

### `sds.blocks.getConfig()`

Returns this module's active configuration.

- Route: `/blocks_api/getConfig`
- Result: JSON Object
- Example: `/blocks_api/getConfig`

_No parameters._

### `sds.blocks.getBlock()`

Returns the block for the given :blockNum.

- Route: `/blocks_api/getBlock/:blockNum/:withTransactions?/:withVirtualOps?`
- Result: JSON Object
- Example: `/blocks_api/getBlock/50000001`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `blockNum` | int | yes | — | 1 – 110139661 | — |
| `withTransactions` | bool | no | `true` | — | true | false | 1 | 0 |
| `withVirtualOps` | bool | no | `true` | — | true | false | 1 | 0 |

### `sds.blocks.getBlockById()`

Returns the block for the given :blockId.

- Route: `/blocks_api/getBlockById/:blockId/:withTransactions?/:withVirtualOps?`
- Result: JSON Object
- Example: `/blocks_api/getBlockById/02faf0817156fbe4752dd8de2b22b7a52dd37e2d`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `blockId` | hex_string (40) | yes | — | — | — |
| `withTransactions` | bool | no | `true` | — | true | false | 1 | 0 |
| `withVirtualOps` | bool | no | `true` | — | true | false | 1 | 0 |

### `sds.blocks.getBlocksInRange()`

Returns the blocks for the given range (:fromBlockNum to :toBlockNum).
**Ranges**: [ { "from": "fromBlockNum", "to": "toBlockNum", "limit": 250 } ]

- Route: `/blocks_api/getBlocksInRange/:fromBlockNum-:toBlockNum/:withTransactions?/:withVirtualOps?`
- Result: JSON Array
- Max. limit: 250
- Example: `/blocks_api/getBlocksInRange/50000001-50000100`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `fromBlockNum` | int | yes | — | 1 – 110139661 | — |
| `toBlockNum` | int | yes | — | 1 – 110139661 | — |
| `withTransactions` | bool | no | `true` | — | true | false | 1 | 0 |
| `withVirtualOps` | bool | no | `true` | — | true | false | 1 | 0 |

### `sds.blocks.getTransactionsInBlock()`

Returns all transactions for the given :blockNum.

- Route: `/blocks_api/getTransactionsInBlock/:blockNum`
- Result: JSON Array
- Example: `/blocks_api/getTransactionsInBlock/50000001`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `blockNum` | int | yes | — | 1 – 110139661 | — |

### `sds.blocks.getTransactionsInBlockRange()`

Returns all transactions for the given block range (:fromBlockNum to :toBlockNum).
**Ranges**: [ { "from": "fromBlockNum", "to": "toBlockNum", "limit": 250 } ]

- Route: `/blocks_api/getTransactionsInBlockRange/:fromBlockNum-:toBlockNum`
- Result: JSON Array
- Max. limit: 250
- Example: `/blocks_api/getTransactionsInBlockRange/50000001-50000100`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `fromBlockNum` | int | yes | — | 1 – 110139661 | — |
| `toBlockNum` | int | yes | — | 1 – 110139661 | — |

### `sds.blocks.getOpsInBlock()`

Returns all operations for the given :blockNum.

- Route: `/blocks_api/getOpsInBlock/:blockNum/:withVirtualOps?/:opTypes?`
- Result: JSON Array
- Example: `/blocks_api/getOpsInBlock/50000001`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `blockNum` | int | yes | — | 1 – 110139661 | — |
| `withVirtualOps` | bool | no | `true` | — | true | false | 1 | 0 |
| `opTypes` | fixed_csv | no | `*` | — | account_create | account_create_with_delegation | account_update | account_update2 | account_witness_proxy | account_witness_vote | author_reward | cancel_transfer_from_savings | … (59 values) |

### `sds.blocks.getOpsInBlockRange()`

Returns an array (one element per block) with all operations for the given block range (:fromBlockNum to :toBlockNum).
**Ranges**: [ { "from": "fromBlockNum", "to": "toBlockNum", "limit": 250 } ]

- Route: `/blocks_api/getOpsInBlockRange/:fromBlockNum-:toBlockNum/:withVirtualOps?/:opTypes?`
- Result: JSON Array
- Max. limit: 250
- Example: `/blocks_api/getOpsInBlockRange/50000001-50000100`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `fromBlockNum` | int | yes | — | 1 – 110139661 | — |
| `toBlockNum` | int | yes | — | 1 – 110139661 | — |
| `withVirtualOps` | bool | no | `true` | — | true | false | 1 | 0 |
| `opTypes` | fixed_csv | no | `*` | — | account_create | account_create_with_delegation | account_update | account_update2 | account_witness_proxy | account_witness_vote | author_reward | cancel_transfer_from_savings | … (59 values) |

### `sds.blocks.getOpsInBlockRangeAsArray()`

Returns an array including all operations for the given block range (:fromBlockNum to :toBlockNum).
**Ranges**: [ { "from": "fromBlockNum", "to": "toBlockNum", "limit": 250 } ]

- Route: `/blocks_api/getOpsInBlockRangeAsArray/:fromBlockNum-:toBlockNum/:withVirtualOps?/:opTypes?`
- Result: JSON Array
- Max. limit: 250
- Example: `/blocks_api/getOpsInBlockRangeAsArray/50000001-50000100/0/comment`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `fromBlockNum` | int | yes | — | 1 – 110139661 | — |
| `toBlockNum` | int | yes | — | 1 – 110139661 | — |
| `withVirtualOps` | bool | no | `true` | — | true | false | 1 | 0 |
| `opTypes` | fixed_csv | no | `*` | — | account_create | account_create_with_delegation | account_update | account_update2 | account_witness_proxy | account_witness_vote | author_reward | cancel_transfer_from_savings | … (59 values) |

### `sds.blocks.getOpsInBlockRangeGrouped()`

Returns an object including all operations for the given block range (:fromBlockNum to :toBlockNum) grouped by type.
**Ranges**: [ { "from": "fromBlockNum", "to": "toBlockNum", "limit": 250 } ]

- Route: `/blocks_api/getOpsInBlockRangeGrouped/:fromBlockNum-:toBlockNum/:withVirtualOps?/:opTypes?`
- Result: JSON Object
- Max. limit: 250
- Example: `/blocks_api/getOpsInBlockRangeGrouped/50000001-50000100`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `fromBlockNum` | int | yes | — | 1 – 110139661 | — |
| `toBlockNum` | int | yes | — | 1 – 110139661 | — |
| `withVirtualOps` | bool | no | `true` | — | true | false | 1 | 0 |
| `opTypes` | fixed_csv | no | `*` | — | account_create | account_create_with_delegation | account_update | account_update2 | account_witness_proxy | account_witness_vote | author_reward | cancel_transfer_from_savings | … (59 values) |

### `sds.blocks.getVirtualOpsInBlock()`

Returns all virtual operations for the given :blockNum.

- Route: `/blocks_api/getVirtualOpsInBlock/:blockNum`
- Result: JSON Array
- Example: `/blocks_api/getVirtualOpsInBlock/50000001`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `blockNum` | int | yes | — | 1 – 110139661 | — |

### `sds.blocks.getVirtualOpsInBlockRange()`

Returns the virtual operations for the given block range (:fromBlockNum to :toBlockNum).
**Ranges**: [ { "from": "fromBlockNum", "to": "toBlockNum", "limit": 250 } ]

- Route: `/blocks_api/getVirtualOpsInBlockRange/:fromBlockNum-:toBlockNum`
- Result: JSON Array
- Max. limit: 250
- Example: `/blocks_api/getVirtualOpsInBlockRange/50000001-50000100`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `fromBlockNum` | int | yes | — | 1 – 110139661 | — |
| `toBlockNum` | int | yes | — | 1 – 110139661 | — |

### `sds.blocks.getLastIrreversibleBlockNum()`

Returns the last (highest) available irreversible block number.

- Route: `/blocks_api/getLastIrreversibleBlockNum`
- Result: Integer
- Example: `/blocks_api/getLastIrreversibleBlockNum`

_No parameters._

### `sds.blocks.getLastReversibleBlockNum()`

Returns the last (highest) available reversible block number.

- Route: `/blocks_api/getLastReversibleBlockNum`
- Result: Integer
- Example: `/blocks_api/getLastReversibleBlockNum`

_No parameters._

---

## `chain_api`

Namespace: `sds.chain` · Group: Base · 10 methods

### `sds.chain.getConfig()`

Returns this module's active configuration.

- Route: `/chain_api/getConfig`
- Result: JSON Object
- Example: `/chain_api/getConfig`

_No parameters._

### `sds.chain.getChainStats()`

Returns general chain statistics.

- Route: `/chain_api/getChainStats`
- Result: JSON Object
- Example: `/chain_api/getChainStats`

_No parameters._

### `sds.chain.getOperationStats()`

Returns some statistics about the parsed Steem operations.

- Route: `/chain_api/getOperationStats`
- Result: JSON Object
- Example: `/chain_api/getOperationStats`

_No parameters._

### `sds.chain.getBlockInfoByTime()`

Returns general block information for :blockTime's nearest block.

- Route: `/chain_api/getBlockInfoByTime/:blockTime`
- Result: JSON Object
- Example: `/chain_api/getBlockInfoByTime/1789588074`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `blockTime` | int (Date / date string / seconds) | yes | — | — | — |

### `sds.chain.getAccountNames()`

Returns a list of all account names.

- Route: `/chain_api/getAccountNames/:limit?/:offset?`
- Result: JSON Array
- Max. limit: 10000
- Example: `/chain_api/getAccountNames`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `limit` | int | no | `1000` | 1 – 10000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.chain.getAccountNamesByPrefix()`

Returns a list of all account names starting with :prefix.

- Route: `/chain_api/getAccountNamesByPrefix/:prefix/:limit?/:offset?`
- Result: JSON Array
- Max. limit: 1000
- Example: `/chain_api/getAccountNamesByPrefix/steemchil`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `prefix` | string | yes | — | — | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.chain.getLink()`

Returns general link information for :author / :permlink.

- Route: `/chain_api/getLink/:author/:permlink`
- Result: JSON Object
- Example: `/chain_api/getLink/steemit/firstpost`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `permlink` | string | yes | — | — | — |

### `sds.chain.getLinkById()`

Returns general link information for :linkId.

- Route: `/chain_api/getLinkById/:linkId`
- Result: JSON Object
- Example: `/chain_api/getLinkById/1`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `linkId` | int | yes | — | ≥ 1 | — |

### `sds.chain.getPostingPlatforms()`

Returns a list of all used posting platforms.

- Route: `/chain_api/getPostingPlatforms/:limit?/:offset?`
- Result: JSON Array
- Max. limit: 10000
- Example: `/chain_api/getPostingPlatforms`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `limit` | int | no | `1000` | 1 – 10000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.chain.getDailyAverageShareRates()`

Returns a list of all historical vesting share rates (daily average STEEM per VEST), grouped by day.

- Route: `/chain_api/getDailyAverageShareRates`
- Result: JSON Array
- Example: `/chain_api/getDailyAverageShareRates`

_No parameters._

---

## `steem_requests_api`

Namespace: `sds.steemRequests` · Group: Base · 14 methods

### `sds.steemRequests.getConfig()`

Returns this module's active configuration.

- Route: `/steem_requests_api/getConfig`
- Result: JSON Object
- Example: `/steem_requests_api/getConfig`

_No parameters._

### `sds.steemRequests.getSteemProps()`

Returns most important Steem properties in one set.

- Route: `/steem_requests_api/getSteemProps`
- Result: JSON Object
- Example: `/steem_requests_api/getSteemProps`

_No parameters._

### `sds.steemRequests.getAll()`

Returns all cached Steem requests.

- Route: `/steem_requests_api/getAll`
- Result: JSON Object
- Example: `/steem_requests_api/getAll`

_No parameters._

### `sds.steemRequests.getById()`

Returns the cached Steem requests for the given :ids

- Route: `/steem_requests_api/getById/:ids`
- Result: JSON Object
- Example: `/steem_requests_api/getById/1,3`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `ids` | fixed_csv | yes | — | — | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | … (9 values) |

### `sds.steemRequests.condenser_api.get_account_count()`

See: developers.steem.io/apidefinitions/#condenser_api.get_account_count

- Route: `/steem_requests_api/condenser_api.get_account_count`
- Result: Integer
- Example: `/steem_requests_api/condenser_api.get_account_count`

_No parameters._

### `sds.steemRequests.condenser_api.get_chain_properties()`

See: developers.steem.io/apidefinitions/#condenser_api.get_chain_properties

- Route: `/steem_requests_api/condenser_api.get_chain_properties`
- Result: JSON Object
- Example: `/steem_requests_api/condenser_api.get_chain_properties`

_No parameters._

### `sds.steemRequests.condenser_api.get_current_median_history_price()`

See: developers.steem.io/apidefinitions/#condenser_api.get_current_median_history_price

- Route: `/steem_requests_api/condenser_api.get_current_median_history_price`
- Result: JSON Object
- Example: `/steem_requests_api/condenser_api.get_current_median_history_price`

_No parameters._

### `sds.steemRequests.condenser_api.get_dynamic_global_properties()`

See: developers.steem.io/apidefinitions/#condenser_api.get_dynamic_global_properties

- Route: `/steem_requests_api/condenser_api.get_dynamic_global_properties`
- Result: JSON Object
- Example: `/steem_requests_api/condenser_api.get_dynamic_global_properties`

_No parameters._

### `sds.steemRequests.condenser_api.get_hardfork_version()`

See: developers.steem.io/apidefinitions/#condenser_api.get_hardfork_version

- Route: `/steem_requests_api/condenser_api.get_hardfork_version`
- Result: String
- Example: `/steem_requests_api/condenser_api.get_hardfork_version`

_No parameters._

### `sds.steemRequests.condenser_api.get_next_scheduled_hardfork()`

See: developers.steem.io/apidefinitions/#condenser_api.get_next_scheduled_hardfork

- Route: `/steem_requests_api/condenser_api.get_next_scheduled_hardfork`
- Result: JSON Object
- Example: `/steem_requests_api/condenser_api.get_next_scheduled_hardfork`

_No parameters._

### `sds.steemRequests.condenser_api.get_reward_fund()`

See: developers.steem.io/apidefinitions/#condenser_api.get_reward_fund

- Route: `/steem_requests_api/condenser_api.get_reward_fund/:params`
- Result: JSON Object

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `params` | string | yes | — | — | — |

### `sds.steemRequests.condenser_api.get_ticker()`

See: developers.steem.io/apidefinitions/#condenser_api.get_ticker

- Route: `/steem_requests_api/condenser_api.get_ticker`
- Result: JSON Object
- Example: `/steem_requests_api/condenser_api.get_ticker`

_No parameters._

### `sds.steemRequests.condenser_api.get_witness_count()`

See: developers.steem.io/apidefinitions/#condenser_api.get_witness_count

- Route: `/steem_requests_api/condenser_api.get_witness_count`
- Result: Integer
- Example: `/steem_requests_api/condenser_api.get_witness_count`

_No parameters._

### `sds.steemRequests.request()`

Returns the result of a direct request to the configured Steem node.

- Route: `/steem_requests_api/request/:apiName/:methodName/:methodParams?`
- Result: JSON Object
- Example: `/steem_requests_api/request/condenser_api/get_block/1`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `apiName` | string | yes | — | — | — |
| `methodName` | string | yes | — | — | — |
| `methodParams` | string | no | — | — | — |

---

## `transactions_api`

Namespace: `sds.transactions` · Group: Base · 4 methods

### `sds.transactions.getConfig()`

Returns this module's active configuration.

- Route: `/transactions_api/getConfig`
- Result: JSON Object
- Example: `/transactions_api/getConfig`

_No parameters._

### `sds.transactions.getTransactionById()`

Returns the transaction for the given :transactionId.

- Route: `/transactions_api/getTransactionById/:transactionId`
- Result: JSON Object
- Example: `/transactions_api/getTransactionById/2c3a64cba781a163842d7d831f9cfbc69471517d`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `transactionId` | hex_string (40) | yes | — | — | — |

### `sds.transactions.getBlockByTransactionId()`

Returns the block that contains the given :transactionId.

- Route: `/transactions_api/getBlockByTransactionId/:transactionId/:withVirtualOps?`
- Result: JSON Object
- Example: `/transactions_api/getBlockByTransactionId/2c3a64cba781a163842d7d831f9cfbc69471517d`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `transactionId` | hex_string (40) | yes | — | — | — |
| `withVirtualOps` | bool | no | `false` | — | true | false | 1 | 0 |

### `sds.transactions.getBlockNumByTransactionId()`

Returns the block number of the block that contains the given :transactionId.

- Route: `/transactions_api/getBlockNumByTransactionId/:transactionId`
- Result: Integer
- Example: `/transactions_api/getBlockNumByTransactionId/2c3a64cba781a163842d7d831f9cfbc69471517d`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `transactionId` | hex_string (40) | yes | — | — | — |

---

## `accounts_api`

Namespace: `sds.accounts` · Group: Accounts · 15 methods

### `sds.accounts.getConfig()`

Returns this module's active configuration.

- Route: `/accounts_api/getConfig`
- Result: JSON Object
- Example: `/accounts_api/getConfig`

_No parameters._

### `sds.accounts.getAccount()`

Returns the Steem account data for :account.

- Route: `/accounts_api/getAccount/:account/:fields?`
- Result: JSON Object
- Example: `/accounts_api/getAccount/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `fields` | fixed_csv | no | `*` | — | name | recovery_account | reset_account | proxy | json_metadata | posting_json_metadata | created | last_root_post | … (56 values) |

### `sds.accounts.getAccounts()`

Returns the Steem account data for :accounts.

- Route: `/accounts_api/getAccounts/:accounts/:fields?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/accounts_api/getAccounts/steemchiller,steemit`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `accounts` | account_name_csv | yes | — | — | — |
| `fields` | fixed_csv | no | `*` | — | name | recovery_account | reset_account | proxy | json_metadata | posting_json_metadata | created | last_root_post | … (56 values) |

### `sds.accounts.getAccountExt()`

Returns the extended Steem account data for :account.

- Route: `/accounts_api/getAccountExt/:account/:observer?/:fields?`
- Result: JSON Object
- Example: `/accounts_api/getAccountExt/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `observer` | account_name | no | — | — | — |
| `fields` | fixed_csv | no | `*` | — | id | name | creator | recovery_account | reset_account | proxy | json_metadata | posting_json_metadata | … (84 values) |

### `sds.accounts.getAccountsExt()`

Returns the extended Steem account data for :accounts.

- Route: `/accounts_api/getAccountsExt/:accounts/:observer?/:fields?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/accounts_api/getAccountsExt/steemchiller,steemit`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `accounts` | account_name_csv | yes | — | — | — |
| `observer` | account_name | no | — | — | — |
| `fields` | fixed_csv | no | `*` | — | id | name | creator | recovery_account | reset_account | proxy | json_metadata | posting_json_metadata | … (84 values) |

### `sds.accounts.getVestingWithdrawRoutes()`

Returns the installed vesting withdraw routes for :account.

- Route: `/accounts_api/getVestingWithdrawRoutes/:account`
- Result: JSON Object
- Example: `/accounts_api/getVestingWithdrawRoutes/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |

### `sds.accounts.getAccountById()`

Returns the Steem account data for :accountId.

- Route: `/accounts_api/getAccountById/:accountId/:fields?`
- Result: JSON Object
- Example: `/accounts_api/getAccountById/1`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `accountId` | int | yes | — | ≥ 1 | — |
| `fields` | fixed_csv | no | `*` | — | name | recovery_account | reset_account | proxy | json_metadata | posting_json_metadata | created | last_root_post | … (56 values) |

### `sds.accounts.getAccountsById()`

Returns the Steem account data for :accountIds.

- Route: `/accounts_api/getAccountsById/:accountIds/:fields?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/accounts_api/getAccountsById/1,2`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `accountIds` | int_csv | yes | — | — | — |
| `fields` | fixed_csv | no | `*` | — | name | recovery_account | reset_account | proxy | json_metadata | posting_json_metadata | created | last_root_post | … (56 values) |

### `sds.accounts.getAccountExtById()`

Returns the extended Steem account data for :accountId.

- Route: `/accounts_api/getAccountExtById/:accountId/:observer?/:fields?`
- Result: JSON Object
- Example: `/accounts_api/getAccountExtById/1`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `accountId` | int | yes | — | ≥ 1 | — |
| `observer` | account_name | no | — | — | — |
| `fields` | fixed_csv | no | `*` | — | id | name | creator | recovery_account | reset_account | proxy | json_metadata | posting_json_metadata | … (84 values) |

### `sds.accounts.getAccountsExtById()`

Returns the extended Steem account data for :accountIds.

- Route: `/accounts_api/getAccountsExtById/:accountIds/:observer?/:fields?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/accounts_api/getAccountsExtById/1,2`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `accountIds` | int_csv | yes | — | — | — |
| `observer` | account_name | no | — | — | — |
| `fields` | fixed_csv | no | `*` | — | id | name | creator | recovery_account | reset_account | proxy | json_metadata | posting_json_metadata | … (84 values) |

### `sds.accounts.getVestingWithdrawRoutesById()`

Returns the installed vesting withdraw routes for :accountId.

- Route: `/accounts_api/getVestingWithdrawRoutesById/:accountId`
- Result: JSON Object
- Example: `/accounts_api/getVestingWithdrawRoutesById/1`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `accountId` | int | yes | — | ≥ 1 | — |

### `sds.accounts.getAccountsByPrefix()`

Returns the extended Steem account data for accounts whose name starts with :prefix.

- Route: `/accounts_api/getAccountsByPrefix/:prefix/:observer?/:fields?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 250
- Example: `/accounts_api/getAccountsByPrefix/steemchil/null/name,reputation`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `prefix` | string | yes | — | — | — |
| `observer` | account_name | no | — | — | — |
| `fields` | fixed_csv | no | `*` | — | id | name | creator | recovery_account | reset_account | proxy | json_metadata | posting_json_metadata | … (84 values) |
| `limit` | int | no | `100` | 1 – 250 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.accounts.getAccountsSortedBy()`

Returns the extended Steem account data for all accounts ordered by :sortField, :sortDir.

- Route: `/accounts_api/getAccountsSortedBy/:sortField/:sortDir/:observer?/:fields?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/accounts_api/getAccountsSortedBy/vests_own/DESC`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `sortField` | fixed_value | yes | — | — | name | creator | proxy | recovery_account | created | last_action | last_comment | last_root_post | … (42 values) |
| `sortDir` | fixed_value | yes | — | — | ASC | DESC |
| `observer` | account_name | no | — | — | — |
| `fields` | fixed_csv | no | `*` | — | id | name | creator | recovery_account | reset_account | proxy | json_metadata | posting_json_metadata | … (84 values) |
| `limit` | int | no | `250` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.accounts.getAccountCountByVESTSRange()`

Returns the number of accounts that :type between :fromVESTS and :toVESTS vesting shares.
**Ranges**: [ { "from": "fromVESTS", "to": "toVESTS" } ]

- Route: `/accounts_api/getAccountCountByVESTSRange/:type/:fromVESTS-:toVESTS`
- Result: Integer
- Example: `/accounts_api/getAccountCountByVESTSRange/own/1000-100000`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `type` | fixed_value | yes | — | — | own | delegated | received | effective |
| `fromVESTS` | float | yes | — | ≥ 0 | — |
| `toVESTS` | float | yes | — | ≥ 0 | — |

### `sds.accounts.getVestingStats()`

Returns vesting statistics like number of whales, orcas, dolphins, minnows and redfishes.

- Route: `/accounts_api/getVestingStats`
- Result: JSON Object
- Example: `/accounts_api/getVestingStats`

_No parameters._

---

## `account_history_api`

Namespace: `sds.accountHistory` · Group: Accounts · 6 methods

### `sds.accountHistory.getConfig()`

Returns this module's active configuration.

- Route: `/account_history_api/getConfig`
- Result: JSON Object
- Example: `/account_history_api/getConfig`

_No parameters._

### `sds.accountHistory.getHistoryByTime()`

Returns the account history for :account in the given time range.
**Ranges**: [ { "from": "fromTime", "to": "toTime" } ]

- Route: `/account_history_api/getHistoryByTime/:account/:fromTime-:toTime/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 10000
- Example: `/account_history_api/getHistoryByTime/steemchiller/1788983274-1789588074`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `fromTime` | int (Date / date string / seconds) | yes | — | — | — |
| `toTime` | int (Date / date string / seconds) | yes | — | — | — |
| `limit` | int | no | `1000` | 1 – 10000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.accountHistory.getHistoryByOpTypesTime()`

Returns the account history for :account and :opTypes in the given time range.
**Ranges**: [ { "from": "fromTime", "to": "toTime" } ]

- Route: `/account_history_api/getHistoryByOpTypesTime/:account/:opTypes/:fromTime-:toTime/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 10000
- Example: `/account_history_api/getHistoryByOpTypesTime/steemchiller/vote,comment/1788983274-1789588074`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `opTypes` | fixed_csv | yes | — | — | account_create | account_create_with_delegation | account_update | account_update2 | account_witness_proxy | account_witness_vote | author_reward | cancel_transfer_from_savings | … (59 values) |
| `fromTime` | int (Date / date string / seconds) | yes | — | — | — |
| `toTime` | int (Date / date string / seconds) | yes | — | — | — |
| `limit` | int | no | `1000` | 1 – 10000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.accountHistory.getHistoryFromStartId()`

Returns the account history for :account starting from :startId.

- Route: `/account_history_api/getHistoryFromStartId/:account/:startId/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 10000
- Example: `/account_history_api/getHistoryFromStartId/steemchiller/1418590154`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `startId` | int | yes | — | — | — |
| `limit` | int | no | `1000` | 1 – 10000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.accountHistory.getLastOpId()`

Returns the last non-virtual operation's id for :account.

- Route: `/account_history_api/getLastOpId/:account`
- Result: Integer
- Example: `/account_history_api/getLastOpId/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |

### `sds.accountHistory.getLastOpIds()`

Returns the last virtual and last non-virtual operation's id for :account.

- Route: `/account_history_api/getLastOpIds/:account`
- Result: Integer
- Example: `/account_history_api/getLastOpIds/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |

---

## `authorities_api`

Namespace: `sds.authorities` · Group: Accounts · 8 methods

### `sds.authorities.getConfig()`

Returns this module's active configuration.

- Route: `/authorities_api/getConfig`
- Result: JSON Object
- Example: `/authorities_api/getConfig`

_No parameters._

### `sds.authorities.getAccountAuths()`

Returns :role 'account_auths' for :account.

- Route: `/authorities_api/getAccountAuths/:account/:role`
- Result: JSON Object
- Example: `/authorities_api/getAccountAuths/steemchiller/posting`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `role` | fixed_value | yes | — | — | posting | active | owner |

### `sds.authorities.getKeyAuths()`

Returns :role 'key_auths' for :account.

- Route: `/authorities_api/getKeyAuths/:account/:role`
- Result: JSON Object
- Example: `/authorities_api/getKeyAuths/steemchiller/posting`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `role` | fixed_value | yes | — | — | posting | active | owner |

### `sds.authorities.getAccountAuthsByTarget()`

Returns a list of accounts (with role details) that authorized :account.

- Route: `/authorities_api/getAccountAuthsByTarget/:account`
- Result: JSON Object
- Example: `/authorities_api/getAccountAuthsByTarget/steemauto.app`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |

### `sds.authorities.getAccountAuthsByTargetRole()`

Returns a list of accounts that authorized :account to use :role.

- Route: `/authorities_api/getAccountAuthsByTargetRole/:account/:role`
- Result: JSON Object
- Example: `/authorities_api/getAccountAuthsByTargetRole/steemauto.app/posting`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `role` | fixed_value | yes | — | — | posting | active | owner |

### `sds.authorities.getAuthorizedAccounts()`

Returns a grouped list of authorized accounts with at least :minCount authorizations.

- Route: `/authorities_api/getAuthorizedAccounts/:minCount`
- Result: JSON Object
- Example: `/authorities_api/getAuthorizedAccounts/1000`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `minCount` | int | yes | — | 0 – 100000000 | — |

### `sds.authorities.getAccountAuthsHistory()`

Returns the :role 'account_auths' history for :account.

- Route: `/authorities_api/getAccountAuthsHistory/:account/:role`
- Result: JSON Object
- Example: `/authorities_api/getAccountAuthsHistory/steemchiller/posting`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `role` | fixed_value | yes | — | — | posting | active | owner |

### `sds.authorities.getKeyAuthsHistory()`

Returns the :role 'key_auths' history for :account.

- Route: `/authorities_api/getKeyAuthsHistory/:account/:role`
- Result: JSON Object
- Example: `/authorities_api/getKeyAuthsHistory/steemchiller/posting`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `role` | fixed_value | yes | — | — | posting | active | owner |

---

## `delegations_api`

Namespace: `sds.delegations` · Group: Accounts · 5 methods

### `sds.delegations.getConfig()`

Returns this module's active configuration.

- Route: `/delegations_api/getConfig`
- Result: JSON Object
- Example: `/delegations_api/getConfig`

_No parameters._

### `sds.delegations.getOutgoingDelegations()`

Returns the outgoing delegations for the given :account.

- Route: `/delegations_api/getOutgoingDelegations/:account/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 100000
- Example: `/delegations_api/getOutgoingDelegations/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `limit` | int | no | `1000` | 1 – 100000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.delegations.getIncomingDelegations()`

Returns the incoming delegations for the given :account.

- Route: `/delegations_api/getIncomingDelegations/:account/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 100000
- Example: `/delegations_api/getIncomingDelegations/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `limit` | int | no | `1000` | 1 – 100000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.delegations.getExpiringDelegations()`

Returns the expiring delegations for the given :account.

- Route: `/delegations_api/getExpiringDelegations/:account/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 100000
- Example: `/delegations_api/getExpiringDelegations/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `limit` | int | no | `1000` | 1 – 100000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.delegations.getDelegationHistory()`

Returns the delegation history for the given :query.

- Route: `/delegations_api/getDelegationHistory/:query/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/delegations_api/getDelegationHistory/{"from":"steemchiller"}`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `query` | json_object | yes | — | — | — |
| `limit` | int | no | `1000` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

---

## `followers_api`

Namespace: `sds.followers` · Group: Accounts · 13 methods

### `sds.followers.getConfig()`

Returns this module's active configuration.

- Route: `/followers_api/getConfig`
- Result: JSON Object
- Example: `/followers_api/getConfig`

_No parameters._

### `sds.followers.getFollowers()`

Returns the followers of the given account (:target).

- Route: `/followers_api/getFollowers/:target/:limit?/:offset?`
- Result: JSON Array
- Max. limit: 100000
- Example: `/followers_api/getFollowers/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `target` | account_name | yes | — | — | — |
| `limit` | int | no | `10000` | 1 – 100000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.followers.getFollowing()`

Returns the followed accounts of the given account (:source).

- Route: `/followers_api/getFollowing/:source/:limit?/:offset?`
- Result: JSON Array
- Max. limit: 100000
- Example: `/followers_api/getFollowing/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `source` | account_name | yes | — | — | — |
| `limit` | int | no | `10000` | 1 – 100000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.followers.getKnownFollowers()`

Returns the followers of :target that are followed by :source.

- Route: `/followers_api/getKnownFollowers/:source/:target/:limit?/:offset?`
- Result: JSON Array
- Max. limit: 100000
- Example: `/followers_api/getKnownFollowers/steemchiller/faisalamin`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `source` | account_name | yes | — | — | — |
| `target` | account_name | yes | — | — | — |
| `limit` | int | no | `10000` | 1 – 100000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.followers.getIgnorers()`

Returns the ignores of the given account (:target).

- Route: `/followers_api/getIgnorers/:target/:limit?/:offset?`
- Result: JSON Array
- Max. limit: 100000
- Example: `/followers_api/getIgnorers/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `target` | account_name | yes | — | — | — |
| `limit` | int | no | `10000` | 1 – 100000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.followers.getIgnored()`

Returns the ignored accounts of the given account (:source).

- Route: `/followers_api/getIgnored/:source/:limit?/:offset?`
- Result: JSON Array
- Max. limit: 100000
- Example: `/followers_api/getIgnored/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `source` | account_name | yes | — | — | — |
| `limit` | int | no | `10000` | 1 – 100000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.followers.getCounts()`

Returns the number of followers and followed accounts of the given account (:account).

- Route: `/followers_api/getCounts/:account`
- Result: JSON Object
- Example: `/followers_api/getCounts/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |

### `sds.followers.getFollowerCount()`

Returns the number of followers of the given account (:target).

- Route: `/followers_api/getFollowerCount/:target`
- Result: Integer
- Example: `/followers_api/getFollowerCount/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `target` | account_name | yes | — | — | — |

### `sds.followers.getFollowingCount()`

Returns the number of followed accounts of the given account (:source).

- Route: `/followers_api/getFollowingCount/:source`
- Result: Integer
- Example: `/followers_api/getFollowingCount/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `source` | account_name | yes | — | — | — |

### `sds.followers.getFollowedHistory()`

Returns the followed history of the given account (:target) in the given time range (:fromTime to :toTime).
**Ranges**: [ { "from": "fromTime", "to": "toTime" } ]

- Route: `/followers_api/getFollowedHistory/:target/:fromTime-:toTime/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 10000
- Example: `/followers_api/getFollowedHistory/steemchiller/1788983274-1789588074`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `target` | account_name | yes | — | — | — |
| `fromTime` | int (Date / date string / seconds) | yes | — | — | — |
| `toTime` | int (Date / date string / seconds) | yes | — | — | — |
| `limit` | int | no | `10000` | 1 – 10000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.followers.getFollowHistory()`

Returns the follow history of the given account (:source) in the given time range (:fromTime to :toTime).

- Route: `/followers_api/getFollowHistory/:source/:fromTime-:toTime/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 10000
- Example: `/followers_api/getFollowHistory/steemchiller/1788983274-1789588074`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `source` | account_name | yes | — | — | — |
| `fromTime` | int (Date / date string / seconds) | yes | — | — | — |
| `toTime` | int (Date / date string / seconds) | yes | — | — | — |
| `limit` | int | no | `10000` | 1 – 10000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.followers.getUnfollowedHistory()`

Returns the unfollowed history of the given account (:target) in the given time range (:fromTime to :toTime).

- Route: `/followers_api/getUnfollowedHistory/:target/:fromTime-:toTime/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 10000
- Example: `/followers_api/getUnfollowedHistory/steemchiller/1788983274-1789588074`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `target` | account_name | yes | — | — | — |
| `fromTime` | int (Date / date string / seconds) | yes | — | — | — |
| `toTime` | int (Date / date string / seconds) | yes | — | — | — |
| `limit` | int | no | `10000` | 1 – 10000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.followers.getUnfollowHistory()`

Returns the unfollow history of the given account (:source) in the given time range (:fromTime to :toTime).

- Route: `/followers_api/getUnfollowHistory/:source/:fromTime-:toTime/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 10000
- Example: `/followers_api/getUnfollowHistory/steemchiller/1788983274-1789588074`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `source` | account_name | yes | — | — | — |
| `fromTime` | int (Date / date string / seconds) | yes | — | — | — |
| `toTime` | int (Date / date string / seconds) | yes | — | — | — |
| `limit` | int | no | `10000` | 1 – 10000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

---

## `mentions_api`

Namespace: `sds.mentions` · Group: Accounts · 2 methods

### `sds.mentions.getConfig()`

Returns this module's active configuration.

- Route: `/mentions_api/getConfig`
- Result: JSON Object
- Example: `/mentions_api/getConfig`

_No parameters._

### `sds.mentions.getMentions()`

Returns the mentions for the given :account and time range.
**Ranges**: [ { "from": "fromTime", "to": "toTime" } ]

- Route: `/mentions_api/getMentions/:account/:fromTime-:toTime/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 10000
- Example: `/mentions_api/getMentions/steemchiller/1788983274-1789588074`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `fromTime` | int (Date / date string / seconds) | yes | — | — | — |
| `toTime` | int (Date / date string / seconds) | yes | — | — | — |
| `limit` | int | no | `1000` | 1 – 10000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

---

## `notifications_api`

Namespace: `sds.notifications` · Group: Accounts · 9 methods

### `sds.notifications.getConfig()`

Returns this module's active configuration.

- Route: `/notifications_api/getConfig`
- Result: JSON Object
- Example: `/notifications_api/getConfig`

_No parameters._

### `sds.notifications.getFilteredUnreadCount()`

Returns the number of new (unread) notifications for the given :account and :filter.
Filters can be set for all notification types at once with ':filter.default' or for each type individually. For example, if you want to use specific filters for vote notifications, you can define them with ':filter.vote'.
The vote amount filter uses absolute values. So, when setting 'minVoteAmount' to '0.1', the results will also include downvotes with an amount equal to or lower than '-0.1'.

- Route: `/notifications_api/getFilteredUnreadCount/:account/:filter`
- Result: Integer
- Example: `/notifications_api/getFilteredUnreadCount/steemchiller/{"default":{"minReputation":25},"mention":{"minSP":1000,"minReputation":50},"vote":{"minVoteAmount":0.1}}`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `filter` | json_object | yes | — | — | — |

### `sds.notifications.getFilteredUnreadSummary()`

Returns the number of new (unread) notifications grouped by type for the given :account and :filter.
Filters can be set for all notification types at once with ':filter.default' or for each type individually. For example, if you want to use specific filters for vote notifications, you can define them with ':filter.vote'.
The vote amount filter uses absolute values. So, when setting 'minVoteAmount' to '0.1', the results will also include downvotes with an amount equal to or lower than '-0.1'.

- Route: `/notifications_api/getFilteredUnreadSummary/:account/:filter`
- Result: JSON Object
- Example: `/notifications_api/getFilteredUnreadSummary/steemchiller/{"mention":{"minSP":1000,"minReputation":50},"vote":{"minVoteAmount":0.1,"minReputation":50}}`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `filter` | json_object | yes | — | — | — |

### `sds.notifications.getFilteredNotificationsByStatus()`

Returns :status notifications for the given :account and :filter ordered by time descending.
Filters can be set for all notification types at once with ':filter.default' or for each type individually. For example, if you want to use specific filters for vote notifications, you can define them with ':filter.vote'.
The vote amount filter uses absolute values. So, when setting 'minVoteAmount' to '0.1', the results will also include downvotes with an amount equal to or lower than '-0.1'.

- Route: `/notifications_api/getFilteredNotificationsByStatus/:account/:status/:filter/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 2500
- Example: `/notifications_api/getFilteredNotificationsByStatus/steemchiller/new/{"mention":{"minSP":1000,"minReputation":50},"vote":{"minVoteAmount":0.1,"minReputation":50}}`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `status` | fixed_value | yes | — | — | all | new | old |
| `filter` | json_object | yes | — | — | — |
| `limit` | int | no | `250` | 1 – 2500 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.notifications.getFilteredNotificationsByStatusType()`

Returns :status notifications for the given :account, :type, and :filter ordered by time descending.
Filters can be set for all notification types at once with ':filter.default' or for each type individually. For example, if you want to use specific filters for vote notifications, you can define them with ':filter.vote'.
The vote amount filter uses absolute values. So, when setting 'minVoteAmount' to '0.1', the results will also include downvotes with an amount equal to or lower than '-0.1'.

- Route: `/notifications_api/getFilteredNotificationsByStatusType/:account/:status/:type/:filter/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 2500
- Example: `/notifications_api/getFilteredNotificationsByStatusType/steemchiller/new/follow/{"default":{"minSP":1000,"minReputation":50}}`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `status` | fixed_value | yes | — | — | all | new | old |
| `type` | fixed_value | yes | — | — | vote | reply | follow | mention | resteem |
| `filter` | json_object | yes | — | — | — |
| `limit` | int | no | `250` | 1 – 2500 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.notifications.getUnreadCount()`

Returns the number of new (unread) notifications for the given :account.

- Route: `/notifications_api/getUnreadCount/:account`
- Result: Integer
- Example: `/notifications_api/getUnreadCount/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |

### `sds.notifications.getUnreadSummary()`

Returns the number of new (unread) notifications grouped by type for the given :account.

- Route: `/notifications_api/getUnreadSummary/:account`
- Result: JSON Object
- Example: `/notifications_api/getUnreadSummary/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |

### `sds.notifications.getNotificationsByStatus()`

Returns :status notifications for the given :account ordered by time descending.

- Route: `/notifications_api/getNotificationsByStatus/:account/:status/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 2500
- Example: `/notifications_api/getNotificationsByStatus/steemchiller/new`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `status` | fixed_value | yes | — | — | all | new | old |
| `limit` | int | no | `250` | 1 – 2500 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.notifications.getNotificationsByStatusType()`

Returns :status notifications for the given :account and :type ordered by time descending.

- Route: `/notifications_api/getNotificationsByStatusType/:account/:status/:type/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 2500
- Example: `/notifications_api/getNotificationsByStatusType/steemchiller/new/follow`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `status` | fixed_value | yes | — | — | all | new | old |
| `type` | fixed_value | yes | — | — | vote | reply | follow | mention | resteem |
| `limit` | int | no | `250` | 1 – 2500 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

---

## `rewards_api`

Namespace: `sds.rewards` · Group: Accounts · 7 methods

### `sds.rewards.getConfig()`

Returns this module's active configuration.

- Route: `/rewards_api/getConfig`
- Result: JSON Object
- Example: `/rewards_api/getConfig`

_No parameters._

### `sds.rewards.getRewards()`

Returns the rewards for the given :op and :account in the given time range.
**Ranges**: [ { "from": "fromTime", "to": "toTime" } ]

- Route: `/rewards_api/getRewards/:op/:account/:fromTime-:toTime/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 10000
- Example: `/rewards_api/getRewards/curation_reward/steemchiller/1788983274-1789588074`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `op` | fixed_value | yes | — | — | author_reward | comment_benefactor_reward | curation_reward | liquidity_reward | producer_reward | interest | proposal_pay |
| `account` | account_name | yes | — | — | — |
| `fromTime` | int (Date / date string / seconds) | yes | — | — | — |
| `toTime` | int (Date / date string / seconds) | yes | — | — | — |
| `limit` | int | no | `1000` | 1 – 10000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.rewards.getRewardsSums()`

Returns the rewards sums for the given :op and :account in the given time range.
**Ranges**: [ { "from": "fromTime", "to": "toTime" } ]

- Route: `/rewards_api/getRewardsSums/:op/:account/:fromTime-:toTime`
- Result: JSON Array
- Example: `/rewards_api/getRewardsSums/curation_reward/steemchiller/1788983274-1789588074`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `op` | fixed_value | yes | — | — | author_reward | comment_benefactor_reward | curation_reward | liquidity_reward | producer_reward | interest | proposal_pay |
| `account` | account_name | yes | — | — | — |
| `fromTime` | int (Date / date string / seconds) | yes | — | — | — |
| `toTime` | int (Date / date string / seconds) | yes | — | — | — |

### `sds.rewards.getAllRewardsSums()`

Returns all rewards sums for :account in the given time range.
**Ranges**: [ { "from": "fromTime", "to": "toTime" } ]

- Route: `/rewards_api/getAllRewardsSums/:account/:fromTime-:toTime`
- Result: JSON Object
- Example: `/rewards_api/getAllRewardsSums/steemchiller/1788983274-1789588074`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `fromTime` | int (Date / date string / seconds) | yes | — | — | — |
| `toTime` | int (Date / date string / seconds) | yes | — | — | — |

### `sds.rewards.getComingAuthorRewardsSummary()`

Returns a summary of the coming author rewards for the given :account.

- Route: `/rewards_api/getComingAuthorRewardsSummary/:account`
- Result: JSON Object
- Example: `/rewards_api/getComingAuthorRewardsSummary/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |

### `sds.rewards.getComingBeneficiaryRewardsSummary()`

Returns a summary of the coming beneficiary rewards for the given :account.

- Route: `/rewards_api/getComingBeneficiaryRewardsSummary/:account`
- Result: JSON Object
- Example: `/rewards_api/getComingBeneficiaryRewardsSummary/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |

### `sds.rewards.getComingCurationRewardsSummary()`

Returns a summary of the coming curation rewards for the given :account.

- Route: `/rewards_api/getComingCurationRewardsSummary/:account`
- Result: JSON Object
- Example: `/rewards_api/getComingCurationRewardsSummary/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |

---

## `transfers_api`

Namespace: `sds.transfers` · Group: Accounts · 7 methods

### `sds.transfers.getConfig()`

Returns this module's active configuration.

- Route: `/transfers_api/getConfig`
- Result: JSON Object
- Example: `/transfers_api/getConfig`

_No parameters._

### `sds.transfers.getTransfers()`

Returns the transfers for the search criteria given in :query.

- Route: `/transfers_api/getTransfers/:query/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/transfers_api/getTransfers/{"type":"transfer","to":"steemchiller","unit":"SBD"}`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `query` | json_object | yes | — | — | — |
| `limit` | int | no | `250` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.transfers.getTransfersByTypeFrom()`

Returns the transfers of :type for the given :from account.

- Route: `/transfers_api/getTransfersByTypeFrom/:type/:from/:orderBy?/:orderDir?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/transfers_api/getTransfersByTypeFrom/transfer/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `type` | fixed_value | yes | — | — | transfer | transfer_to_vesting | withdraw_vesting | transfer_to_savings | transfer_from_savings | cancel_transfer_from_savings |
| `from` | account_name | yes | — | — | — |
| `orderBy` | fixed_value | no | `time` | — | time | amount |
| `orderDir` | fixed_value | no | `DESC` | — | ASC | DESC |
| `limit` | int | no | `250` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.transfers.getTransfersByTypeTo()`

Returns the transfers of :type for the given :to account.

- Route: `/transfers_api/getTransfersByTypeTo/:type/:to/:orderBy?/:orderDir?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/transfers_api/getTransfersByTypeTo/transfer/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `type` | fixed_value | yes | — | — | transfer | transfer_to_vesting | withdraw_vesting | transfer_to_savings | transfer_from_savings | cancel_transfer_from_savings |
| `to` | account_name | yes | — | — | — |
| `orderBy` | fixed_value | no | `time` | — | time | amount |
| `orderDir` | fixed_value | no | `DESC` | — | ASC | DESC |
| `limit` | int | no | `250` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.transfers.getTransfersByTypeFromTo()`

Returns the transfers of :type for the given :from and :to account.

- Route: `/transfers_api/getTransfersByTypeFromTo/:type/:from/:to/:orderBy?/:orderDir?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/transfers_api/getTransfersByTypeFromTo/transfer/steemchiller/rfdax`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `type` | fixed_value | yes | — | — | transfer | transfer_to_vesting | withdraw_vesting | transfer_to_savings | transfer_from_savings | cancel_transfer_from_savings |
| `from` | account_name | yes | — | — | — |
| `to` | account_name | yes | — | — | — |
| `orderBy` | fixed_value | no | `time` | — | time | amount |
| `orderDir` | fixed_value | no | `DESC` | — | ASC | DESC |
| `limit` | int | no | `250` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.transfers.getTransfersByTypeTime()`

Returns the transfers of :type for the given time range.
**Ranges**: [ { "from": "fromTime", "to": "toTime" } ]

- Route: `/transfers_api/getTransfersByTypeTime/:type/:fromTime-:toTime/:orderBy?/:orderDir?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/transfers_api/getTransfersByTypeTime/transfer/1646578362-1646664762`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `type` | fixed_value | yes | — | — | transfer | transfer_to_vesting | withdraw_vesting | transfer_to_savings | transfer_from_savings | cancel_transfer_from_savings |
| `fromTime` | int (Date / date string / seconds) | yes | — | — | — |
| `toTime` | int (Date / date string / seconds) | yes | — | — | — |
| `orderBy` | fixed_value | no | `time` | — | time |
| `orderDir` | fixed_value | no | `DESC` | — | ASC | DESC |
| `limit` | int | no | `250` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.transfers.getTransfersByMemoId()`

Returns the transfers for the given :memoId.

- Route: `/transfers_api/getTransfersByMemoId/:memoId/:orderBy?/:orderDir?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/transfers_api/getTransfersByMemoId/7e817990-dae3-47cb-8d6f-5a6dc3eefad3`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `memoId` | string | yes | — | — | — |
| `orderBy` | fixed_value | no | `time` | — | time | amount |
| `orderDir` | fixed_value | no | `DESC` | — | ASC | DESC |
| `limit` | int | no | `250` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

---

## `witnesses_api`

Namespace: `sds.witnesses` · Group: Accounts · 15 methods

### `sds.witnesses.getConfig()`

Returns this module's active configuration.

- Route: `/witnesses_api/getConfig`
- Result: JSON Object
- Example: `/witnesses_api/getConfig`

_No parameters._

### `sds.witnesses.getWitness()`

Returns general data about the specified :witness.

- Route: `/witnesses_api/getWitness/:witness/:observer?`
- Result: JSON Object
- Example: `/witnesses_api/getWitness/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `witness` | account_name | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |

### `sds.witnesses.getWitnessRank()`

Returns the current rank of the specified :witness.

- Route: `/witnesses_api/getWitnessRank/:witness`
- Result: Integer
- Example: `/witnesses_api/getWitnessRank/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `witness` | account_name | yes | — | — | — |

### `sds.witnesses.getWitnessStats()`

Returns statistics for the specified :witness.

- Route: `/witnesses_api/getWitnessStats/:witness`
- Result: JSON Object
- Example: `/witnesses_api/getWitnessStats/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `witness` | account_name | yes | — | — | — |

### `sds.witnesses.getWitnessesByRank()`

Returns a list of witnesses ordered by witness rank descending (calculated by received votes).

- Route: `/witnesses_api/getWitnessesByRank/:observer?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/witnesses_api/getWitnessesByRank`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `observer` | account_name | no | `null` | — | — |
| `limit` | int | no | `250` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.witnesses.getWitnessProxyByAccount()`

Returns the witness proxy for :account.

- Route: `/witnesses_api/getWitnessProxyByAccount/:account`
- Result: String
- Example: `/witnesses_api/getWitnessProxyByAccount/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |

### `sds.witnesses.getAccountsByWitnessProxy()`

Returns all accounts with witness proxy set to :proxy.

- Route: `/witnesses_api/getAccountsByWitnessProxy/:proxy/:limit?/:offset?`
- Result: JSON Array
- Max. limit: 10000
- Example: `/witnesses_api/getAccountsByWitnessProxy/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `proxy` | account_name | yes | — | — | — |
| `limit` | int | no | `10000` | 1 – 10000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.witnesses.getWitnessProxyChainForwards()`

Returns the witness proxy chain starting from :account.

- Route: `/witnesses_api/getWitnessProxyChainForwards/:account`
- Result: JSON Object
- Example: `/witnesses_api/getWitnessProxyChainForwards/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |

### `sds.witnesses.getWitnessProxyChainBackwards()`

Returns the witness proxy chain (backwards) starting from :proxy.

- Route: `/witnesses_api/getWitnessProxyChainBackwards/:proxy`
- Result: JSON Object
- Example: `/witnesses_api/getWitnessProxyChainBackwards/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `proxy` | account_name | yes | — | — | — |

### `sds.witnesses.getWitnessVotesByAccount()`

Returns all witnesses that were approved by :account.

- Route: `/witnesses_api/getWitnessVotesByAccount/:account`
- Result: JSON Array
- Example: `/witnesses_api/getWitnessVotesByAccount/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |

### `sds.witnesses.getWitnessVotesByWitness()`

Returns all accounts that (directly) approved :witness.

- Route: `/witnesses_api/getWitnessVotesByWitness/:witness/:limit?/:offset?`
- Result: JSON Array
- Max. limit: 10000
- Example: `/witnesses_api/getWitnessVotesByWitness/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `witness` | account_name | yes | — | — | — |
| `limit` | int | no | `10000` | 1 – 10000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.witnesses.getWitnessVotesSummary()`

Returns a list of all incoming witness votes for :witness (including the total proxied vesting shares per voter) ordered by influence descending.

- Route: `/witnesses_api/getWitnessVotesSummary/:witness`
- Result: JSON Object
- Example: `/witnesses_api/getWitnessVotesSummary/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `witness` | account_name | yes | — | — | — |

### `sds.witnesses.getRecentlyMissedBlocks()`

Returns the detection time, block number and witness name of recently missed blocks (currently contains data for the last 28 days).

- Route: `/witnesses_api/getRecentlyMissedBlocks/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/witnesses_api/getRecentlyMissedBlocks`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `limit` | int | no | `250` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.witnesses.getRecentlyMissedBlocksSummary()`

Returns a summary of all recently missed blocks (currently contains data for the last 28 days).

- Route: `/witnesses_api/getRecentlyMissedBlocksSummary`
- Result: JSON Object
- Example: `/witnesses_api/getRecentlyMissedBlocksSummary`

_No parameters._

### `sds.witnesses.getRecentlyMissedCountByWitnessTime()`

Returns the number of recently missed blocks for :witness / :fromTime (currently contains data for the last 28 days).

- Route: `/witnesses_api/getRecentlyMissedCountByWitnessTime/:witness/:fromTime?`
- Result: Integer
- Example: `/witnesses_api/getRecentlyMissedCountByWitnessTime/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `witness` | account_name | yes | — | — | — |
| `fromTime` | int (Date / date string / seconds) | no | — | — | — |

---

## `communities_api`

Namespace: `sds.communities` · Group: Posts · 15 methods

### `sds.communities.getConfig()`

Returns this module's active configuration.

- Route: `/communities_api/getConfig`
- Result: JSON Object
- Example: `/communities_api/getConfig`

_No parameters._

### `sds.communities.getCommunity()`

Returns general :community data.

- Route: `/communities_api/getCommunity/:community/:observer?`
- Result: JSON Object
- Example: `/communities_api/getCommunity/hive-172186`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |

### `sds.communities.getCommunityRoles()`

Returns :community's defined roles.

- Route: `/communities_api/getCommunityRoles/:community`
- Result: JSON Object
- Example: `/communities_api/getCommunityRoles/hive-172186`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |

### `sds.communities.getCommunitySubscribers()`

Returns a list with all to :community subscribed accounts ordered by name ascending.

- Route: `/communities_api/getCommunitySubscribers/:community`
- Result: JSON Array
- Example: `/communities_api/getCommunitySubscribers/hive-172186`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |

### `sds.communities.getCommunitySubscriptions()`

Returns all :community subscriptions (including details) ordered by time ascending.

- Route: `/communities_api/getCommunitySubscriptions/:community`
- Result: JSON Object
- Example: `/communities_api/getCommunitySubscriptions/hive-172186`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |

### `sds.communities.getCommunityPinnedPosts()`

Returns a feed list with :community's pinned posts ordered by created time descending.

- Route: `/communities_api/getCommunityPinnedPosts/:community/:observer?/:bodyLength?`
- Result: JSON Object
- Example: `/communities_api/getCommunityPinnedPosts/hive-172186`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |

### `sds.communities.getCommunityActivityLogs()`

Returns the activity logs for :community ordered by time descending.

- Route: `/communities_api/getCommunityActivityLogs/:community/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/communities_api/getCommunityActivityLogs/hive-172186`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `limit` | int | no | `250` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.communities.getCommunityActivityLogsByType()`

Returns the activity logs of :type for :community ordered by time descending.

- Route: `/communities_api/getCommunityActivityLogsByType/:community/:type/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/communities_api/getCommunityActivityLogsByType/hive-172186/setRole`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `type` | fixed_value | yes | — | — | subscribe | unsubscribe | setRole | setUserTitle | updateProps | pinPost | unpinPost | flagPost | … (10 values) |
| `limit` | int | no | `250` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.communities.getCommunitiesByCreated()`

Returns a list of communities ordered by created time descending.

- Route: `/communities_api/getCommunitiesByCreated/:observer?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/communities_api/getCommunitiesByCreated`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `observer` | account_name | no | `null` | — | — |
| `limit` | int | no | `250` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.communities.getCommunitiesByRank()`

Returns a list of communities ordered by rank ascending.

- Route: `/communities_api/getCommunitiesByRank/:observer?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/communities_api/getCommunitiesByRank`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `observer` | account_name | no | `null` | — | — |
| `limit` | int | no | `250` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.communities.getCommunitiesByTotalPayout()`

Returns a list of communities ordered by total pending payout descending.

- Route: `/communities_api/getCommunitiesByTotalPayout/:observer?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/communities_api/getCommunitiesByTotalPayout`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `observer` | account_name | no | `null` | — | — |
| `limit` | int | no | `250` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.communities.getCommunitiesByCountActivePosts()`

Returns a list of communities ordered by number of active posts descending.

- Route: `/communities_api/getCommunitiesByCountActivePosts/:observer?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/communities_api/getCommunitiesByCountActivePosts`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `observer` | account_name | no | `null` | — | — |
| `limit` | int | no | `250` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.communities.getCommunitiesByCountActiveAuthors()`

Returns a list of communities ordered by number of active authors descending.

- Route: `/communities_api/getCommunitiesByCountActiveAuthors/:observer?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/communities_api/getCommunitiesByCountActiveAuthors`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `observer` | account_name | no | `null` | — | — |
| `limit` | int | no | `250` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.communities.getCommunitiesByCountSubscribers()`

Returns a list of communities ordered by number of subscribers descending.

- Route: `/communities_api/getCommunitiesByCountSubscribers/:observer?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/communities_api/getCommunitiesByCountSubscribers`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `observer` | account_name | no | `null` | — | — |
| `limit` | int | no | `250` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.communities.getCommunitiesBySubscriber()`

Returns a list of communities that :subscriber subscribed to, ordered by title ascending.

- Route: `/communities_api/getCommunitiesBySubscriber/:subscriber/:observer?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/communities_api/getCommunitiesBySubscriber/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `subscriber` | account_name | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `limit` | int | no | `250` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

---

## `content_history_api`

Namespace: `sds.contentHistory` · Group: Posts · 2 methods

### `sds.contentHistory.getConfig()`

Returns this module's active configuration.

- Route: `/content_history_api/getConfig`
- Result: JSON Object
- Example: `/content_history_api/getConfig`

_No parameters._

### `sds.contentHistory.getContentHistory()`

Returns the content history for :author / :permlink.

- Route: `/content_history_api/getContentHistory/:author/:permlink`
- Result: JSON Object
- Example: `/content_history_api/getContentHistory/steemit/firstpost`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `permlink` | string | yes | — | — | — |

---

## `content_search_api`

Namespace: `sds.contentSearch` · Group: Posts · 21 methods

### `sds.contentSearch.getConfig()`

Returns this module's active configuration.

- Route: `/content_search_api/getConfig`
- Result: JSON Object
- Example: `/content_search_api/getConfig`

_No parameters._

### `sds.contentSearch.getPostsByText()`

Returns a feed list with posts that contain :searchText in :searchIn.

- Route: `/content_search_api/getPostsByText/:searchText/:searchIn?/:observer?/:bodyLength?/:orderBy?/:orderDir?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/content_search_api/getPostsByText/search`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `searchText` | string | yes | — | — | — |
| `searchIn` | fixed_value | no | `any` | — | body | title | any |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `orderBy` | fixed_value | no | `time` | — | time |
| `orderDir` | fixed_value | no | `DESC` | — | ASC | DESC |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.contentSearch.getPostsByTagsText()`

Returns a feed list with posts that contain :searchTags in tags and :searchText in :searchIn.

- Route: `/content_search_api/getPostsByTagsText/:searchTags/:searchText/:searchIn?/:observer?/:bodyLength?/:orderBy?/:orderDir?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/content_search_api/getPostsByTagsText/steem/search`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `searchTags` | string | yes | — | — | — |
| `searchText` | string | yes | — | — | — |
| `searchIn` | fixed_value | no | `any` | — | body | title | any |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `orderBy` | fixed_value | no | `time` | — | time |
| `orderDir` | fixed_value | no | `DESC` | — | ASC | DESC |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.contentSearch.getPostsByTimeTagsText()`

Returns a feed list with posts in the given time range that contain :searchTags in tags and :searchText in :searchIn.
**Ranges**: [ { "from": "fromTime", "to": "toTime" } ]

- Route: `/content_search_api/getPostsByTimeTagsText/:fromTime-:toTime/:searchTags/:searchText/:searchIn?/:observer?/:bodyLength?/:orderBy?/:orderDir?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/content_search_api/getPostsByTimeTagsText/1496948307-1596948307/steem/search`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `fromTime` | int (Date / date string / seconds) | yes | — | — | — |
| `toTime` | int (Date / date string / seconds) | yes | — | — | — |
| `searchTags` | string | yes | — | — | — |
| `searchText` | string | yes | — | — | — |
| `searchIn` | fixed_value | no | `any` | — | body | title | any |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `orderBy` | fixed_value | no | `time` | — | time |
| `orderDir` | fixed_value | no | `DESC` | — | ASC | DESC |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.contentSearch.getPostsByAuthorText()`

Returns a feed list with :author's posts that contain :searchText in :searchIn.

- Route: `/content_search_api/getPostsByAuthorText/:author/:searchText/:searchIn?/:observer?/:bodyLength?/:orderBy?/:orderDir?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/content_search_api/getPostsByAuthorText/author/search`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `searchText` | string | yes | — | — | — |
| `searchIn` | fixed_value | no | `any` | — | body | title | any |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `orderBy` | fixed_value | no | `time` | — | time |
| `orderDir` | fixed_value | no | `DESC` | — | ASC | DESC |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.contentSearch.getPostsByAuthorTagsText()`

Returns a feed list with :author's posts that contain :searchTags in tags and :searchText in :searchIn.

- Route: `/content_search_api/getPostsByAuthorTagsText/:author/:searchTags/:searchText/:searchIn?/:observer?/:bodyLength?/:orderBy?/:orderDir?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/content_search_api/getPostsByAuthorTagsText/author/steem/search`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `searchTags` | string | yes | — | — | — |
| `searchText` | string | yes | — | — | — |
| `searchIn` | fixed_value | no | `any` | — | body | title | any |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `orderBy` | fixed_value | no | `time` | — | time |
| `orderDir` | fixed_value | no | `DESC` | — | ASC | DESC |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.contentSearch.getPostsByAuthorTimeTagsText()`

Returns a feed list with :author's posts in the given time range that contain :searchTags in tags and :searchText in :searchIn.
**Ranges**: [ { "from": "fromTime", "to": "toTime" } ]

- Route: `/content_search_api/getPostsByAuthorTimeTagsText/:author/:fromTime-:toTime/:searchTags/:searchText/:searchIn?/:observer?/:bodyLength?/:orderBy?/:orderDir?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/content_search_api/getPostsByAuthorTimeTagsText/author/1496948307-1596948307/steem/search`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `fromTime` | int (Date / date string / seconds) | yes | — | — | — |
| `toTime` | int (Date / date string / seconds) | yes | — | — | — |
| `searchTags` | string | yes | — | — | — |
| `searchText` | string | yes | — | — | — |
| `searchIn` | fixed_value | no | `any` | — | body | title | any |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `orderBy` | fixed_value | no | `time` | — | time |
| `orderDir` | fixed_value | no | `DESC` | — | ASC | DESC |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.contentSearch.getActivePostsByText()`

Returns a feed list with active posts that contain :searchText in :searchIn.

- Route: `/content_search_api/getActivePostsByText/:searchText/:searchIn?/:observer?/:bodyLength?/:orderBy?/:orderDir?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/content_search_api/getActivePostsByText/search`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `searchText` | string | yes | — | — | — |
| `searchIn` | fixed_value | no | `any` | — | body | title | any |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `orderBy` | fixed_value | no | `time` | — | time |
| `orderDir` | fixed_value | no | `DESC` | — | ASC | DESC |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.contentSearch.getActivePostsByTagsText()`

Returns a feed list with active posts that contain :searchTags in tags and :searchText in :searchIn.

- Route: `/content_search_api/getActivePostsByTagsText/:searchTags/:searchText/:searchIn?/:observer?/:bodyLength?/:orderBy?/:orderDir?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/content_search_api/getActivePostsByTagsText/steem/search`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `searchTags` | string | yes | — | — | — |
| `searchText` | string | yes | — | — | — |
| `searchIn` | fixed_value | no | `any` | — | body | title | any |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `orderBy` | fixed_value | no | `time` | — | time |
| `orderDir` | fixed_value | no | `DESC` | — | ASC | DESC |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.contentSearch.getActivePostsByAuthorText()`

Returns a feed list with :author's active posts that contain :searchText in :searchIn.

- Route: `/content_search_api/getActivePostsByAuthorText/:author/:searchText/:searchIn?/:observer?/:bodyLength?/:orderBy?/:orderDir?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/content_search_api/getActivePostsByAuthorText/author/search`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `searchText` | string | yes | — | — | — |
| `searchIn` | fixed_value | no | `any` | — | body | title | any |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `orderBy` | fixed_value | no | `time` | — | time |
| `orderDir` | fixed_value | no | `DESC` | — | ASC | DESC |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.contentSearch.getActivePostsByAuthorTagsText()`

Returns a feed list with :author's active posts that contain :searchTags in tags and :searchText in :searchIn.

- Route: `/content_search_api/getActivePostsByAuthorTagsText/:author/:searchTags/:searchText/:searchIn?/:observer?/:bodyLength?/:orderBy?/:orderDir?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/content_search_api/getActivePostsByAuthorTagsText/author/steem/search`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `searchTags` | string | yes | — | — | — |
| `searchText` | string | yes | — | — | — |
| `searchIn` | fixed_value | no | `any` | — | body | title | any |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `orderBy` | fixed_value | no | `time` | — | time |
| `orderDir` | fixed_value | no | `DESC` | — | ASC | DESC |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.contentSearch.getCommentsByText()`

Returns a feed list with comments that contain :searchText in :searchIn.

- Route: `/content_search_api/getCommentsByText/:searchText/:searchIn?/:observer?/:bodyLength?/:orderBy?/:orderDir?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/content_search_api/getCommentsByText/search`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `searchText` | string | yes | — | — | — |
| `searchIn` | fixed_value | no | `any` | — | body | title | any |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `orderBy` | fixed_value | no | `time` | — | time |
| `orderDir` | fixed_value | no | `DESC` | — | ASC | DESC |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.contentSearch.getCommentsByTagsText()`

Returns a feed list with comments that contain :searchTags in tags and :searchText in :searchIn.

- Route: `/content_search_api/getCommentsByTagsText/:searchTags/:searchText/:searchIn?/:observer?/:bodyLength?/:orderBy?/:orderDir?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/content_search_api/getCommentsByTagsText/steem/search`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `searchTags` | string | yes | — | — | — |
| `searchText` | string | yes | — | — | — |
| `searchIn` | fixed_value | no | `any` | — | body | title | any |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `orderBy` | fixed_value | no | `time` | — | time |
| `orderDir` | fixed_value | no | `DESC` | — | ASC | DESC |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.contentSearch.getCommentsByTimeTagsText()`

Returns a feed list with comments in the given time range that contain :searchTags in tags and :searchText in :searchIn.
**Ranges**: [ { "from": "fromTime", "to": "toTime" } ]

- Route: `/content_search_api/getCommentsByTimeTagsText/:fromTime-:toTime/:searchTags/:searchText/:searchIn?/:observer?/:bodyLength?/:orderBy?/:orderDir?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/content_search_api/getCommentsByTimeTagsText/1496948307-1596948307/steem/search`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `fromTime` | int (Date / date string / seconds) | yes | — | — | — |
| `toTime` | int (Date / date string / seconds) | yes | — | — | — |
| `searchTags` | string | yes | — | — | — |
| `searchText` | string | yes | — | — | — |
| `searchIn` | fixed_value | no | `any` | — | body | title | any |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `orderBy` | fixed_value | no | `time` | — | time |
| `orderDir` | fixed_value | no | `DESC` | — | ASC | DESC |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.contentSearch.getCommentsByAuthorText()`

Returns a feed list with :author's comments that contain :searchText in :searchIn.

- Route: `/content_search_api/getCommentsByAuthorText/:author/:searchText/:searchIn?/:observer?/:bodyLength?/:orderBy?/:orderDir?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/content_search_api/getCommentsByAuthorText/author/search`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `searchText` | string | yes | — | — | — |
| `searchIn` | fixed_value | no | `any` | — | body | title | any |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `orderBy` | fixed_value | no | `time` | — | time |
| `orderDir` | fixed_value | no | `DESC` | — | ASC | DESC |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.contentSearch.getCommentsByAuthorTagsText()`

Returns a feed list with :author's comments that contain :searchTags in tags and :searchText in :searchIn.

- Route: `/content_search_api/getCommentsByAuthorTagsText/:author/:searchTags/:searchText/:searchIn?/:observer?/:bodyLength?/:orderBy?/:orderDir?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/content_search_api/getCommentsByAuthorTagsText/author/steem/search`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `searchTags` | string | yes | — | — | — |
| `searchText` | string | yes | — | — | — |
| `searchIn` | fixed_value | no | `any` | — | body | title | any |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `orderBy` | fixed_value | no | `time` | — | time |
| `orderDir` | fixed_value | no | `DESC` | — | ASC | DESC |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.contentSearch.getCommentsByAuthorTimeTagsText()`

Returns a feed list with :author's comments in the given time range that contain :searchTags in tags and :searchText in :searchIn.
**Ranges**: [ { "from": "fromTime", "to": "toTime" } ]

- Route: `/content_search_api/getCommentsByAuthorTimeTagsText/:author/:fromTime-:toTime/:searchTags/:searchText/:searchIn?/:observer?/:bodyLength?/:orderBy?/:orderDir?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/content_search_api/getCommentsByAuthorTimeTagsText/author/1496948307-1596948307/steem/search`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `fromTime` | int (Date / date string / seconds) | yes | — | — | — |
| `toTime` | int (Date / date string / seconds) | yes | — | — | — |
| `searchTags` | string | yes | — | — | — |
| `searchText` | string | yes | — | — | — |
| `searchIn` | fixed_value | no | `any` | — | body | title | any |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `orderBy` | fixed_value | no | `time` | — | time |
| `orderDir` | fixed_value | no | `DESC` | — | ASC | DESC |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.contentSearch.getActiveCommentsByText()`

Returns a feed list with active comments that contain :searchText in :searchIn.

- Route: `/content_search_api/getActiveCommentsByText/:searchText/:searchIn?/:observer?/:bodyLength?/:orderBy?/:orderDir?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/content_search_api/getActiveCommentsByText/search`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `searchText` | string | yes | — | — | — |
| `searchIn` | fixed_value | no | `any` | — | body | title | any |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `orderBy` | fixed_value | no | `time` | — | time |
| `orderDir` | fixed_value | no | `DESC` | — | ASC | DESC |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.contentSearch.getActiveCommentsByTagsText()`

Returns a feed list with active comments that contain :searchTags in tags and :searchText in :searchIn.

- Route: `/content_search_api/getActiveCommentsByTagsText/:searchTags/:searchText/:searchIn?/:observer?/:bodyLength?/:orderBy?/:orderDir?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/content_search_api/getActiveCommentsByTagsText/steem/search`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `searchTags` | string | yes | — | — | — |
| `searchText` | string | yes | — | — | — |
| `searchIn` | fixed_value | no | `any` | — | body | title | any |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `orderBy` | fixed_value | no | `time` | — | time |
| `orderDir` | fixed_value | no | `DESC` | — | ASC | DESC |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.contentSearch.getActiveCommentsByAuthorText()`

Returns a feed list with :author's active comments that contain :searchText in :searchIn.

- Route: `/content_search_api/getActiveCommentsByAuthorText/:author/:searchText/:searchIn?/:observer?/:bodyLength?/:orderBy?/:orderDir?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/content_search_api/getActiveCommentsByAuthorText/author/search`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `searchText` | string | yes | — | — | — |
| `searchIn` | fixed_value | no | `any` | — | body | title | any |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `orderBy` | fixed_value | no | `time` | — | time |
| `orderDir` | fixed_value | no | `DESC` | — | ASC | DESC |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.contentSearch.getActiveCommentsByAuthorTagsText()`

Returns a feed list with :author's active comments that contain :searchTags in tags and :searchText in :searchIn.

- Route: `/content_search_api/getActiveCommentsByAuthorTagsText/:author/:searchTags/:searchText/:searchIn?/:observer?/:bodyLength?/:orderBy?/:orderDir?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/content_search_api/getActiveCommentsByAuthorTagsText/author/steem/search`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `searchTags` | string | yes | — | — | — |
| `searchText` | string | yes | — | — | — |
| `searchIn` | fixed_value | no | `any` | — | body | title | any |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `orderBy` | fixed_value | no | `time` | — | time |
| `orderDir` | fixed_value | no | `DESC` | — | ASC | DESC |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

---

## `feeds_api`

Namespace: `sds.feeds` · Group: Posts · 83 methods

### `sds.feeds.getConfig()`

Returns this module's active configuration.

- Route: `/feeds_api/getConfig`
- Result: JSON Object
- Example: `/feeds_api/getConfig`

_No parameters._

### `sds.feeds.getAccountBlog()`

Returns a feed list with :account's own (non-community) and resteemed posts ordered by time descending.

- Route: `/feeds_api/getAccountBlog/:account/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getAccountBlog/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getAccountFriendsFeed()`

Returns a feed list with posts by :account's followed accounts and their resteemed posts ordered by time descending.

- Route: `/feeds_api/getAccountFriendsFeed/:account/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getAccountFriendsFeed/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getAccountCommunitiesFeedByCreated()`

Returns a feed list with posts from :account's subscribed communities ordered by created time descending.

- Route: `/feeds_api/getAccountCommunitiesFeedByCreated/:account/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getAccountCommunitiesFeedByCreated/steemitblog`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getAccountCommunitiesFeedByTrending()`

Returns a feed list with posts from :account's subscribed communities ordered by trending score descending.

- Route: `/feeds_api/getAccountCommunitiesFeedByTrending/:account/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getAccountCommunitiesFeedByTrending/steemitblog`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getAccountCommunitiesFeedByTrendingWithoutWhales()`

Returns a feed list with posts from :account's subscribed communities ordered by trending score (calculated without whale votes) descending.

- Route: `/feeds_api/getAccountCommunitiesFeedByTrendingWithoutWhales/:account/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getAccountCommunitiesFeedByTrendingWithoutWhales/steemitblog`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getAccountCommunitiesFeedByHot()`

Returns a feed list with posts from :account's subscribed communities ordered by hot score descending.

- Route: `/feeds_api/getAccountCommunitiesFeedByHot/:account/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getAccountCommunitiesFeedByHot/steemitblog`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getAccountCommunitiesFeedByHotWithoutWhales()`

Returns a feed list with posts from :account's subscribed communities ordered by hot score (calculated without whale votes) descending.

- Route: `/feeds_api/getAccountCommunitiesFeedByHotWithoutWhales/:account/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getAccountCommunitiesFeedByHotWithoutWhales/steemitblog`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getAccountCommunitiesFeedByInteraction()`

Returns a feed list with posts from :account's subscribed communities ordered by interaction score descending.

- Route: `/feeds_api/getAccountCommunitiesFeedByInteraction/:account/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getAccountCommunitiesFeedByInteraction/steemitblog`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getAccountCommunitiesFeedByPayout()`

Returns a feed list with posts from :account's subscribed communities ordered by payout descending.

- Route: `/feeds_api/getAccountCommunitiesFeedByPayout/:account/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getAccountCommunitiesFeedByPayout/steemitblog`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getAccountCommunitiesFeedByCommentsPayout()`

Returns a feed list with posts from :account's subscribed communities ordered by comments payout descending.

- Route: `/feeds_api/getAccountCommunitiesFeedByCommentsPayout/:account/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getAccountCommunitiesFeedByCommentsPayout/steemitblog`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `account` | account_name | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getPostsByAuthor()`

Returns a feed list with :author's posts ordered by created time descending.

- Route: `/feeds_api/getPostsByAuthor/:author/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getPostsByAuthor/steemitblog`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getPostsByPayout()`

Returns a feed list with all posts ordered by payout amount descending.

- Route: `/feeds_api/getPostsByPayout/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getPostsByPayout`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getPostsByCommentsPayout()`

Returns a feed list with all posts ordered by total comments payout amount descending.

- Route: `/feeds_api/getPostsByCommentsPayout/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getPostsByCommentsPayout`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getPostsByTagCreated()`

Returns a feed list with all posts containing :tag ordered by created time descending.

- Route: `/feeds_api/getPostsByTagCreated/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getPostsByTagCreated/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActivePostsByAuthor()`

Returns a feed list with :author's active posts ordered by created time descending.

- Route: `/feeds_api/getActivePostsByAuthor/:author/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActivePostsByAuthor/steemitblog`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActivePostsByCreated()`

Returns a feed list with active posts ordered by created time descending.

- Route: `/feeds_api/getActivePostsByCreated/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActivePostsByCreated`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActivePostsByTrending()`

Returns a feed list with active posts ordered by trending score descending.

- Route: `/feeds_api/getActivePostsByTrending/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActivePostsByTrending`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActivePostsByTrendingWithoutWhales()`

Returns a feed list with active posts ordered by trending score (calculated without whale votes) descending.

- Route: `/feeds_api/getActivePostsByTrendingWithoutWhales/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActivePostsByTrendingWithoutWhales`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActivePostsByHot()`

Returns a feed list with active posts ordered by hot score descending.

- Route: `/feeds_api/getActivePostsByHot/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActivePostsByHot`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActivePostsByHotWithoutWhales()`

Returns a feed list with active posts ordered by hot score (calculated without whale votes) descending.

- Route: `/feeds_api/getActivePostsByHotWithoutWhales/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActivePostsByHotWithoutWhales`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActivePostsByInteraction()`

Returns a feed list with active posts ordered by interaction score descending.

- Route: `/feeds_api/getActivePostsByInteraction/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActivePostsByInteraction`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActivePostsByPayout()`

Returns a feed list with active posts ordered by payout amount descending.

- Route: `/feeds_api/getActivePostsByPayout/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActivePostsByPayout`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActivePostsByCommentsPayout()`

Returns a feed list with active posts ordered by total comments payout amount descending.

- Route: `/feeds_api/getActivePostsByCommentsPayout/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActivePostsByCommentsPayout`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActivePostsByPromoted()`

Returns a feed list with active posts ordered by promoted amount descending.

- Route: `/feeds_api/getActivePostsByPromoted/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActivePostsByPromoted`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActivePostsByTagCreated()`

Returns a feed list with active posts containing :tag ordered by created time descending.

- Route: `/feeds_api/getActivePostsByTagCreated/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActivePostsByTagCreated/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActivePostsByTagTrending()`

Returns a feed list with active posts containing :tag ordered by trending score descending.

- Route: `/feeds_api/getActivePostsByTagTrending/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActivePostsByTagTrending/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActivePostsByTagTrendingWithoutWhales()`

Returns a feed list with active posts containing :tag ordered by trending score (calculated without whale votes) descending.

- Route: `/feeds_api/getActivePostsByTagTrendingWithoutWhales/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActivePostsByTagTrendingWithoutWhales/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActivePostsByTagHot()`

Returns a feed list with active posts containing :tag ordered by hot score descending.

- Route: `/feeds_api/getActivePostsByTagHot/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActivePostsByTagHot/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActivePostsByTagHotWithoutWhales()`

Returns a feed list with active posts containing :tag ordered by hot score (calculated without whale votes) descending.

- Route: `/feeds_api/getActivePostsByTagHotWithoutWhales/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActivePostsByTagHotWithoutWhales/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActivePostsByTagInteraction()`

Returns a feed list with active posts containing :tag ordered by interaction score descending.

- Route: `/feeds_api/getActivePostsByTagInteraction/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActivePostsByTagInteraction/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActivePostsByTagPayout()`

Returns a feed list with active posts containing :tag ordered by payout amount descending.

- Route: `/feeds_api/getActivePostsByTagPayout/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActivePostsByTagPayout/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActivePostsByTagCommentsPayout()`

Returns a feed list with active posts containing :tag ordered by total comments payout amount descending.

- Route: `/feeds_api/getActivePostsByTagCommentsPayout/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActivePostsByTagCommentsPayout/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActivePostsByTagPromoted()`

Returns a feed list with active posts containing :tag ordered by promoted amount descending.

- Route: `/feeds_api/getActivePostsByTagPromoted/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActivePostsByTagPromoted/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getCommentsByAuthor()`

Returns a feed list with :author's comments ordered by created time descending.

- Route: `/feeds_api/getCommentsByAuthor/:author/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getCommentsByAuthor/steemitblog`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getCommentsByParentAuthor()`

Returns a feed list with comments that are replies to :parentAuthor ordered by created time descending.

- Route: `/feeds_api/getCommentsByParentAuthor/:parentAuthor/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getCommentsByParentAuthor/steemitblog`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `parentAuthor` | account_name | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getCommentsByPayout()`

Returns a feed list with all comments ordered by payout amount descending.

- Route: `/feeds_api/getCommentsByPayout/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getCommentsByPayout`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getCommentsByTagCreated()`

Returns a feed list with all comments containing :tag ordered by created time descending.

- Route: `/feeds_api/getCommentsByTagCreated/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getCommentsByTagCreated/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommentsByAuthor()`

Returns a feed list with :author's active comments ordered by created time descending.

- Route: `/feeds_api/getActiveCommentsByAuthor/:author/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommentsByAuthor/steemitblog`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommentsByCreated()`

Returns a feed list with all comments ordered by created time descending.

- Route: `/feeds_api/getActiveCommentsByCreated/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommentsByCreated`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommentsByPayout()`

Returns a feed list with all comments ordered by payout amount descending.

- Route: `/feeds_api/getActiveCommentsByPayout/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommentsByPayout`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommentsByTagCreated()`

Returns a feed list with active comments containing :tag ordered by created time descending.

- Route: `/feeds_api/getActiveCommentsByTagCreated/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommentsByTagCreated/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommentsByTagPayout()`

Returns a feed list with active comments containing :tag ordered by payout amount descending.

- Route: `/feeds_api/getActiveCommentsByTagPayout/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommentsByTagPayout/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getCommunityPostsByAuthor()`

Returns a feed list with :author's community posts ordered by created time descending.

- Route: `/feeds_api/getCommunityPostsByAuthor/:community/:author/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getCommunityPostsByAuthor/hive-172186/steemitblog`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `author` | account_name | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getCommunityPostsByCreated()`

Returns a feed list with community posts ordered by created time descending.

- Route: `/feeds_api/getCommunityPostsByCreated/:community/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getCommunityPostsByCreated/hive-172186`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getCommunityPostsByPayout()`

Returns a feed list with all commmunity posts ordered by payout amount descending.

- Route: `/feeds_api/getCommunityPostsByPayout/:community/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getCommunityPostsByPayout/hive-172186`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getCommunityPostsByCommentsPayout()`

Returns a feed list with all community posts ordered by total comments payout amount descending.

- Route: `/feeds_api/getCommunityPostsByCommentsPayout/:community/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getCommunityPostsByCommentsPayout/hive-172186`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getCommunityPostsByTagAuthor()`

Returns a feed list with :author's community posts containing :tag ordered by created time descending.

- Route: `/feeds_api/getCommunityPostsByTagAuthor/:community/:tag/:author/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getCommunityPostsByTagAuthor/hive-172186/steem/steemitblog`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `tag` | string | yes | — | — | — |
| `author` | account_name | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getCommunityPostsByTagCreated()`

Returns a feed list with community posts containing :tag ordered by created time descending.

- Route: `/feeds_api/getCommunityPostsByTagCreated/:community/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getCommunityPostsByTagCreated/hive-172186/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getCommunityPostsByTagPayout()`

Returns a feed list with all commmunity posts containing :tag ordered by payout amount descending.

- Route: `/feeds_api/getCommunityPostsByTagPayout/:community/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getCommunityPostsByTagPayout/hive-172186/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getCommunityPostsByTagCommentsPayout()`

Returns a feed list with all community posts containing :tag ordered by total comments payout amount descending.

- Route: `/feeds_api/getCommunityPostsByTagCommentsPayout/:community/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getCommunityPostsByTagCommentsPayout/hive-172186/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommunityPostsByAuthor()`

Returns a feed list with :author's active community posts ordered by created time descending.

- Route: `/feeds_api/getActiveCommunityPostsByAuthor/:community/:author/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommunityPostsByAuthor/hive-172186/steemitblog`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `author` | account_name | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommunityPostsByCreated()`

Returns a feed list with active community posts ordered by created time descending.

- Route: `/feeds_api/getActiveCommunityPostsByCreated/:community/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommunityPostsByCreated/hive-172186`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommunityPostsByTrending()`

Returns a feed list with active community posts ordered by trending score descending.

- Route: `/feeds_api/getActiveCommunityPostsByTrending/:community/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommunityPostsByTrending/hive-172186`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommunityPostsByTrendingWithoutWhales()`

Returns a feed list with active community posts ordered by trending score (calculated without whale votes) descending.

- Route: `/feeds_api/getActiveCommunityPostsByTrendingWithoutWhales/:community/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommunityPostsByTrendingWithoutWhales/hive-172186`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommunityPostsByHot()`

Returns a feed list with active community posts ordered by hot score descending.

- Route: `/feeds_api/getActiveCommunityPostsByHot/:community/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommunityPostsByHot/hive-172186`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommunityPostsByHotWithoutWhales()`

Returns a feed list with active community posts ordered by hot score (calculated without whale votes) descending.

- Route: `/feeds_api/getActiveCommunityPostsByHotWithoutWhales/:community/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommunityPostsByHotWithoutWhales/hive-172186`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommunityPostsByInteraction()`

Returns a feed list with active community posts ordered by interaction score descending.

- Route: `/feeds_api/getActiveCommunityPostsByInteraction/:community/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommunityPostsByInteraction/hive-172186`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommunityPostsByPayout()`

Returns a feed list with active community posts ordered by payout amount descending.

- Route: `/feeds_api/getActiveCommunityPostsByPayout/:community/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommunityPostsByPayout/hive-172186`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommunityPostsByCommentsPayout()`

Returns a feed list with active community posts ordered by total comments payout amount descending.

- Route: `/feeds_api/getActiveCommunityPostsByCommentsPayout/:community/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommunityPostsByCommentsPayout/hive-172186`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommunityPostsByPromoted()`

Returns a feed list with active community posts ordered by promoted amount descending.

- Route: `/feeds_api/getActiveCommunityPostsByPromoted/:community/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommunityPostsByPromoted/hive-172186`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommunityPostsByTagAuthor()`

Returns a feed list with :author's active community posts containing :tag ordered by created time descending.

- Route: `/feeds_api/getActiveCommunityPostsByTagAuthor/:community/:tag/:author/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommunityPostsByTagAuthor/hive-172186/steem/steemitblog`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `tag` | string | yes | — | — | — |
| `author` | account_name | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommunityPostsByTagCreated()`

Returns a feed list with active community posts containing :tag ordered by created time descending.

- Route: `/feeds_api/getActiveCommunityPostsByTagCreated/:community/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommunityPostsByTagCreated/hive-172186/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommunityPostsByTagTrending()`

Returns a feed list with active community posts containing :tag ordered by trending score descending.

- Route: `/feeds_api/getActiveCommunityPostsByTagTrending/:community/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommunityPostsByTagTrending/hive-172186/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommunityPostsByTagTrendingWithoutWhales()`

Returns a feed list with active community posts containing :tag ordered by trending score (calculated without whale votes) descending.

- Route: `/feeds_api/getActiveCommunityPostsByTagTrendingWithoutWhales/:community/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommunityPostsByTagTrendingWithoutWhales/hive-172186/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommunityPostsByTagHot()`

Returns a feed list with active community posts containing :tag ordered by hot score descending.

- Route: `/feeds_api/getActiveCommunityPostsByTagHot/:community/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommunityPostsByTagHot/hive-172186/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommunityPostsByTagHotWithoutWhales()`

Returns a feed list with active community posts containing :tag ordered by hot score (calculated without whale votes) descending.

- Route: `/feeds_api/getActiveCommunityPostsByTagHotWithoutWhales/:community/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommunityPostsByTagHotWithoutWhales/hive-172186/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommunityPostsByTagInteraction()`

Returns a feed list with active community posts containing :tag ordered by interaction score descending.

- Route: `/feeds_api/getActiveCommunityPostsByTagInteraction/:community/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommunityPostsByTagInteraction/hive-172186/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommunityPostsByTagPayout()`

Returns a feed list with active community posts containing :tag ordered by payout amount descending.

- Route: `/feeds_api/getActiveCommunityPostsByTagPayout/:community/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommunityPostsByTagPayout/hive-172186/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommunityPostsByTagCommentsPayout()`

Returns a feed list with active community posts containing :tag ordered by total comments payout amount descending.

- Route: `/feeds_api/getActiveCommunityPostsByTagCommentsPayout/:community/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommunityPostsByTagCommentsPayout/hive-172186/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommunityPostsByTagPromoted()`

Returns a feed list with active community posts containing :tag ordered by promoted amount descending.

- Route: `/feeds_api/getActiveCommunityPostsByTagPromoted/:community/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommunityPostsByTagPromoted/hive-172186/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getCommunityCommentsByAuthor()`

Returns a feed list with :author's community comments ordered by created time descending.

- Route: `/feeds_api/getCommunityCommentsByAuthor/:community/:author/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getCommunityCommentsByAuthor/hive-172186/steemitblog`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `author` | account_name | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getCommunityCommentsByCreated()`

Returns a feed list with community comments ordered by created time descending.

- Route: `/feeds_api/getCommunityCommentsByCreated/:community/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getCommunityCommentsByCreated/hive-172186`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getCommunityCommentsByPayout()`

Returns a feed list with all commmunity comments ordered by payout amount descending.

- Route: `/feeds_api/getCommunityCommentsByPayout/:community/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getCommunityCommentsByPayout/hive-172186`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getCommunityCommentsByTagAuthor()`

Returns a feed list with :author's community comments containing :tag ordered by created time descending.

- Route: `/feeds_api/getCommunityCommentsByTagAuthor/:community/:tag/:author/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getCommunityCommentsByTagAuthor/hive-172186/steem/steemitblog`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `tag` | string | yes | — | — | — |
| `author` | account_name | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getCommunityCommentsByTagCreated()`

Returns a feed list with community comments containing :tag ordered by created time descending.

- Route: `/feeds_api/getCommunityCommentsByTagCreated/:community/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getCommunityCommentsByTagCreated/hive-172186/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getCommunityCommentsByTagPayout()`

Returns a feed list with all commmunity comments containing :tag ordered by payout amount descending.

- Route: `/feeds_api/getCommunityCommentsByTagPayout/:community/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getCommunityCommentsByTagPayout/hive-172186/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommunityCommentsByAuthor()`

Returns a feed list with :author's active community comments ordered by created time descending.

- Route: `/feeds_api/getActiveCommunityCommentsByAuthor/:community/:author/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommunityCommentsByAuthor/hive-172186/steemitblog`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `author` | account_name | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommunityCommentsByCreated()`

Returns a feed list with active community comments ordered by created time descending.

- Route: `/feeds_api/getActiveCommunityCommentsByCreated/:community/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommunityCommentsByCreated/hive-172186`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommunityCommentsByPayout()`

Returns a feed list with active community comments ordered by payout amount descending.

- Route: `/feeds_api/getActiveCommunityCommentsByPayout/:community/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommunityCommentsByPayout/hive-172186`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommunityCommentsByTagAuthor()`

Returns a feed list with :author's active community comments containing :tag ordered by created time descending.

- Route: `/feeds_api/getActiveCommunityCommentsByTagAuthor/:community/:tag/:author/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommunityCommentsByTagAuthor/hive-172186/steem/steemitblog`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `tag` | string | yes | — | — | — |
| `author` | account_name | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommunityCommentsByTagCreated()`

Returns a feed list with active community comments containing :tag ordered by created time descending.

- Route: `/feeds_api/getActiveCommunityCommentsByTagCreated/:community/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommunityCommentsByTagCreated/hive-172186/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.feeds.getActiveCommunityCommentsByTagPayout()`

Returns a feed list with active community comments containing :tag ordered by payout amount descending.

- Route: `/feeds_api/getActiveCommunityCommentsByTagPayout/:community/:tag/:observer?/:bodyLength?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/feeds_api/getActiveCommunityCommentsByTagPayout/hive-172186/steem`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `tag` | string | yes | — | — | — |
| `observer` | account_name | no | `null` | — | — |
| `bodyLength` | int | no | `250` | 0 – 1000 | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

---

## `posts_api`

Namespace: `sds.posts` · Group: Posts · 14 methods

### `sds.posts.getConfig()`

Returns this module's active configuration.

- Route: `/posts_api/getConfig`
- Result: JSON Object
- Example: `/posts_api/getConfig`

_No parameters._

### `sds.posts.getPost()`

Returns the post data for the given :author / :permlink.

- Route: `/posts_api/getPost/:author/:permlink/:withVotes?/:observer?/:fields?`
- Result: JSON Object
- Example: `/posts_api/getPost/steemit/firstpost`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `permlink` | string | yes | — | — | — |
| `withVotes` | bool | no | `true` | — | true | false | 1 | 0 |
| `observer` | account_name | no | — | — | — |
| `fields` | fixed_csv | no | `*` | — | link_id | link_status | author_reputation | author_status | author_role | author_title | author | permlink | … (53 values) |

### `sds.posts.getPostReplies()`

Returns all replies of the post with the given :author / :permlink.

- Route: `/posts_api/getPostReplies/:author/:permlink/:withVotes?/:observer?/:fields?`
- Result: JSON Object
- Example: `/posts_api/getPostReplies/steemit/firstpost`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `permlink` | string | yes | — | — | — |
| `withVotes` | bool | no | `true` | — | true | false | 1 | 0 |
| `observer` | account_name | no | — | — | — |
| `fields` | fixed_csv | no | `*` | — | link_id | link_status | author_reputation | author_status | author_role | author_title | author | permlink | … (53 values) |

### `sds.posts.getPostWithReplies()`

Returns the data and all replies of the post with the given :author / :permlink.

- Route: `/posts_api/getPostWithReplies/:author/:permlink/:withVotes?/:observer?/:fields?`
- Result: JSON Object
- Example: `/posts_api/getPostWithReplies/bestmalik/re-steemit-firstpost-20160726t035722561z`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `permlink` | string | yes | — | — | — |
| `withVotes` | bool | no | `true` | — | true | false | 1 | 0 |
| `observer` | account_name | no | — | — | — |
| `fields` | fixed_csv | no | `*` | — | link_id | link_status | author_reputation | author_status | author_role | author_title | author | permlink | … (53 values) |

### `sds.posts.getBeneficiaries()`

Returns all beneficiaries of the post with the given :author / :permlink.

- Route: `/posts_api/getBeneficiaries/:author/:permlink`
- Result: JSON Object
- Example: `/posts_api/getBeneficiaries/steemit/firstpost`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `permlink` | string | yes | — | — | — |

### `sds.posts.getPayout()`

Returns the payout data of the post with the given :author / :permlink.

- Route: `/posts_api/getPayout/:author/:permlink/:withVotes?/:withBenefs?`
- Result: JSON Object
- Example: `/posts_api/getPayout/steemit/firstpost`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `permlink` | string | yes | — | — | — |
| `withVotes` | bool | no | `false` | — | true | false | 1 | 0 |
| `withBenefs` | bool | no | `false` | — | true | false | 1 | 0 |

### `sds.posts.getVotes()`

Returns all votes of the post with the given :author / :permlink.

- Route: `/posts_api/getVotes/:author/:permlink`
- Result: JSON Object
- Example: `/posts_api/getVotes/steemit/firstpost`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `permlink` | string | yes | — | — | — |

### `sds.posts.getPostById()`

Returns the post data for the given :linkId.

- Route: `/posts_api/getPostById/:linkId/:withVotes?/:observer?/:fields?`
- Result: JSON Object
- Example: `/posts_api/getPostById/1`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `linkId` | int | yes | — | ≥ 1 | — |
| `withVotes` | bool | no | `true` | — | true | false | 1 | 0 |
| `observer` | account_name | no | — | — | — |
| `fields` | fixed_csv | no | `*` | — | link_id | link_status | author_reputation | author_status | author_role | author_title | author | permlink | … (53 values) |

### `sds.posts.getPostRepliesById()`

Returns all replies of the post with the given :linkId.

- Route: `/posts_api/getPostRepliesById/:linkId/:withVotes?/:observer?/:fields?`
- Result: JSON Object
- Example: `/posts_api/getPostRepliesById/1`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `linkId` | int | yes | — | ≥ 1 | — |
| `withVotes` | bool | no | `true` | — | true | false | 1 | 0 |
| `observer` | account_name | no | — | — | — |
| `fields` | fixed_csv | no | `*` | — | link_id | link_status | author_reputation | author_status | author_role | author_title | author | permlink | … (53 values) |

### `sds.posts.getPostWithRepliesById()`

Returns the data and all replies of the post with the given :linkId.

- Route: `/posts_api/getPostWithRepliesById/:linkId/:withVotes?/:observer?/:fields?`
- Result: JSON Object
- Example: `/posts_api/getPostWithRepliesById/264480`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `linkId` | int | yes | — | ≥ 1 | — |
| `withVotes` | bool | no | `true` | — | true | false | 1 | 0 |
| `observer` | account_name | no | — | — | — |
| `fields` | fixed_csv | no | `*` | — | link_id | link_status | author_reputation | author_status | author_role | author_title | author | permlink | … (53 values) |

### `sds.posts.getBeneficiariesById()`

Returns all beneficiaries of the post with the given :linkId.

- Route: `/posts_api/getBeneficiariesById/:linkId`
- Result: JSON Object
- Example: `/posts_api/getBeneficiariesById/1`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `linkId` | int | yes | — | ≥ 1 | — |

### `sds.posts.getPayoutById()`

Returns the payout data of the post with the given :linkId.

- Route: `/posts_api/getPayoutById/:linkId/:withVotes?/:withBenefs?`
- Result: JSON Object
- Example: `/posts_api/getPayoutById/1`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `linkId` | int | yes | — | ≥ 1 | — |
| `withVotes` | bool | no | `false` | — | true | false | 1 | 0 |
| `withBenefs` | bool | no | `false` | — | true | false | 1 | 0 |

### `sds.posts.getVotesById()`

Returns all votes of the post with the given :linkId.

- Route: `/posts_api/getVotesById/:linkId`
- Result: JSON Object
- Example: `/posts_api/getVotesById/1`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `linkId` | int | yes | — | ≥ 1 | — |

### `sds.posts.getRootPostsByAuthor()`

Returns :author's root posts ordered by created time descending.

- Route: `/posts_api/getRootPostsByAuthor/:author/:withVotes?/:observer?/:fields?/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 100
- Example: `/posts_api/getRootPostsByAuthor/steemit`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `withVotes` | bool | no | `false` | — | true | false | 1 | 0 |
| `observer` | account_name | no | — | — | — |
| `fields` | fixed_csv | no | `*` | — | link_id | link_status | author_reputation | author_status | author_role | author_title | author | permlink | … (53 values) |
| `limit` | int | no | `10` | 1 – 100 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

---

## `post_resteems_api`

Namespace: `sds.postResteems` · Group: Posts · 3 methods

### `sds.postResteems.getConfig()`

Returns this module's active configuration.

- Route: `/post_resteems_api/getConfig`
- Result: JSON Object
- Example: `/post_resteems_api/getConfig`

_No parameters._

### `sds.postResteems.getResteems()`

Returns the resteems for the given :author / :permlink.

- Route: `/post_resteems_api/getResteems/:author/:permlink/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/post_resteems_api/getResteems/steemit/firstpost`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `permlink` | string | yes | — | — | — |
| `limit` | int | no | `250` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.postResteems.getResteemsByResteemerTime()`

Returns the resteems of the given :resteemer in the given time range.
**Ranges**: [ { "from": "fromTime", "to": "toTime" } ]

- Route: `/post_resteems_api/getResteemsByResteemerTime/:resteemer/:fromTime-:toTime/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/post_resteems_api/getResteemsByResteemerTime/steemchiller/1788983274-1789588074`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `resteemer` | account_name | yes | — | — | — |
| `fromTime` | int (Date / date string / seconds) | yes | — | — | — |
| `toTime` | int (Date / date string / seconds) | yes | — | — | — |
| `limit` | int | no | `250` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

---

## `post_tags_api`

Namespace: `sds.postTags` · Group: Posts · 13 methods

### `sds.postTags.getConfig()`

Returns this module's active configuration.

- Route: `/post_tags_api/getConfig`
- Result: JSON Object
- Example: `/post_tags_api/getConfig`

_No parameters._

### `sds.postTags.getTopPostTags()`

Returns a list of all in posts used tags, grouped by tag, ordered by usage count descending.

- Route: `/post_tags_api/getTopPostTags/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/post_tags_api/getTopPostTags`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.postTags.getTopPostTagsByAuthor()`

Returns a list of all in :author's posts used tags, grouped by tag, ordered by usage count descending.

- Route: `/post_tags_api/getTopPostTagsByAuthor/:author/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/post_tags_api/getTopPostTagsByAuthor/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.postTags.getTopPostTagsByCommunity()`

Returns a list of all in :community's posts used tags, grouped by tag, ordered by usage count descending.

- Route: `/post_tags_api/getTopPostTagsByCommunity/:community/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/post_tags_api/getTopPostTagsByCommunity/hive-172186`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.postTags.getTopActivePostTags()`

Returns a list of all in active posts used tags, grouped by tag, ordered by usage count descending.

- Route: `/post_tags_api/getTopActivePostTags/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/post_tags_api/getTopActivePostTags`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.postTags.getTopActivePostTagsByAuthor()`

Returns a list of all in :author's active posts used tags, grouped by tag, ordered by usage count descending.

- Route: `/post_tags_api/getTopActivePostTagsByAuthor/:author/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/post_tags_api/getTopActivePostTagsByAuthor/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.postTags.getTopActivePostTagsByCommunity()`

Returns a list of all in :community's active posts used tags, grouped by tag, ordered by usage count descending.

- Route: `/post_tags_api/getTopActivePostTagsByCommunity/:community/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/post_tags_api/getTopActivePostTagsByCommunity/hive-172186`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.postTags.getTopCommentTags()`

Returns a list of all in comments used tags, grouped by tag, ordered by usage count descending.

- Route: `/post_tags_api/getTopCommentTags/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/post_tags_api/getTopCommentTags`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.postTags.getTopCommentTagsByAuthor()`

Returns a list of all in :author's comments used tags, grouped by tag, ordered by usage count descending.

- Route: `/post_tags_api/getTopCommentTagsByAuthor/:author/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/post_tags_api/getTopCommentTagsByAuthor/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.postTags.getTopCommentTagsByCommunity()`

Returns a list of all in :community's comments used tags, grouped by tag, ordered by usage count descending.

- Route: `/post_tags_api/getTopCommentTagsByCommunity/:community/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/post_tags_api/getTopCommentTagsByCommunity/hive-172186`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.postTags.getTopActiveCommentTags()`

Returns a list of all in active comments used tags, grouped by tag, ordered by usage count descending.

- Route: `/post_tags_api/getTopActiveCommentTags/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/post_tags_api/getTopActiveCommentTags`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.postTags.getTopActiveCommentTagsByAuthor()`

Returns a list of all in :author's active comments used tags, grouped by tag, ordered by usage count descending.

- Route: `/post_tags_api/getTopActiveCommentTagsByAuthor/:author/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/post_tags_api/getTopActiveCommentTagsByAuthor/steemchiller`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `author` | account_name | yes | — | — | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

### `sds.postTags.getTopActiveCommentTagsByCommunity()`

Returns a list of all in :community's active comments used tags, grouped by tag, ordered by usage count descending.

- Route: `/post_tags_api/getTopActiveCommentTagsByCommunity/:community/:limit?/:offset?`
- Result: JSON Object
- Max. limit: 1000
- Example: `/post_tags_api/getTopActiveCommentTagsByCommunity/hive-172186`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `community` | account_name (e.g. `hive-160125`) | yes | — | — | — |
| `limit` | int | no | `100` | 1 – 1000 | — |
| `offset` | int | no | `0` | ≥ 0 | — |

---

## `system_api`

Namespace: `sds.system` · Group: System · 5 methods

### `sds.system.getDataSources()`

Returns data source state information.

- Route: `/system_api/getDataSources`
- Result: JSON Object
- Example: `/system_api/getDataSources`

_No parameters._

### `sds.system.getState()`

Returns general system state information.

- Route: `/system_api/getState`
- Result: JSON Object
- Example: `/system_api/getState`

_No parameters._

### `sds.system.getVersion()`

Returns the currently running SDS version.

- Route: `/system_api/getVersion`
- Result: String
- Example: `/system_api/getVersion`

_No parameters._

### `sds.system.hasMethod()`

Checks if a request handler for :moduleId/:methodId exists in this instance.

- Route: `/system_api/hasMethod/:moduleId/:methodId`
- Result: Boolean
- Example: `/system_api/hasMethod/blocks_api/getBlock`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `moduleId` | string | yes | — | — | — |
| `methodId` | string | yes | — | — | — |

### `sds.system.hasModule()`

Checks if a module with :moduleId is active in this instance.

- Route: `/system_api/hasModule/:moduleId`
- Result: Boolean
- Example: `/system_api/hasModule/blocks_api`

| Parameter | Type | Required | Default | Range | Allowed values |
| --- | --- | --- | --- | --- | --- |
| `moduleId` | string | yes | — | — | — |


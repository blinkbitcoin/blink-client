import {
  QueryResult,
  QueryHookOptions,
  useApolloClient,
  useQuery as useApolloQuery,
  QueryOptions,
} from "@apollo/client"
import { useCallback, useState } from "react"

import { GaloyGQL, joinErrorsMessages } from "../index"
import { QUERIES } from "./gql_operations"
import { DocumentNode } from "graphql"

type QueryHelpers = {
  errorsMessage?: string
}

const useQueryWrapper = <TData = unknown, TVars = unknown>(
  queryName: keyof typeof QUERIES,
  config?: QueryHookOptions<TData, TVars>,
): QueryResult<TData, TVars> & QueryHelpers => {
  const result = useApolloQuery<TData, TVars>(
    QUERIES[queryName] as unknown as DocumentNode,
    config,
  )

  const { data, error } = result
  const errors = (data as any)?.[queryName]?.errors
  const errorsMessage = error?.message || joinErrorsMessages(errors)

  return { ...result, errorsMessage }
}

const onChainTxFeeQuery = (
  config?: QueryHookOptions<
    GaloyGQL.OnChainTxFeeQuery,
    GaloyGQL.OnChainTxFeeQueryVariables
  >,
): QueryResult<GaloyGQL.OnChainTxFeeQuery, GaloyGQL.OnChainTxFeeQueryVariables> &
  QueryHelpers => {
  return useQueryWrapper<GaloyGQL.OnChainTxFeeQuery, GaloyGQL.OnChainTxFeeQueryVariables>(
    "onChainTxFee",
    config,
  )
}

const mainQuery = (
  config?: QueryHookOptions<GaloyGQL.MainQuery, GaloyGQL.MainQueryVariables>,
): QueryResult<GaloyGQL.MainQuery, GaloyGQL.MainQueryVariables> & QueryHelpers => {
  return useQueryWrapper<GaloyGQL.MainQuery, GaloyGQL.MainQueryVariables>("main", config)
}

const accountDefaultWalletQuery = (
  config?: QueryHookOptions<
    GaloyGQL.AccountDefaultWalletQuery,
    GaloyGQL.AccountDefaultWalletQueryVariables
  >,
): QueryResult<
  GaloyGQL.AccountDefaultWalletQuery,
  GaloyGQL.AccountDefaultWalletQueryVariables
> &
  QueryHelpers => {
  return useQueryWrapper<
    GaloyGQL.AccountDefaultWalletQuery,
    GaloyGQL.AccountDefaultWalletQueryVariables
  >("accountDefaultWallet", config)
}

const mobileVersionsQuery = (
  config?: QueryHookOptions<
    GaloyGQL.MobileVersionsQuery,
    GaloyGQL.MobileVersionsQueryVariables
  >,
): QueryResult<GaloyGQL.MobileVersionsQuery, GaloyGQL.MobileVersionsQueryVariables> &
  QueryHelpers => {
  return useQueryWrapper<
    GaloyGQL.MobileVersionsQuery,
    GaloyGQL.MobileVersionsQueryVariables
  >("mobileVersions", config)
}

const transactionListQuery = (
  config?: QueryHookOptions<
    GaloyGQL.TransactionListQuery,
    GaloyGQL.TransactionListQueryVariables
  >,
): QueryResult<GaloyGQL.TransactionListQuery> & QueryHelpers => {
  return useQueryWrapper<
    GaloyGQL.TransactionListQuery,
    GaloyGQL.TransactionListQueryVariables
  >("transactionList", config)
}

const transactionListForDefaultAccountQuery = (
  config?: QueryHookOptions<
    GaloyGQL.TransactionListForDefaultAccountQuery,
    GaloyGQL.TransactionListForDefaultAccountQueryVariables
  >,
): QueryResult<GaloyGQL.TransactionListForDefaultAccountQuery> & QueryHelpers => {
  return useQueryWrapper<
    GaloyGQL.TransactionListForDefaultAccountQuery,
    GaloyGQL.TransactionListForDefaultAccountQueryVariables
  >("transactionListForDefaultAccount", config)
}

const contactsQuery = (
  config?: QueryHookOptions<GaloyGQL.ContactsQuery, GaloyGQL.ContactsQueryVariables>,
): QueryResult<GaloyGQL.ContactsQuery, GaloyGQL.ContactsQueryVariables> &
  QueryHelpers => {
  return useQueryWrapper<GaloyGQL.ContactsQuery, GaloyGQL.ContactsQueryVariables>(
    "contacts",
    config,
  )
}

const transactionListForContactQuery = (
  config?: QueryHookOptions<
    GaloyGQL.TransactionListForContactQuery,
    GaloyGQL.TransactionListForContactQueryVariables
  >,
): QueryResult<
  GaloyGQL.TransactionListForContactQuery,
  GaloyGQL.TransactionListForContactQueryVariables
> &
  QueryHelpers => {
  return useQueryWrapper<
    GaloyGQL.TransactionListForContactQuery,
    GaloyGQL.TransactionListForContactQueryVariables
  >("transactionListForContact", config)
}

export const useQuery = {
  accountDefaultWallet: accountDefaultWalletQuery,
  contacts: contactsQuery,
  main: mainQuery,
  mobileVersions: mobileVersionsQuery,
  onChainTxFee: onChainTxFeeQuery,
  transactionList: transactionListQuery,
  transactionListForContact: transactionListForContactQuery,
  transactionListForDefaultAccount: transactionListForDefaultAccountQuery,
}

// ********** DELAYED QUERIES ********** //

const useDelayedQueryWrapper = <TData = unknown, TVars = unknown>(
  queryName: keyof typeof QUERIES,
  config?: Omit<QueryOptions<TVars, TData>, "query" | "variables">,
): [
  (variables?: TVars) => Promise<QueryResult<TData> & QueryHelpers>,
  { loading: boolean },
] => {
  const client = useApolloClient()
  const [loading, setLoading] = useState<boolean>(false)

  const sendQuery = useCallback(
    async (variables: TVars) => {
      setLoading(true)
      try {
        const result = await client.query({
          query: QUERIES[queryName] as unknown as DocumentNode,
          variables,
          ...config,
        })
        setLoading(false)
        const { data, error } = result
        const errors = (data as any)?.[queryName]?.errors
        const errorsMessage = error?.message || joinErrorsMessages(errors)

        return { ...result, loading, errorsMessage }
      } catch (err: any) {
        setLoading(false)
        return Promise.resolve({
          networkStatus: "ERROR",
          data: undefined,
          error: err,
          loading,
          errorsMessage: err?.message || "Something went wrong",
        })
      }
    },
    [client, queryName],
  )

  return [
    sendQuery as unknown as (
      variables?: TVars,
    ) => Promise<QueryResult<TData> & QueryHelpers>,
    { loading },
  ]
}

const userDefaultWalletIdDelayedQuery = (
  config?: QueryOptions<
    GaloyGQL.UserDefaultWalletIdQuery,
    GaloyGQL.UserDefaultWalletIdQueryVariables
  >,
) => {
  return useDelayedQueryWrapper<
    GaloyGQL.UserDefaultWalletIdQuery,
    GaloyGQL.UserDefaultWalletIdQueryVariables
  >("userDefaultWalletId", config)
}

const accountDefaultWalletDelayedQuery = (
  config?: QueryOptions<
    GaloyGQL.AccountDefaultWalletQuery,
    GaloyGQL.AccountDefaultWalletQueryVariables
  >,
) => {
  return useDelayedQueryWrapper<
    GaloyGQL.AccountDefaultWalletQuery,
    GaloyGQL.AccountDefaultWalletQueryVariables
  >("accountDefaultWallet", config)
}

const contactsDelayedQuery = (
  config?: QueryOptions<GaloyGQL.ContactsQuery, GaloyGQL.ContactsQueryVariables>,
) => {
  return useDelayedQueryWrapper<GaloyGQL.ContactsQuery, GaloyGQL.ContactsQueryVariables>(
    "contacts",
    config,
  )
}

const mobileVersionsDelayedQuery = (
  config?: QueryHookOptions<
    GaloyGQL.MobileVersionsQuery,
    GaloyGQL.MobileVersionsQueryVariables
  >,
): QueryResult<GaloyGQL.MobileVersionsQuery, GaloyGQL.MobileVersionsQueryVariables> &
  QueryHelpers => {
  return useQueryWrapper<
    GaloyGQL.MobileVersionsQuery,
    GaloyGQL.MobileVersionsQueryVariables
  >("mobileVersions", config)
}

const transactionListDelayedQuery = (
  config?: QueryOptions<
    GaloyGQL.TransactionListQuery,
    GaloyGQL.TransactionListQueryVariables
  >,
) => {
  return useDelayedQueryWrapper<
    GaloyGQL.TransactionListQuery,
    GaloyGQL.TransactionListQueryVariables
  >("transactionList", config)
}

const transactionListForContactDelayedQuery = (
  config?: QueryOptions<
    GaloyGQL.TransactionListForContactQuery,
    GaloyGQL.TransactionListForContactQueryVariables
  >,
) => {
  return useDelayedQueryWrapper<
    GaloyGQL.TransactionListForContactQuery,
    GaloyGQL.TransactionListForContactQueryVariables
  >("transactionListForContact", config)
}

const onChainTxFeeDelayedQuery = (
  config?: QueryOptions<GaloyGQL.OnChainTxFeeQuery, GaloyGQL.OnChainTxFeeQueryVariables>,
) => {
  return useDelayedQueryWrapper<
    GaloyGQL.OnChainTxFeeQuery,
    GaloyGQL.OnChainTxFeeQueryVariables
  >("onChainTxFee", config)
}

export const useDelayedQuery = {
  accountDefaultWallet: accountDefaultWalletDelayedQuery,
  contacts: contactsDelayedQuery,
  mobileVersions: mobileVersionsDelayedQuery,
  onChainTxFee: onChainTxFeeDelayedQuery,
  transactionList: transactionListDelayedQuery,
  transactionListForContact: transactionListForContactDelayedQuery,
  userDefaultWalletId: userDefaultWalletIdDelayedQuery,
}

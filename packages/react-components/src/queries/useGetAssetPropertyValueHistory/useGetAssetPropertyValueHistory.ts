import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { AssetPropertyValueHistoryCacheKeyFactory } from './getAssetPropertyValueHistoryQueryKeyFactory';
import { GetGetAssetPropertyValueHistoryRequest } from './getGetAssetPropertyValueHistoryRequest';
import { createNonNullableList } from '../../utils/createNonNullableList';

export interface UseGetAssetPropertyValueHistoryOptions {
  client: IoTSiteWiseClient;
  assetId?: string;
  propertyId?: string;
  startDate?: Date;
  endDate?: Date;
  fetchAll?: boolean;
}

/** Use an AWS IoT SiteWise asset description. */
export function useGetAssetPropertyValueHistory({
  client,
  assetId,
  propertyId,
  startDate,
  endDate,
  fetchAll,
}: UseGetAssetPropertyValueHistoryOptions) {
  const cacheKeyFactory = new AssetPropertyValueHistoryCacheKeyFactory({
    assetId,
    propertyId,
    startDate,
    endDate,
  });

  const {
    data,
    fetchNextPage,
    refetch,
    hasNextPage,
    isFetching,
    isSuccess,
    status,
    isError,
    error,
    isLoading,
    // @ts-expect-error Upgrade issue
  } = useInfiniteQuery({
    enabled: isEnabled({ assetId, propertyId, startDate, endDate }),
    queryKey: cacheKeyFactory.create(),
    queryFn: createQueryFn(client),
    getNextPageParam: ({ nextToken }) => nextToken,
  });

  const { pages } = data ?? { pages: [] };

  if (fetchAll && hasNextPage) fetchNextPage();

  const assetPropertyValueHistory = createNonNullableList(
    pages.flatMap((res) => res.assetPropertyValueHistory)
  );

  return {
    data,
    assetPropertyValueHistory,
    fetchNextPage,
    refetch,
    hasNextPage,
    isFetching,
    isSuccess,
    status,
    isError,
    error,
    /**
     * isLoading will flip true / false for a second
     * after 1 page loads and fetchNextPage is called
     * This makes using the boolean on the UI difficult becase
     * components will flicker
     */
    isLoading: fetchAll ? hasNextPage : isLoading,
  };
}

const isAssetId = (assetId?: string): assetId is string => Boolean(assetId);
const isPropertyId = (propertyId?: string): propertyId is string =>
  Boolean(propertyId);
const isStartDate = (startDate?: number): startDate is number =>
  Boolean(startDate);
const isEndDate = (endDate?: number): endDate is number => Boolean(endDate);
const isEnabled = ({
  assetId,
  propertyId,
  startDate,
  endDate,
}: {
  assetId?: string;
  propertyId?: string;
  startDate?: Date;
  endDate?: Date;
}) =>
  isAssetId(assetId) &&
  isPropertyId(propertyId) &&
  isStartDate(startDate?.getTime()) &&
  isEndDate(endDate?.getTime());

const createQueryFn = (client: IoTSiteWiseClient) => {
  return async ({
    queryKey: [{ assetId, propertyId, startDate, endDate }],
    pageParam: nextToken,
    signal,
  }: QueryFunctionContext<
    ReturnType<AssetPropertyValueHistoryCacheKeyFactory['create']>
  >) => {
    invariant(
      isAssetId(assetId),
      'Expected assetId to be defined as required by the enabled flag.'
    );
    invariant(
      isPropertyId(propertyId),
      'Expected propertyId to be defined as required by the enabled flag.'
    );
    invariant(
      isStartDate(startDate),
      'Expected startDate to be defined as required by the enabled flag.'
    );
    invariant(
      isEndDate(endDate),
      'Expected endDate to be defined as required by the enabled flag.'
    );

    const request = new GetGetAssetPropertyValueHistoryRequest({
      assetId,
      propertyId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      // @ts-expect-error upgrade issue
      nextToken,
      client,
      signal,
    });

    const response = await request.send();

    return response;
  };
};
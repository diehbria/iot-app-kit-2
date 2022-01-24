import { newSpecPage } from '@stencil/core/testing';
import { MinimalLiveViewport } from '@synchro-charts/core';
import flushPromises from 'flush-promises';
import { registerDataSource, initialize, SiteWiseDataStreamQuery } from '@iot-app-kit/core';
import { IotConnector } from './iot-connector';
import { createMockSource } from '../../testing/createMockSource';
import { update } from '../../testing/update';
import { CustomHTMLElement } from '../../testing/types';
import { DATA_STREAM, DATA_STREAM_2 } from '../../testing/mockWidgetProperties';
import { toSiteWiseAssetProperty } from '../../testing/dataStreamId';
import { Components } from '../../components';

const viewport: MinimalLiveViewport = {
  duration: 1000,
};

const connectorSpecPage = async (propOverrides: Partial<Components.IotConnector> = {}) => {
  /** Initialize data source and register mock data source */
  const appKit = initialize({ registerDataSources: false });
  registerDataSource(appKit, createMockSource([DATA_STREAM, DATA_STREAM_2]));

  const page = await newSpecPage({
    components: [IotConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const connector = page.doc.createElement('iot-connector') as CustomHTMLElement<Components.IotConnector>;
  const props: Partial<Components.IotConnector> = {
    appKit,
    queries: [
      {
        source: 'test-mock',
        assets: [],
      } as SiteWiseDataStreamQuery,
    ], // static casting because of legacy sw
    request: { viewport, settings: { fetchMostRecentBeforeEnd: true } },
    ...propOverrides,
  };
  update(connector, props);
  page.body.appendChild(connector);

  await page.waitForChanges();

  return { page, connector };
};

it('renders', async () => {
  const renderFunc = jest.fn();
  await connectorSpecPage({ renderFunc });
  await flushPromises();
  expect(renderFunc).toBeCalledTimes(1);
  expect(renderFunc).toBeCalledWith({ dataStreams: [] });
});

it('provides data streams', async () => {
  const renderFunc = jest.fn();
  const { assetId: assetId_1, propertyId: propertyId_1 } = toSiteWiseAssetProperty(DATA_STREAM.id);
  const { assetId: assetId_2, propertyId: propertyId_2 } = toSiteWiseAssetProperty(DATA_STREAM_2.id);

  await connectorSpecPage({
    renderFunc,
    queries: [
      {
        source: 'test-mock',
        assets: [{ assetId: assetId_1, properties: [{ propertyId: propertyId_1 }] }],
      } as SiteWiseDataStreamQuery,
      {
        source: 'test-mock',
        assets: [{ assetId: assetId_2, properties: [{ propertyId: propertyId_2 }] }],
      } as SiteWiseDataStreamQuery,
    ],
  });

  await flushPromises();

  expect(renderFunc).lastCalledWith({
    dataStreams: [
      expect.objectContaining({
        id: DATA_STREAM.id,
      }),
      expect.objectContaining({
        id: DATA_STREAM_2.id,
      }),
    ],
  });
});

it('updates with new queries', async () => {
  const { assetId: assetId_1, propertyId: propertyId_1 } = toSiteWiseAssetProperty(DATA_STREAM.id);
  const { assetId: assetId_2, propertyId: propertyId_2 } = toSiteWiseAssetProperty(DATA_STREAM_2.id);

  const renderFunc = jest.fn();
  const { connector, page } = await connectorSpecPage({
    renderFunc,
    queries: [
      {
        source: 'test-mock',
        assets: [],
      } as SiteWiseDataStreamQuery,
    ],
  });
  await flushPromises();

  connector.queries = [
    {
      source: 'test-mock',
      assets: [{ assetId: assetId_1, properties: [{ propertyId: propertyId_1 }] }],
    } as SiteWiseDataStreamQuery,
    {
      source: 'test-mock',
      assets: [{ assetId: assetId_2, properties: [{ propertyId: propertyId_2 }] }],
    } as SiteWiseDataStreamQuery,
  ];

  await page.waitForChanges();
  await flushPromises();

  expect(renderFunc).lastCalledWith({
    dataStreams: [
      expect.objectContaining({
        id: DATA_STREAM.id,
      }),
      expect.objectContaining({
        id: DATA_STREAM_2.id,
      }),
    ],
  });
});

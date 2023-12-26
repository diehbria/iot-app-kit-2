import { disableAdd } from '~/components/queryEditor/iotSiteWiseQueryEditor/footer/disableAdd';

describe('testing disableAdd', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should return true if no selected widgets', () => {
    expect(disableAdd([], 0)).toBeTruthy();
  });

  it('should return true if no results', () => {
    expect(
      disableAdd([{ id: '1', type: 'status', x: 0, y: 0, z: 0, properties: {}, height: 500, width: 800 }], 0)
    ).toBeTruthy();
  });

  it('should return true if status is selected and has a assets already added', () => {
    expect(
      disableAdd(
        [
          {
            id: '1',
            type: 'status',
            x: 0,
            y: 0,
            z: 0,
            properties: { queryConfig: { query: {} } },
            height: 500,
            width: 800,
          },
        ],
        10
      )
    ).toBeTruthy();
  });
  it('should return false if status is selected and has NO assets already added', () => {
    expect(
      disableAdd(
        [
          {
            id: '1',
            type: 'status',
            x: 0,
            y: 0,
            z: 0,
            properties: { queryConfig: { query: undefined } },
            height: 500,
            width: 800,
          },
        ],
        10
      )
    ).toBeFalsy();
  });

  it('should return false if x-y-plot is selected and has assets already added', () => {
    expect(
      disableAdd(
        [
          {
            id: '1',
            type: 'x-y-plot',
            x: 0,
            y: 0,
            z: 0,
            properties: { queryConfig: { query: undefined } },
            height: 500,
            width: 800,
          },
        ],
        10
      )
    ).toBeFalsy();
  });
});
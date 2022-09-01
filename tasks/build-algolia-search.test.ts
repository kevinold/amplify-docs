import { pathmap } from './build-algolia-search.mjs';

test('generates a pathmap', () => {
  expect(pathmap).toMatchSnapshot();
});

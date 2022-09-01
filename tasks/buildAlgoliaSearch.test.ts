import { buildPlatformPathsFromDirectory } from './buildAlgoliaSearch';
test('buildPlatformPathsFromDirectory should contain the correct path objects', () => {
  const platformPathsWithMetadata = buildPlatformPathsFromDirectory();
  expect(Object.keys(platformPathsWithMetadata)).toContain(
    '/lib/devpreview/getting-started/q/platform/ios'
  );
});

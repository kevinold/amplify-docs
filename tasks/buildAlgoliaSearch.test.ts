import amplifyDocsDirectory from '../src/directory/directory.js';
import { buildPlatformPathsFromDirectory } from './buildAlgoliaSearch';

test('buildPlatformPathsFromDirectory should contain the correct path objects', () => {
  const platformPathsWithMetadata = buildPlatformPathsFromDirectory(
    amplifyDocsDirectory
  );
  expect(Object.keys(platformPathsWithMetadata)).toContain('lib');
  // expect(Object.keys(platformPathsWithMetadata)).toContain(
  //   '/lib/devpreview/getting-started/q/platform/ios'
  // );
});

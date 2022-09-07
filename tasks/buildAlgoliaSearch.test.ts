import amplifyDocsDirectory from '../src/directory/directory.js';
import { buildPlatformPathsFromDirectory } from './buildAlgoliaSearch';

test('buildPlatformPathsFromDirectory should contain the correct path objects', () => {
  const platformPathsWithMetadata = buildPlatformPathsFromDirectory(
    amplifyDocsDirectory
  );
  //expect(Object.keys(platformPathsWithMetadata)).toContain('lib');
  expect(
    platformPathsWithMetadata['lib']['devpreview'][
      '/lib/devpreview/getting-started/q/platform/ios'
    ]
  ).toContain({
    page: '/lib/devpreview/getting-started/q/platform/[platform]',
    subcategory: 'New! Amplify Mobile (Developer Preview)',
    category: 'Amplify Libraries',
    title: 'Getting started'
  });
  expect(platformPathsWithMetadata).toContain({
    '/lib/devpreview/getting-started/q/platform/ios': {
      page: '/lib/devpreview/getting-started/q/platform/[platform]',
      subcategory: 'New! Amplify Mobile (Developer Preview)',
      category: 'Amplify Libraries',
      title: 'Getting started'
    }
  });
});

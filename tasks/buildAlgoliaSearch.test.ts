import amplifyDocsDirectory from '../src/directory/directory.js';
import {
  buildPlatformPathsFromDirectory,
  platformTitleToCategory,
  transformTitleToSubcategory
} from './buildAlgoliaSearch';

let platformPathsWithMetadata;
describe('build algolia search', () => {
  beforeEach(() => {
    platformPathsWithMetadata = buildPlatformPathsFromDirectory(
      amplifyDocsDirectory
    );
  });
  test('should transform platform product root title to category', () => {
    const actual = platformTitleToCategory(amplifyDocsDirectory['lib']);
    expect(actual).toHaveProperty('category');
    expect(actual).not.toHaveProperty('title');
  });
  test('should transform title to subcategory', () => {
    const actual = transformTitleToSubcategory({ title: 'test' });
    expect(actual).toHaveProperty('subcategory');
    expect(actual).not.toHaveProperty('title');
  });
  test('buildPlatformPathsFromDirectory should contain the correct path objects', () => {
    // expect(
    //   platformPathsWithMetadata['lib']['devpreview'][
    //     '/lib/devpreview/getting-started/q/platform/ios'
    //   ]
    // ).toContain({
    expect(platformPathsWithMetadata).toContain({
      page: '/lib/devpreview/getting-started/q/platform/[platform]',
      subcategory: 'New! Amplify Mobile (Developer Preview)',
      category: 'Amplify Libraries',
      title: 'Getting started'
    });
    // expect(platformPathsWithMetadata).toContain({
    //   '/lib/devpreview/getting-started/q/platform/ios': {
    //     page: '/lib/devpreview/getting-started/q/platform/[platform]',
    //     subcategory: 'New! Amplify Mobile (Developer Preview)',
    //     category: 'Amplify Libraries',
    //     title: 'Getting started'
    //   }
    // });
  });
});

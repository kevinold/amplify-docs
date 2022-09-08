import {
  compose,
  get,
  head,
  mapValues,
  merge,
  over,
  overArgs,
  pick,
  pipe,
  set,
  spread,
  tap,
  transform,
  values,
  __
} from 'lodash/fp';
import { visit } from 'unist-util-visit';
//import amplifyDocsDirectory from '../src/directory/directory.js';
// flatmap

export const converge = overArgs(compose, [spread, over]);
const debug = tap(console.log);

export const transformTitleToSubcategory = pipe(
  get('title'),
  set('subcategory', __, {})
);

export const transformPlatformCategoryItems = pipe(
  get('items'),
  transform((r: {}, v: { route: string; title: string }) => {
    const filters = get('filters', v);
    filters?.forEach((f) => {
      r[`${v.route}/q/platform/${f}`] = {
        title: v.title,
        page: `${v.route}/q/platform/[platform]`
      };
    });
  }, {})
);

export const transformPlatformCategory = transform((r: {}, v) => {
  console.log('v: ', v);
  //console.log('category: ', v.category);

  //console.log('category: ', v.category);
  // filters?.forEach((f) => {
  //   r[`${v.route}/q/platform/${f}`] = {
  //     title: v.title,
  //     page: `${v.route}/q/platform/[platform]`
  //   };
  // });
}, {});

const processPlatformCategories = pipe(
  //debug,
  get('items'),
  mapValues(
    pipe(
      //debug,
      converge(merge, [
        transformTitleToSubcategory,
        transformPlatformCategoryItems
      ])
    )
  )
  //flatMap((v, k) => console.log('key:', v))
  //debug
  //mapKeys
  //get('title')
);
export const platformTitleToCategory = pipe(
  //debug,
  pick('productRoot.title'),
  values,
  head,
  get('title'),
  set('category', __, {})
);
const processPlatform = pipe(
  //debug,
  converge(merge, [platformTitleToCategory, processPlatformCategories]),
  transformPlatformCategory
  //mapValues(identity)
);

export const buildPlatformPathsFromDirectory = pipe(
  mapValues(processPlatform)
  //forEach((v, k) => console.log('v: ', v, ' k: ', k))
  //get('cli'),
  //get('category')
  //debug
  //mapKeys(identity)
  //map((v, k) => console.log('v: ', v, ' k: ', k))
  //map((v, k) => console.log('v: ', v, ' k: ', k))
  //values
  //identity
);

/*
{
  lib: {
    productRoot: {
      title: 'Amplify Libraries',
      route: '/lib'
    },
    items: {
      devpreview: {
        title: 'New! Amplify Mobile (Developer Preview)',
        items: [
          {
            title: 'Getting started',
            route: '/lib/devpreview/getting-started',
            filters: ['ios', 'android']
          }
        ]
      },
    }
  }
}

{
  '/lib/devpreview/getting-started/q/platform/ios': {
    page: '/lib/devpreview/getting-started/q/platform/[platform]',
    subcategory: 'New! Amplify Mobile (Developer Preview)',
    category: 'Amplify Libraries',
    title: 'Getting started'
  }
};
*/

// custom utils functions for use with remark
const flattenNode = (
  node: any,
  textTypes?: ['text', 'emphasis', 'strong', 'inlineCode']
) => {
  const p: string[] = [];
  visit(node, (node) => {
    if (!textTypes?.includes(node.type)) return;
    p.push(node.value);
  });

  return p.join(``);
};

export function makeSearchable() {
  return (
    tree: any,
    file: {
      data: { heading: string | null; depth: number | null; text: string }[];
    }
  ) => {
    file.data = [];
    let heading: string | null = null;
    let depth: number | null = null;

    visit(
      tree,
      ({ type }) => {
        return ['heading', 'paragraph'].includes(type);
      },
      (node) => {
        if (node.type === 'heading') {
          heading = flattenNode(node);
          depth = node.depth;
          return;
        }

        file.data.push({
          heading,
          depth,
          text: flattenNode(node)
        });
      }
    );
  };
}

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
  spread,
  tap,
  transform,
  values
} from 'lodash/fp';
import { visit } from 'unist-util-visit';
//import amplifyDocsDirectory from '../src/directory/directory.js';
// flatmap

export const converge = overArgs(compose, [spread, over]);
const debug = tap(console.log);

const processPlatformCategories = pipe(
  get('items'),
  mapValues(
    pipe(
      //debug,
      converge(merge, [
        pick('title'),
        pipe(
          get('items'),
          transform((r, v, k) => {
            //console.log('v: ', v);
            const filters = get('filters', v);
            //console.log('filters: ', filters);
            filters?.forEach((f) => {
              r[f] = {
                key: `${v.route}/q/platform/${f}`,
                page: `${v.route}/q/platform/[platform]`
              };
            });
            //r[k] = v;
          }, {})
        )
      ])
    )
  )
  //debug
);
const platformTitleToCategory = pipe(
  pick('productRoot.title'),
  values,
  head,
  get('title'),
  (t) => {
    return { category: t };
  }
);
const processPlatform = pipe(
  converge(merge, [platformTitleToCategory, processPlatformCategories])
  //debug
);

export const buildPlatformPathsFromDirectory = pipe(
  mapValues(processPlatform)
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

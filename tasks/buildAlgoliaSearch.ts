//import {
//compose,
//get,
//head,
//identity,
//mapValues,
//merge,
//over,
//overArgs,
//pick,
//pipe,
//set,
//spread,
//tap,
//transform,
//values,
//__
//} from 'lodash/fp';
import fp from 'lodash/fp';
import { visit } from 'unist-util-visit';
//import amplifyDocsDirectory from '../src/directory/directory.js';
// flatmap

export const converge = fp.overArgs(fp.compose, [fp.spread, fp.over]);
const debug = fp.tap(console.log);

// per https://github.com/lodash/lodash/wiki/FP-Guide#convert
// @ts-ignore
export const mapWithKey = fp.map.convert({ cap: false });
export const mapValuesWithKey = fp.mapValues.convert({ cap: false });

export const transformTitleToSubcategory = fp.pipe(
  fp.get('title'),
  fp.set('subcategory', fp.__, {})
);

export const transformPlatformCategoryItems = fp.pipe(
  fp.get('items'),
  fp.transform((r: {}, v: { route: string; title: string }) => {
    const filters = fp.get('filters', v);
    filters?.forEach((f) => {
      r[`${v.route}/q/platform/${f}`] = {
        title: v.title,
        page: `${v.route}/q/platform/[platform]`
      };
    });
  }, {})
  //debug
);

const mergeSubcategoryWithCategoryItems = ({ subcategory }, categoryItems) =>
  fp.mapValues((v) => {
    return {
      subcategory,
      ...v
    };
  }, categoryItems);

const processPlatformCategories = fp.pipe(
  //debug,
  fp.get('items'),
  //debug,
  fp.mapValues(
    fp.pipe(
      converge(mergeSubcategoryWithCategoryItems, [
        transformTitleToSubcategory,
        transformPlatformCategoryItems
      ])
      //debug
    )
  )
  //debug
);
export const transformPlatformCategory = fp.transform((r: {}, v) => {
  console.log('v: ', v);

  const category = v.category;
  console.log('category: ', category);

  const subcats = fp.unset('category', v);
  console.log('subcats', subcats);

  const nosubcat = fp.mapValues(debug, subcats);
  console.log('nosubcats', nosubcat);

  // filters?.forEach((f) => {
  //   r[`${v.route}/q/platform/${f}`] = {
  //     title: v.title,
  //     page: `${v.route}/q/platform/[platform]`
  //   };
  // });
}, {});

export const platformTitleToCategory = fp.pipe(
  //debug,
  fp.pick('productRoot.title'),
  fp.values,
  fp.head,
  fp.get('title'),
  fp.set('category', fp.__, {})
);

const mergeCategoryWithCategoryItems = ({ category }, categoryItems) =>
  fp.mapValues((i) => {
    return fp.mapValues((s) => {
      return { category, ...s };
    }, i);
  }, categoryItems);

const processPlatform = fp.pipe(
  //debug,
  converge(mergeCategoryWithCategoryItems, [
    platformTitleToCategory,
    processPlatformCategories
  ])
);

export const buildPlatformPathsFromDirectory = fp.pipe(
  fp.mapValues(processPlatform)
  //transformPlatformCategory
  //fp.forEach((v, k) => console.log('v: ', v, ' k: ', k))
  //fp.get('cli'),
  //fp.get('category')
  //debug
  //mapKeys(fp.identity)
  //map((v, k) => console.log('v: ', v, ' k: ', k))
  //map((v, k) => console.log('v: ', v, ' k: ', k))
  //fp.values
  //fp.identity
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
            title: 'fp.getting started',
            route: '/lib/devpreview/fp.getting-started',
            filters: ['ios', 'android']
          }
        ]
      },
    }
  }
}

{
  '/lib/devpreview/fp.getting-started/q/platform/ios': {
    page: '/lib/devpreview/fp.getting-started/q/platform/[platform]',
    subcategory: 'New! Amplify Mobile (Developer Preview)',
    category: 'Amplify Libraries',
    title: 'fp.getting started'
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
        return ['fp.heading', 'paragraph'].includes(type);
      },
      (node) => {
        if (node.type === 'fp.heading') {
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

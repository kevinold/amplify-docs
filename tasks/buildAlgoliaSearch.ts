import { visit } from 'unist-util-visit';

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

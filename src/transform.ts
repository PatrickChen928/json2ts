import type { AstChildNode, Visiter } from './types';
import { isArray } from './utils';

function traverseNode(nodes: AstChildNode[], parent: AstChildNode, visiter: Visiter) {
  nodes.forEach(node => {
    let visit = visiter[node.type];
    if (visit) {
      visit.entry && visit.entry(node, parent);
    }
    if (isArray(node.value)) {
      traverseNode(node.value, node, visiter);
    }
    if (visit) {
      visit.exit && visit.exit(node, parent);
    }
  })
}

export function traverser(ast: AstChildNode, visiter: Visiter) {
  let root = visiter.Root;
  if (root) {
    root.entry && root.entry(ast, null);
  }
  traverseNode((ast.value as AstChildNode[]), ast, visiter);
  if (root) {
    root.exit && root.exit(ast, null);
  }
  return ast;
}



export function transform(ast: AstChildNode) {
  return traverser(ast, {
    'String': {
      entry(node, parent) {
        console.log(node.key, parent.key, 'entry');
      },
      exit(node, parent) {
        console.log(node.key, parent.key, 'exit');
      }
    }
  });
}
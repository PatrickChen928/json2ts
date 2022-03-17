import type { AstChildNode, Visiter } from './types';
import { 
  ARRAY_ITEM, 
  ARRAY_TYPE, 
  STRING_TYPE, 
  NUMBER_TYPE, 
  OBJECT_TYPE 
} from './contant';
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
  traverser(ast, {
    [STRING_TYPE]: {
      entry(node, parent) {
        if (node.key === ARRAY_ITEM) {
          parent.typeValue = parent.typeValue || [];
          (parent.typeValue as Array<string | Object>).push(node.type);
        } else {
          parent.typeValue = parent.typeValue || {};
          parent.typeValue[node.key] = node.type;
        }
      }
    },
    [NUMBER_TYPE]: {
      entry(node, parent) {
        if (node.key === ARRAY_ITEM) {
          parent.typeValue = parent.typeValue || [];
          (parent.typeValue as Array<string | Object>).push(node.type);
        } else {
          parent.typeValue = parent.typeValue || {};
          parent.typeValue[node.key] = node.type;
        }
      }
    },
    [OBJECT_TYPE]: {
      entry(node, parent) {
        if (node.key === ARRAY_ITEM) {
          parent.typeValue = parent.typeValue || [];
          node.typeValue = {};
          (parent.typeValue as Array<string | Object>).push(node.typeValue);
        } else {
          parent.typeValue = parent.typeValue || {};
          parent.typeValue[node.key] = node.typeValue = {};
        }
      }
    },
    [ARRAY_TYPE]: {
      entry(node, parent) {
        if (node.key === ARRAY_ITEM) {
          parent.typeValue = parent.typeValue || [];
          node.typeValue = [];
          (parent.typeValue as Array<string | Object>).push(node.typeValue);
        } else {
          parent.typeValue = parent.typeValue || {};
          parent.typeValue[node.key] = node.typeValue = [];
        }
      }
    }
  });
  return ast;
}
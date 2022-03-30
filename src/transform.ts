import type { AstChildNode, Visiter, CompileOptions } from './types';
import { 
  ARRAY_ITEM, 
  ARRAY_TYPE, 
  STRING_TYPE, 
  NUMBER_TYPE, 
  OBJECT_TYPE, 
  NULL_TYPE,
  BOOLEAN_TYPE,
  UNDEFINED_TYPE
} from './contant';
import { isArray } from './utils';

function normalEntryHandle(node: AstChildNode, parent: AstChildNode) {
  if (node.key === ARRAY_ITEM) {
    parent.typeValue = parent.typeValue || [];
    (parent.typeValue as Array<string | Object>).push(node.type);
  } else {
    parent.typeValue = parent.typeValue || {};
    parent.typeValue[node.key] = node.type;
  }
}

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

export function transform(ast: AstChildNode, options?: CompileOptions) {
  traverser(ast, {
    [STRING_TYPE]: {
      entry(node, parent) {
        normalEntryHandle(node, parent);
      }
    },
    [NUMBER_TYPE]: {
      entry(node, parent) {
        normalEntryHandle(node, parent);
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
    },
    [NULL_TYPE]: {
      entry(node, parent) {
        normalEntryHandle(node, parent);
      }
    },
    [BOOLEAN_TYPE]: {
      entry(node, parent) {
        normalEntryHandle(node, parent);
      }
    },
    [UNDEFINED_TYPE]: {
      entry(node, parent) {
        normalEntryHandle(node, parent);
      }
    }
  });
  return ast;
}
import type { TransformNodeType, Visiter, CompileOptions } from './types';
import { 
  ARRAY_ITEM, 
  ARRAY_TYPE, 
  STRING_TYPE, 
  NUMBER_TYPE, 
  OBJECT_TYPE, 
  NULL_TYPE,
  BOOLEAN_TYPE,
  UNDEFINED_TYPE,
  COMMENT_TYPE,
  LAST_COMMENT
} from './contant';
import { isArray } from './utils';


let cache = resetCache();

function resetCache() {
  return {
    comments: {},
    // 对象的个数
    i: 0,
    lastI: null,
    lastNode: null,
    nextComment: []
  }
}

function normalEntryHandle(node: TransformNodeType, parent: TransformNodeType) {
  node.i = cache.i;
  if (node.key === ARRAY_ITEM) {
    // 数组的item的注释没什么意义，清空
    cache.nextComment = [];
    parent.typeValue = parent.typeValue || [];
    (parent.typeValue as Array<string | Object>).push(node.type);
  } else {
    parent.typeValue = parent.typeValue || {};
    parent.typeValue[node.key] = node.type;
    handleComment(node);
  }
}

function handleComment(node: TransformNodeType) {
  cache.lastNode = node;
  if (cache.nextComment.length) {
    const comments = cache.comments;
    const key = node.key + cache.i;
    comments[key] = comments[key] || [];
    comments[key] = comments[key].concat(cache.nextComment);
    cache.nextComment = [];
  }
}

function traverseNode(nodes: TransformNodeType[], parent: TransformNodeType, visiter: Visiter) {
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

export function traverser(ast: TransformNodeType, visiter: Visiter) {
  let root = visiter.Root;
  if (root) {
    root.entry && root.entry(ast, null);
  }
  traverseNode((ast.value as TransformNodeType[]), ast, visiter);
  if (root) {
    root.exit && root.exit(ast, null);
  }
  return ast;
}

export function transform(ast: TransformNodeType, options?: CompileOptions) {
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
        node.i = cache.i;
        cache.i++;
        if (node.key === ARRAY_ITEM) {
          // 数组的item的注释没什么意义，清空
          cache.nextComment = [];
          parent.typeValue = parent.typeValue || [];
          node.typeValue = {};
          (parent.typeValue as Array<string | Object>).push(node.typeValue);
        } else {
          parent.typeValue = parent.typeValue || {};
          parent.typeValue[node.key] = node.typeValue = {};
          handleComment(node);
        }
      },
      exit(node) {
        cache.lastNode = node;
      }
    },
    [ARRAY_TYPE]: {
      entry(node, parent) {
        node.i = cache.i;
        if (node.key === ARRAY_ITEM) {
          // 数组的item的注释没什么意义，清空
          cache.nextComment = [];
          parent.typeValue = parent.typeValue || [];
          node.typeValue = [];
          (parent.typeValue as Array<string | Object>).push(node.typeValue);
        } else {
          parent.typeValue = parent.typeValue || {};
          parent.typeValue[node.key] = node.typeValue = [];
          handleComment(node);
        }
      },
      exit(node) {
        cache.lastNode = node;
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
    },
    [COMMENT_TYPE]: {
      entry(node) {
        if (node.key === LAST_COMMENT) {
          const key = cache.lastNode.key + cache.lastNode.i;
          cache.comments[key] = cache.comments[key] || [];
          cache.comments[key].push(node.value);
        } else {
          cache.nextComment.push(node.value);
        }
      }
    }
  });
  ast.comments = cache.comments;
  cache = resetCache();
  console.log(ast.comments)
  return ast;
}

import { hash, verify } from 'argon2'

export async function hashPasswordArgon2(password: string) {
  return await hash(password);
}

export async function verifyPasswordArgon2(password: string, storedHash: string) {
  return await verify(storedHash, password);
}

/**
 * 扁平数据转树结构
 * @param {Array} flatData - 扁平数据数组
 * @param {Object} [options] - 配置项
 * @param {string} [options.idKey='id'] - 节点唯一标识字段名
 * @param {string} [options.parentIdKey='parentId'] - 父节点标识字段名
 * @param {string} [options.childrenKey='children'] - 子节点数组字段名
 * @param {string|number} [options.rootParentValue=null] - 根节点的 parentId 值（默认 null）
 * @returns {Array} 转换后的树结构数组
 */

interface FlatToTreeOptions {
  idKey?: string;
  parentIdKey?: string;
  childrenKey?: string;
  rootParentValue?: string | number;
}
export function flatToTree<T>(flatData: T[], options = {} as FlatToTreeOptions) {
  // 默认配置
  const {
    idKey = 'id',
    parentIdKey = 'parent_id',
    childrenKey = 'children',
    rootParentValue = null
  } = options;

  // 校验输入数据
  if (!Array.isArray(flatData)) {
    throw new Error('输入必须是数组');
  }

  // 1. 构建节点映射表（id -> 节点），方便快速查找父节点
  const nodeMap = new Map();
  flatData.forEach(node => {
    // 给每个节点初始化子节点数组（避免后续判断 undefined）
    node[childrenKey] = node[childrenKey] || [];
    nodeMap.set(node[idKey], node);
  });

  // 2. 遍历所有节点，将子节点挂载到对应的父节点下
  const tree = [] as T[];
  flatData.forEach(node => {
    const parentId = node[parentIdKey];
    // 查找父节点
    const parentNode = nodeMap.get(parentId);

    if (parentNode) {
      // 有父节点：挂载到父节点的子节点数组中
      parentNode[childrenKey].push(node);
    } else {
      // 无父节点（或父节点为根节点值）：作为根节点加入树
      if (parentId === rootParentValue) {
        tree.push(node);
      }
    }
  });

  return tree;
}


/**
 * 生成符合 RFC 4122 标准的 UUID v4
 * 特点：使用安全随机数、兼容浏览器和 Node.js、严格遵循格式规范
 * @returns {string} 36位 UUID v4 字符串（如：f47ac10b-58cc-4372-a567-0e02b2c3d479）
 */
export function generateUUID() {
  // 检测环境中的安全随机数生成器
  let cryptoModule;
  if (typeof window !== 'undefined' && window.crypto) {
    // 浏览器环境：使用 Web Crypto API
    cryptoModule = window.crypto;
  } else if (typeof global !== 'undefined' && global.crypto) {
    // Node.js 环境（v15+ 内置 crypto 模块）
    cryptoModule = global.crypto;
  } else if (typeof require === 'function') {
    // 兼容旧版 Node.js（显式引入 crypto 模块）
    try {
      cryptoModule = require('crypto');
    } catch (e) {
      // 忽略引入错误，后续降级处理
    }
  }

  // 生成随机字节的函数（优先安全随机数，降级为 Math.random）
  const getRandomBytes = (length) => {
    const bytes = new Uint8Array(length);
    if (cryptoModule && typeof cryptoModule.getRandomValues === 'function') {
      // 安全随机数（推荐，适用于加密/高安全性场景）
      cryptoModule.getRandomValues(bytes);
    } else if (cryptoModule && typeof cryptoModule.randomBytes === 'function') {
      // Node.js crypto 模块兼容
      const nodeBytes = cryptoModule.randomBytes(length);
      for (let i = 0; i < length; i++) {
        bytes[i] = nodeBytes[i];
      }
    } else {
      // 降级方案：使用 Math.random（随机性较差，不建议用于敏感场景）
      console.warn('未检测到安全随机数生成器，使用 Math.random 降级（安全性较低）');
      for (let i = 0; i < length; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
      }
    }
    return bytes;
  };

  // 生成 16 字节（128位）随机数据
  const bytes = getRandomBytes(16);

  // 按照 RFC 4122 规范设置版本和变体
  // - 版本号：第 6 字节的高 4 位设置为 0100（即 UUID v4）
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  // - 变体：第 8 字节的高 2 位设置为 10（RFC 4122 规范）
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  // 转换字节为十六进制字符串，并按格式拼接
  const hexDigits = '0123456789abcdef';
  let uuid = '';
  for (let i = 0; i < 16; i++) {
    // 每个字节转换为两位十六进制
    const value = bytes[i];
    uuid += hexDigits[(value >>> 4) & 0x0f] + hexDigits[value & 0x0f];
  }

  return uuid;
}






/**
 * 16进制颜色字符串解析为颜色对象
 * @param color 颜色字符串
 * @returns IColorObj
 */
// eslint-disable-next-line import/prefer-default-export
import { IColorObj } from '@/components/type';

export const hex2rgb = (color: string) => {
    let hex = color.slice(1);
    if (hex.length === 3) {
        hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }
    if (hex.length === 8) {
        hex = hex.slice(0, 6);
    }
    const bigint = parseInt(hex, 16); // 将16进制转为10进制整数
    return {
        // eslint-disable-next-line no-bitwise
        r: (bigint >> 16) & 255,
        // eslint-disable-next-line no-bitwise
        g: (bigint >> 8) & 255,
        // eslint-disable-next-line no-bitwise
        b: bigint & 255,
    } as IColorObj;
};
/**
 * rgba颜色字符串解析为颜色对象
 * @param color 颜色字符串
 * @returns IColorObj
 */
export const parseRgb = (color: string) => {
    const arr = color.match(/(\d(\.\d+)?)+/g) || [];
    const res = arr.map((s: string) => parseInt(s, 10));
    return {
        r: res[0],
        g: res[1],
        b: res[2],
        a: parseFloat(arr[3]),
    } as IColorObj;
};

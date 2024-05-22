<template>
    <div ref="menu" id="menu" class="menu-box"
         :style="`left: ${position.x}px; top: ${position.y}px; min-width:${style.minWidth}px;`"
         @contextmenu="(e) => e.preventDefault()"
    >
        <div class="menu-content">
            <template v-for="(item, index) in items">
                <div
                    class="menu-items"
                    ref="menuItem"
                    :class="[item.disabled && 'disable', item.hr && 'hr']"
                    @click="onNodeCilck(item)"
                    @mouseenter="($event)=>onMouseEnter($event,item,index)"
                    :key="index+'_item'"
                >
                    <div class="menu-icon" v-if="hasIcon">
                        <i :class="item.icon" v-if="item.icon"></i>
                    </div>
                    <span class="menu-label">{{ item.label }}</span>
                </div>
                <div
                    class="menu-items"
                    :class="[item.disabled && 'disable', item.hr && 'hr']"
                    @click="onNodeCilck(item)"
                    @mouseenter="($event)=>onMouseEnter($event,item,index)"
                    :key="index+'_subitem'"
                    v-if="item.children"
                >
                    <span class="menu-icon" :class="item.icon && 'show'">
                        <img :src="item.icon" alt="icon">
                    </span>
                    <span class="menu-label">{{ item.label }}</span>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import { Item, IColorObj as colorObject } from '@/components/type';
import {hex2rgb, parseRgb} from '@/utils/color';

export default class Menu extends Vue {
    items: Item[] = [];

    position = {
        x: 0,
        y: 0,
    }

    style = {
        minWidth: 100,
        width: 0,
        height: 0,
        color: '',
    }

    activeSubmenuItem = {
        index: null,
        instance: null,
    }

    get hasIcon() {
        return this.items.some((item: Item) => item.icon);
    }

    initStyle() {
        // 为menu-items添加样式变量
        const menuItemList = [];
        const menuItems = document.getElementsByClassName('menu-items');
        menuItemList.push(...menuItems);

        const color = this.style.color;
        const {r, g, b} = this.parseColor(color);

        menuItemList.forEach((item: any) => {
            item.style.setProperty('--rgb', `${r},${g},${b}`);
        });
    }

    // 如果是16进制颜色值转为rgb对象，如果是rbg格式转为rgb对象
    // 目的进行颜色计算
    parseColor(color: string) {
        let IColorObj: colorObject = {
            r: 0,
            g: 0,
            b: 0,
        };
        if (color.includes('#')) {
            IColorObj = hex2rgb(color);
        } else if (color.includes('rgb') || color.includes('rgba')) {
            IColorObj = parseRgb(color);
        }
        return IColorObj;
    }

    onNodeCilck(item: Item) {
        if (item && !item.disabled && typeof item.onclick === 'function') {
            item.onclick();
        }
    }

    onMouseEnter(e: any, item: Item, index: number) {
        const activeSubmenuItem = this.activeSubmenuItem;
        if (activeSubmenuItem.instance !== null) {
            this.destroySubmenu();
        }

        if (!item.children) return;

        // 创建子菜单组件并挂载到页面上
        const itemClientRect = e.target.getBoundingClientRect();
        const SubmenuItemConstructor = Vue.component('contextMenu');
        const instance: any = new SubmenuItemConstructor();
        (activeSubmenuItem.index as unknown as number) = index;
        activeSubmenuItem.instance = instance;

        instance.position = {
            x: itemClientRect.left + itemClientRect.width,
            y: itemClientRect.top,
        };
        instance.style = {
            minWidth: itemClientRect.width,
        };
        instance.items = item.children;
        instance.$mount();
        document.body.appendChild(instance.$el);
        this.initStyle();
    }

    // 移除上一个子菜单实例，保证只有一个实例
    destroySubmenu() {
        const instance: any = this.activeSubmenuItem.instance;
        if (!instance) return;
        instance.$destroy();
        document.body.removeChild(instance.$el);
        this.activeSubmenuItem.instance = null;
        this.activeSubmenuItem.index = null;
    }
}
</script>

<style lang="scss">
.menu-box {
  display: flex;
  flex-direction: column;
  background: rgba($color: #fff, $alpha: 0.7);
  padding: 7px 0;
  box-shadow: 0px 0px 5px 1px rgba(45, 45, 45, 0.1);
  z-index: 99;
  position: fixed;
  .menu-items {
    color: #000;
    font-size: 14px;
    line-height: 30px;
    padding-left: 15px;
    display: flex;

    $rgb: var(--rgb);
    &:hover {
        color: rgb($rgb);
        background-color: rgba($rgb, 0.1);
    }
    &.disable {
      color: #3333;
      &:hover {
        background: none;
      }
    }
    &.hr {
        border-bottom: 1px solid #ebeef5;
    }
  }
  .menu-icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    display: none;
    img {
      width: 100%;
      height: 100%;
    }
    &.show {
        display: block;
    }
  }
  .menu-item-expand-icon {
    font-size: 12px;
    position: absolute;
    right:15px;
    background-color: transparent;
    color: #000;
  }
  .item-submenu {
    // display: none;
    position: absolute;
    background: rgba($color: #fff, $alpha: 0.7);
    box-shadow: 0px 0px 5px 1px rgba(45, 45, 45, 0.1);
    z-index: 99;
    padding: 10px 0;
  }
}
</style>

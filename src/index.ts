import Vue from 'vue';
import { MenuInstance } from '@/components/type';
import Menu from './Menu.vue';

const MenuConstructor = Vue.component('contextMenu', Menu);

class ContextMenu {
    instance: any = null;

    constructor(options: MenuInstance) {
        this.instance = new MenuConstructor();
        this.instance.items = options.items;
        this.instance.position = {
            x: options.event && options.event.clientX || options.x || 0,
            y: options.event && options.event.clientY || options.y || 0,
        };
        this.instance.style = {
            minWidth: options.style && options.style.minWidth || 150,
            hr: options.style && options.style.hr, // 分割线
            width: options.style && options.style.width || 0,
            hight: options.style && options.style.height || 0,
            color: options.style && options.style.color || 'rgb(0, 140, 255)',
        };
        this.instance.disabled = options.disabled || false;
        // 挂载instance
        this.instance.$mount();
        // 把el添加到dom上
        document.body.appendChild(this.instance.$el);
        this.instance.initStyle();
        this.addListener();
    }

    addListener() {
        // 监听全局点击事件，目的让点击空白关闭菜单
        document.addEventListener('click', this.clickEvent);
    }

    removeListener() {
        document.removeEventListener('click', this.clickEvent);
    }

    clickEvent = (event: Event) => {
        const el: any = event.target;
        const menu: HTMLElement | null = document.getElementById('menu');
        if (el && menu && el.classList !== menu.classList) {
            this.destroy();
        }
    }

    destroy() {
        if (this.instance) {
            this.instance.destroySubmenu();
            this.removeListener();
            document.body.removeChild(this.instance.$el);
            this.instance = null;
        }
    }
}

export default {
    // 提供install方法供Vue.use安装插件
    install() {
        let instance: any = null;
        const ContextMenuProxy = function (options: any) {
            ContextMenuProxy.destroy();
            instance = new ContextMenu(options);
        };
        ContextMenuProxy.destroy = function () {
            if (instance) {
                instance.destroy();
                instance = null;
            }
        };
        Vue.prototype.$rightClick = ContextMenuProxy;
    },
};

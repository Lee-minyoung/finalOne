import {
  cloneVNode,
  computed,
  defineComponent,
  h,
  inject,
  ref,
  watch
} from "./chunk-IJV5NOMV.js";
import "./chunk-HKJ2B2AA.js";

// node_modules/@coreui/icons-vue/dist/index.es.js
var CIcon = defineComponent({
  name: "CIcon",
  props: {
    /**
     * Use `:icon="..."` instead of
     *
     * @deprecated since version 3.0
     */
    content: {
      type: [String, Array],
      default: void 0,
      required: false
    },
    /**
     * Use for replacing default CIcon component classes. Prop is overriding the 'size' prop.
     */
    customClassName: {
      type: [String, Array, Object],
      default: void 0,
      required: false
    },
    /**
     * Name of the icon placed in React object or SVG content.
     */
    icon: {
      type: [String, Array],
      default: void 0,
      required: false
    },
    /**
     * Use `icon="..."` instead of
     *
     * @deprecated since version 3.0
     */
    name: {
      type: String,
      default: void 0,
      required: false
    },
    /**
     * Size of the icon. Available sizes: 'sm', 'lg', 'xl', 'xxl', '3xl...9xl', 'custom', 'custom-size'.
     */
    size: {
      type: String,
      default: void 0,
      required: false,
      validator: (value) => {
        return [
          "custom",
          "custom-size",
          "sm",
          "lg",
          "xl",
          "xxl",
          "3xl",
          "4xl",
          "5xl",
          "6xl",
          "7xl",
          "8xl",
          "9xl"
        ].includes(value);
      }
    },
    /**
     * Title tag content.
     */
    title: {
      type: String,
      default: void 0,
      required: false
    },
    /**
     * If defined component will be rendered using 'use' tag.
     */
    use: {
      type: String,
      default: void 0,
      required: false
    }
  },
  setup(props, { attrs }) {
    const icons = inject("icons");
    const _icon = ref(props.icon || props.content || props.name);
    watch(() => props.icon, () => {
      _icon.value = props.icon;
    });
    const toCamelCase = (str) => {
      return str.replace(/([-_][a-z0-9])/gi, ($1) => {
        return $1.toUpperCase();
      }).replace(/-/gi, "");
    };
    const iconName = computed(() => _icon.value && typeof _icon.value === "string" ? _icon.value.includes("-") ? toCamelCase(_icon.value) : _icon.value : "");
    const titleCode = props.title ? `<title>${props.title}</title>` : "undefined";
    const code = computed(() => Array.isArray(_icon.value) ? _icon.value : typeof _icon.value === "string" && iconName.value && icons[iconName.value] ? icons[iconName.value] : "undefined");
    const iconCode = computed(() => Array.isArray(code.value) ? code.value[1] || code.value[0] : code.value);
    const scale = Array.isArray(code.value) && code.value.length > 1 ? code.value[0] : "64 64";
    const viewBox = attrs.viewBox || `0 0 ${scale}`;
    const size = () => {
      const addCustom = !props.size && (attrs.width || attrs.height);
      return props.size === "custom" || addCustom ? "custom-size" : props.size;
    };
    const classNames = (() => {
      return [props.customClassName || ["icon", { [`icon-${size()}`]: size() }], attrs.class];
    })();
    return () => props.use ? h("svg", {
      ...attrs,
      xmlns: "http://www.w3.org/2000/svg",
      class: classNames,
      role: "img"
    }, h("use", { href: props.use })) : h("svg", {
      ...attrs,
      xmlns: "http://www.w3.org/2000/svg",
      class: classNames,
      viewBox,
      innerHTML: `${titleCode}${iconCode.value}`,
      role: "img"
    });
  }
});
var CIconSvg = defineComponent({
  name: "CIconSvg",
  props: {
    /**
     * Use for replacing default CIconSvg component classes. Prop is overriding the 'size' prop.
     */
    customClassName: [String, Array, Object],
    /**
     * The height attribute defines the vertical length of an icon.
     */
    height: Number,
    /**
     * Size of the icon. Available sizes: 'sm', 'lg', 'xl', 'xxl', '3xl...9xl', 'custom', 'custom-size'.
     */
    size: {
      type: String,
      validator: (value) => {
        return [
          "custom",
          "custom-size",
          "sm",
          "lg",
          "xl",
          "xxl",
          "3xl",
          "4xl",
          "5xl",
          "6xl",
          "7xl",
          "8xl",
          "9xl"
        ].includes(value);
      }
    },
    /**
     * Title tag content.
     */
    title: String,
    /**
     * The width attribute defines the horizontal length of an icon.
     */
    width: Number
  },
  setup(props, { attrs, slots }) {
    return () => slots.default && slots.default().map((slot) => cloneVNode(slot, {
      "aria-hidden": true,
      class: [
        props.customClassName || [
          "icon",
          {
            [`icon-${props.size}`]: props.size,
            [`icon-custom-size`]: props.height || props.width
          },
          attrs.class
        ]
      ],
      height: props.height,
      focusable: "false",
      role: "img",
      width: props.width,
      ...attrs
    }));
  }
});
export {
  CIcon,
  CIconSvg,
  CIcon as default
};
//# sourceMappingURL=@coreui_icons-vue.js.map

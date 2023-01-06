<script setup>
import DemoEvent from "../../module/demo/event.vue"
</script>

### 事件模拟

<div class='py-2'>
  <DemoEvent />
</div>

### 鼠标事件(Mouse Events)

- `mousedown`、`mouseup`、 `click`、`dblclick`

- `mouseenter`、 `mousemove`、 `mouseleave`、 [`mouseout`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/mouseout_event)

- [contextmenu](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/contextmenu_event)

移动端的双击事件

在 [**Can I use**](https://caniuse.com/?search=dblclick) 中查询可知安卓设备是不支持这个

案例实践

1. 防止鼠标按下时的选择
2. 防止复制
3. 鼠标右击事件

### 触摸事件(Touch Events)

- `touchend` 对比 `touchcancel`

### 指针事件(Pointer Events)

- [PointerEvent 接口类型定义](https://github.com/microsoft/TypeScript/blob/4378441e0c286feae133c13059ba47f5dc7d5bfe/lib/lib.dom.d.ts#L11010)

::: details 点击查看类型定义

```ts
interface PointerEvent extends MouseEvent {
  readonly height: number
  readonly isPrimary: boolean
  readonly pointerId: number
  readonly pointerType: string
  readonly pressure: number
  readonly tangentialPressure: number
  readonly tiltX: number
  readonly tiltY: number
  readonly twist: number
  readonly width: number
  /** Available only in secure contexts. */
  getCoalescedEvents(): PointerEvent[]
  getPredictedEvents(): PointerEvent[]
}
```

:::

| 属性值           | 说明                                                                                     | 应用                           |
| ---------------- | ---------------------------------------------------------------------------------------- | ------------------------------ |
| `width`/`height` | 指针与屏幕接触面区域的 CSS 像素宽度/高度<br> 对于不支持的设备(比如鼠标)，这个值总是**1** | -                              |
| `pointerType`    | 指针的设备类型<br> 可能是: `"mouse"`,`"pen"`,`"touch"`                                   | 需要根据指针设备做差异化处理时 |

## 参考

- [TouchEvent - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/TouchEvent)
- [指针事件 - 现代 JavaScript 教程](https://zh.javascript.info/pointer-events)

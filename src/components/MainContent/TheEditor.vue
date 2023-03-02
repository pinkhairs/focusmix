<template>
  <div id="codex-editor"></div>
</template>

<script>
import { computed } from 'vue'
import EditorJS from "@editorjs/editorjs"
import Header from '@editorjs/header'
import List from '@editorjs/list'
import CodeTool from '@editorjs/code'
import Paragraph from '@editorjs/paragraph'
import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import Checklist from '@editorjs/checklist'
import Marker from '@editorjs/marker'
import InlineCode from '@editorjs/inline-code'
import { useStore } from '@/stores'

export default {
  data() {
    return {
      editor: null
    }
  },
  setup() {
    const store = useStore()
    const content = computed(() => store.content)
    const updateContent = store.updateContent
    return { store, content, updateContent }
  },
  watch: {
    content() {
      const blocks = this.content.length > 0 ? this.content : [{
        data: {text: 'Type here.'},
        id: "xGAIubcQNS",
        type: "paragraph"
      }]
      this.editor.render({blocks,
        time: Date.now(),
        version: "2.8.1"
      })
    }
  },
  methods: {
    myEditor() {
      this.editor = new EditorJS({
        holder: "codex-editor",
        data: {
          blocks: this.content,
          time: Date.now(),
          version: "2.8.1"
        },
        tools: {
          header: Header,
          list: List,
          paragraph: Paragraph,
          codeTool: CodeTool,
          embed: Embed,
          table: Table,
          checklist: Checklist,
          marker: Marker,
          inlineCode: InlineCode
        },
        onChange: (editor) => {
          editor.saver.save().then((data) => {
            const blocks = data.blocks
            this.updateContent(blocks)
          })
        }
      })
      return this.editor
    }
  },
  mounted() {
    this.myEditor()
  }
}
</script>
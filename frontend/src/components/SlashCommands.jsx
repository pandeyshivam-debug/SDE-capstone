import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import {
  Heading,
  List,
  Quote,
  Code,
  Hash,
  Type
} from 'lucide-react'

const SlashCommands = forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const commands = [
    {
      title: 'Heading 1',
      description: 'Big section heading',
      icon: <Heading size={16} />,
      command: () => {
        props.editor
          .chain()
          .focus()
          .deleteRange(props.range)
          .setNode('heading', { level: 1 })
          .run()
      }
    },
    {
      title: 'Heading 2',
      description: 'Medium section heading',
      icon: <Hash size={16} />,
      command: () => {
        props.editor
          .chain()
          .focus()
          .deleteRange(props.range)
          .setNode('heading', { level: 2 })
          .run()
      }
    },
    {
      title: 'Heading 3',
      description: 'Small section heading',
      icon: <Hash size={16} />,
      command: () => {
        props.editor
          .chain()
          .focus()
          .deleteRange(props.range)
          .setNode('heading', { level: 3 })
          .run()
      }
    },
    {
      title: 'Bullet List',
      description: 'Create a simple bullet list',
      icon: <List size={16} />,
      command: () => {
        props.editor
          .chain()
          .focus()
          .deleteRange(props.range)
          .toggleBulletList()
          .run()
      }
    },
    {
      title: 'Quote',
      description: 'Capture a quote',
      icon: <Quote size={16} />,
      command: () => {
        props.editor
          .chain()
          .focus()
          .deleteRange(props.range)
          .toggleBlockquote()
          .run()
      }
    },
    {
      title: 'Code Block',
      description: 'Capture a code snippet',
      icon: <Code size={16} />,
      command: () => {
        props.editor
          .chain()
          .focus()
          .deleteRange(props.range)
          .toggleCodeBlock()
          .run()
      }
    },
    {
      title: 'Text',
      description: 'Just start writing with plain text',
      icon: <Type size={16} />,
      command: () => {
        props.editor
          .chain()
          .focus()
          .deleteRange(props.range)
          .setParagraph()
          .run()
      }
    }
  ]

  const selectItem = (index) => {
    const item = commands[index]
    if (item) {
      item.command() // Pass command closure to Suggestion
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + commands.length - 1) % commands.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % commands.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }
      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }
      if (event.key === 'Enter') {
        enterHandler()
        return true
      }
      return false
    }
  }))

  return (
    <div className="bg-white border rounded-lg shadow-lg p-1 max-w-xs min-w-[250px] max-h-80 overflow-y-auto z-50">
      {commands.map((item, index) => (
        <button
          key={index}
          className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 hover:bg-gray-100 ${
            index === selectedIndex ? 'bg-gray-100' : ''
          }`}
          onClick={() => selectItem(index)}
        >
          <div className="flex-shrink-0 text-gray-600">
            {item.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {item.title}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {item.description}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
})

SlashCommands.displayName = 'SlashCommands'

export default SlashCommands

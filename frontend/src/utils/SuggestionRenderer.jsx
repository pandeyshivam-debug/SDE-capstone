import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import SlashCommands from '../components/SlashCommands';

export default {
  items: ({ query }) => {
    return [
      'Heading 1',
      'Heading 2', 
      'Heading 3',
      'Bullet List',
      'Quote',
      'Code Block',
      'Text'
    ]
    .filter(item => item.toLowerCase().startsWith(query.toLowerCase()))
    .slice(0, 10);
  },

  render: () => {
    let component;
    let popup;

    return {
      onStart: (props) => {
        component = new ReactRenderer(SlashCommands, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        });
      },

      onUpdate(props) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide();
          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};
